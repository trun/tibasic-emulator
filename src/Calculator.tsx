import React, { useState } from 'react'
import HomeScreen, { MAX_COLS } from './tibasic/screen/HomeScreen'
import Interpreter from './tibasic/interpreter/Interpreter'
import Scanner from './tibasic/lexer/scanner'
import Parser from './tibasic/parser/Parser'

import './Calculator.css'
import './fonts/ti-83-plus-large.ttf'

const screen = new HomeScreen()
const interpreter = new Interpreter(screen)

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

function Calculator() {
  const [screenText, setScreenText] = useState(screen.getChars())
  const [input, setInput] = useState('')

  const handleExecute = (e: any) => {
    e.preventDefault()
    if (input === '') {
      const tokens = new Scanner().scan(PRINT_KEY_PRGM)
      const astNode = new Parser(tokens).parse()
      interpreter.interpret(astNode)
      setScreenText(screen.getChars())
    } else {
      const tokens = new Scanner().scan(input)
      const astNode = new Parser(tokens).parse()
      interpreter.interpret(astNode)
      setScreenText(screen.getChars())
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code in SIMPLIFIED_KEY_MAP) {
      interpreter.setLastKey(SIMPLIFIED_KEY_MAP[e.code])
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