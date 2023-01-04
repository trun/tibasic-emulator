import React, { useEffect, useState } from 'react'
import HomeScreen, { MAX_COLS, MAX_ROWS } from './tibasic/screen/HomeScreen'
import Interpreter from './tibasic/interpreter/Interpreter'
import Scanner from './tibasic/lexer/scanner'
import Parser from './tibasic/parser/Parser'
import FIDDLE_PRGM from './tibasic/programs/Fiddle'

import './Calculator.css'
import './fonts/ti-83-plus-large.ttf'
import MenuScreen from './tibasic/screen/MenuScreen'

const homeScreen = new HomeScreen()
const menuScreen = new MenuScreen()

// TI-83 clock speed is 1000 Hz
const TICK_SPEED_MS = 1

const SIMPLIFIED_KEY_MAP: { [key: string]: number } = {
  'ArrowLeft': 24,
  'ArrowUp': 25,
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
OUTPUT(1,1,"YOUR KEY: ")
OUTPUT(1,11,"   ")
OUTPUT(1,11,K)
GOTO HOME
`

const PAUSE_PRGM = `
FOR(X,1,10)
PAUSE X
END
`

const TIMER_PRGM = `
FOR(X,1,10000)
OUTPUT(1,1,X/1000)
END
`

const IF_PRGM = `
LBL HOME
REPEAT Ans
getKey
END
Ans -> K
OUTPUT(1,1,"YOUR KEY: ")
OUTPUT(1,11,"   ")
IF K = 24
THEN
OUTPUT(1,11,"<--")
ELSE
OUTPUT(1,11,K)
END
GOTO HOME
`

const WHILE_PRGM = `
1 -> X
WHILE X < 0
OUTPUT(1,1,"LOOP")
END
OUTPUT(2,1,"END")
`

const MENU_PRGM = `
Lbl 1
ClrHome
Disp "Hello"
Pause
Menu("DEAL AGAIN?","YES",1,"LEAVE TABLE",99)
Lbl 99
Disp "End Game"
Pause
`

const LBL_PRGM = `
Lbl 1A
`

type ScreenMode = 'Home' | 'Menu'

function Calculator() {
  const [screenMode, setScreenMode] = useState<ScreenMode>('Home')
  const [screenText, setScreenText] = useState(homeScreen.getChars())
  const [menuTitle, setMenuTitle] = useState(menuScreen.getTitle())
  const [menuLabels, setMenuLabels] = useState(menuScreen.getLabels())
  const [menuCurrentIndex, setMenuCurrentIndex] = useState(menuScreen.getCurrentIndex())
  const [interpreter, setInterpreter] = useState<Interpreter>()
  const [running, setRunning] = useState<boolean>(true)
  const [input, setInput] = useState('')

  const handleExecute = (e: any) => {
    e.preventDefault()
    if (input === '') {
      const tokens = new Scanner().scan(FIDDLE_PRGM)
      const program = new Parser(tokens).parse()
      setInterpreter(new Interpreter(homeScreen, menuScreen, program))
      setScreenText(homeScreen.getChars())
      setMenuTitle(menuScreen.getTitle())
      setMenuLabels(menuScreen.getLabels())
    } else {
      const tokens = new Scanner().scan(input)
      const program = new Parser(tokens).parse()
      setInterpreter(new Interpreter(homeScreen, menuScreen, program))
      setScreenText(homeScreen.getChars())
      setMenuTitle(menuScreen.getTitle())
      setMenuLabels(menuScreen.getLabels())
      setInput('')
    }
  }

  useEffect(() => {
    if (!interpreter) {
      return
    }

    const interval = setInterval(() => {
      if (running && interpreter.hasNext()) {
        const nextStatus = interpreter.next()
        if (nextStatus.status !== 'Run') {
          setRunning(false)
        }
        setScreenMode(nextStatus.screen)
      }
      setScreenText(homeScreen.getChars())
      setMenuTitle(menuScreen.getTitle())
      setMenuLabels(menuScreen.getLabels())
      setMenuCurrentIndex(menuScreen.getCurrentIndex())
    }, TICK_SPEED_MS)
    return () => clearInterval(interval);
  }, [interpreter, running])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (screenMode === 'Menu') {
      if (e.code === 'ArrowUp') {
        menuScreen.prevOption()
      } else if (e.code === 'ArrowDown') {
        menuScreen.nextOption()
      } else if (e.code === 'Enter') {
        setRunning(true) // resume
      } else if (e.code.startsWith('Digit')) {
        const index = parseInt(e.code.substring(5)) - 1
        if (index < menuScreen.getLabels().length) {
          menuScreen.setCurrentIndex(index)
          setRunning(true)
        }
      }
    } else {
      if (e.code in SIMPLIFIED_KEY_MAP) {
        interpreter?.setLastKey(SIMPLIFIED_KEY_MAP[e.code])
      }

      if (e.code === 'Enter' && !running) {
        setRunning(true)
      }
    }
  }

  return (
    <div className="calculator">
      {screenMode === 'Home' ? (
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
      ) : (
        <div className="screen" onKeyDown={handleKeyDown} tabIndex={0}>
          {[...Array(MAX_COLS).keys()].map(i => {
            const inverted = !!menuTitle.charAt(i)
            return (
              <div key={i} className={`screen-cell ${inverted && 'inverted'}`} style={{
                gridColumn: `${(i % MAX_COLS) + 1} / ${(i % MAX_COLS) + 1}`,
                gridRow: `${Math.floor(i / MAX_COLS) + 1} / ${Math.floor(i / MAX_COLS) + 1}`,
              }}>
                {menuTitle.charAt(i)}
              </div>
            )
          })}
          {[...Array(MAX_ROWS - 1).keys()].map(row => {
            const label = menuLabels[row]
            const selected = menuCurrentIndex === row
            return (
              [...Array(MAX_COLS).keys()].map(col => {
                if (label) {
                  const inverted = col <= 1 && selected
                  return (
                    <div key={`${row},${col}`} className={`screen-cell ${inverted && 'inverted'}`} style={{
                      gridColumn: `${col + 1} / ${col + 1}`,
                      gridRow: `${row + 2} / ${row + 2}`,
                    }}>
                      {col === 0 && (row + 1)}
                      {col === 1 && ':'}
                      {col > 1 && label.charAt(col - 2)}
                    </div>
                  )
                } else {
                  return (
                    <div key={`${row},${col}`} className="screen-cell" style={{
                      gridColumn: `${col + 1} / ${col + 1}`,
                      gridRow: `${row + 2} / ${row + 2}`,
                    }}>&nbsp;</div>
                  )
                }
              })
            )
          })}
        </div>
      )}
      <form className="repl" onSubmit={handleExecute}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} />
        <button onClick={handleExecute}>Run</button>
      </form>
    </div>
  )
}

export default Calculator
