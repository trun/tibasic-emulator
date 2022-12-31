import React, { useEffect, useState } from 'react'
import HomeScreen, { MAX_COLS } from './tibasic/screen/HomeScreen'
import Interpreter from './tibasic/interpreter/Interpreter'
import Scanner from './tibasic/lexer/scanner'
import Parser from './tibasic/parser/Parser'

import './Calculator.css'
import './fonts/ti-83-plus-large.ttf'

const screen = new HomeScreen()

const SIMPLIFIED_KEY_MAP: { [key: string]: number } = {
  'ArrowLeft': 24,
  'ArrowTop': 25,
  'ArrowRight': 26,
  'ArrowDown': 34,
  'Enter': 105,
  'Digit0': 102,
  'Digit1': 92,
  'Digit2': 93,
  'Digit3': 94,
  'Digit4': 82,
  'Digit5': 83,
  'Digit6': 84,
  'Digit7': 72,
  'Digit8': 73,
  'Digit9': 74,
}

const PRINT_KEY_PRGM = `
LBL HOME
REPEAT Ans
getKey
END
Ans -> K
DISP "YOU PRESSED...", K
GOTO HOME
`

const LOOP_PRGM = `
0 -> X
LBL HOME
X + 1 -> X
DISP "Counter...", X
GOTO HOME
`

function Calculator() {
  const [screenText, setScreenText] = useState(screen.getChars())
  const [interpreter, setInterpreter] = useState<Interpreter>()
  const [input, setInput] = useState('')

  const handleExecute = (e: any) => {
    e.preventDefault()
    if (input === '') {
      const tokens = new Scanner().scan(LOOP_PRGM)
      const program = new Parser(tokens).parse()
      setInterpreter(new Interpreter(screen, program))
      setScreenText(screen.getChars())
    } else {
      const tokens = new Scanner().scan(input)
      const program = new Parser(tokens).parse()
      setInterpreter(new Interpreter(screen, program))
      setScreenText(screen.getChars())
      setInput('')
    }
  }

  useEffect(() => {
    if (!interpreter) {
      return
    }

    const interval = setInterval(() => {
      if (interpreter.hasNext()) {
        interpreter.next()
        setScreenText(screen.getChars())
      }
    }, 10)
    return () => clearInterval(interval);
  }, [interpreter])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code in SIMPLIFIED_KEY_MAP) {
      interpreter?.setLastKey(SIMPLIFIED_KEY_MAP[e.code])
    }
  }

  return (
    <div className="calculator">
      <div className="screen" onKeyDown={handleKeyDown} tabIndex={0}>
        {screenText.split('').map((char, i) => (
          <div key={i} className="screen-cell" style={{
            gridColumn: `${(i % MAX_COLS) + 1} / ${(i % MAX_COLS) + 1}`,
            gridRow: `${Math.floor(i / MAX_COLS) + 1} / ${Math.floor(i / MAX_COLS) + 1}`,
          }}>
            {char}
          </div>
        ))}
      </div>
      <form className="repl" onSubmit={handleExecute}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} />
        <button onClick={handleExecute}>Run</button>
      </form>
    </div>
  )
}

export default Calculator
