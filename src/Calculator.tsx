import React, { useEffect, useMemo, useRef, useState } from 'react';
import HomeScreen, { MAX_COLS, MAX_ROWS } from './tibasic/screen/HomeScreen'
import MenuScreen from './tibasic/screen/MenuScreen'
import Interpreter from './tibasic/interpreter/Interpreter'
import Scanner from './tibasic/lexer/scanner'
import Parser from './tibasic/parser/Parser'

import './Calculator.css'
import './fonts/ti-83-plus-large.ttf'

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
  'NumpadEnter': 105,
  'Numpad0': 102,
  'Numpad1': 92,
  'Numpad2': 93,
  'Numpad3': 94,
  'Numpad4': 82,
  'Numpad5': 83,
  'Numpad6': 84,
  'Numpad7': 72,
  'Numpad8': 73,
  'Numpad9': 74,
}

type RunMode = 'Run' | 'Pause' | 'Input'
type ScreenMode = 'Home' | 'Menu'

function Calculator({ programSource }: { programSource: string }) {
  const homeScreen = useMemo(() => new HomeScreen(), [])
  const menuScreen = useMemo(() => new MenuScreen(), [])

  const [debounceKey, setDebounceKey] = useState<string | null>(null)
  const [screenMode, setScreenMode] = useState<ScreenMode>('Home')
  const [screenText, setScreenText] = useState(homeScreen.getChars())
  const [screenInput, setScreenInput] = useState('')
  const [screenCursor, setScreenCursor] = useState(homeScreen.getCursor())
  const [menuTitle, setMenuTitle] = useState(menuScreen.getTitle())
  const [menuLabels, setMenuLabels] = useState(menuScreen.getLabels())
  const [menuCurrentIndex, setMenuCurrentIndex] = useState(menuScreen.getCurrentIndex())
  const [interpreter, setInterpreter] = useState<Interpreter>()
  const [runMode, setRunMode] = useState<RunMode>('Run')
  const calculatorRef = useRef<HTMLDivElement>(null)

  const runModeRef = useRef(runMode)
  const homeScreenRef = useRef(homeScreen)
  const menuScreenRef = useRef(menuScreen)
  const screenModeRef = useRef(screenMode)

  // focus the calculator on first render
  useEffect(() => {
    calculatorRef.current?.focus()
  }, [])

  // update refs on each re-render
  useEffect(() => {
    runModeRef.current = runMode;
    homeScreenRef.current = homeScreen;
    menuScreenRef.current = menuScreen;
    screenModeRef.current = screenMode;
  })

  // re-initialize the interpreter whenever the programSource changes
  useEffect(() => {
    const tokens = new Scanner().scan(programSource)
    const program = new Parser(tokens).parse()
    setInterpreter(new Interpreter(homeScreenRef.current, menuScreenRef.current, program))
    setScreenText(homeScreenRef.current.getChars())
    setScreenCursor(homeScreenRef.current.getCursor())
    setMenuTitle(menuScreenRef.current.getTitle())
    setMenuLabels(menuScreenRef.current.getLabels())
  }, [programSource])

  // run the "clock" for the interpreter
  useEffect(() => {
    if (!interpreter) {
      return
    }

    const interval = setInterval(() => {
      if (runModeRef.current === 'Run' && interpreter.hasNext()) {
        const nextStatus = interpreter.next()

        if (nextStatus.status === 'Input') {
          setRunMode('Input')
        } else if (nextStatus.status === 'Pause') {
          setRunMode('Pause')
        } else {
          setRunMode('Run')
        }
        setScreenMode(nextStatus.screen)
      }
      setScreenText(homeScreenRef.current.getChars())
      setScreenCursor(homeScreenRef.current.getCursor())
      setMenuTitle(menuScreenRef.current.getTitle())
      setMenuLabels(menuScreenRef.current.getLabels())
      setMenuCurrentIndex(menuScreenRef.current.getCurrentIndex())
    }, TICK_SPEED_MS)
    return () => clearInterval(interval);
  }, [interpreter])

  const combinedScreenText = screenText.substring(0, screenCursor) +
    screenInput + screenText.substring(screenCursor + screenInput.length)
  const combinedScreenCursor = screenCursor + screenInput.length

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.code === debounceKey) {
      setDebounceKey(null)
    }

    if (screenMode === 'Menu') {
      if (e.code === 'Enter') {
        setRunMode('Run')
      } else if (e.code.startsWith('Digit')) {
        const index = parseInt(e.code.substring('Digit'.length)) - 1
        if (index < menuScreen.getLabels().length) {
          menuScreen.setCurrentIndex(index)
          setRunMode('Run')
        }
      } else if (e.code.startsWith('Numpad') && Number.isInteger(parseInt(e.code.substring('Numpad'.length)))) {
        const index = parseInt(e.code.substring('Numpad'.length)) - 1
        if (index < menuScreen.getLabels().length) {
          menuScreen.setCurrentIndex(index)
          setRunMode('Run')
        }
      }
    } else if (screenMode === 'Home') {
      if (e.code in SIMPLIFIED_KEY_MAP) {
        interpreter?.setLastKey(SIMPLIFIED_KEY_MAP[e.code])
      }

      if (runMode === 'Input') {
        if (e.key.length === 1) {
          setScreenInput(screenInput + e.key)
        }
      }

      if (runMode !== 'Run' && e.code === 'Enter') {
        console.log('Setting mode to run...')
        interpreter?.setInput(screenInput)
        setScreenInput('')
        setRunMode('Run')
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === debounceKey) {
      return
    }

    setDebounceKey(e.code)

    if (screenMode === 'Menu') {
      if (e.code === 'ArrowUp') {
        menuScreen.prevOption()
      } else if (e.code === 'ArrowDown') {
        menuScreen.nextOption()
      }
    } else if (screenMode === 'Home') {
      if (e.code === 'Backspace') {
        setScreenInput(screenInput.substring(0, screenInput.length - 1))
      }
    }
  }

  return (
    <div className="calculator">
      {screenMode === 'Home' ? (
        <div ref={calculatorRef} key="screen" className="screen" onKeyUp={handleKeyUp} onKeyDown={handleKeyDown} tabIndex={0}>
          {combinedScreenText.split('').map((char, i) => (
            <div key={i} className={`screen-cell ${combinedScreenCursor === i && runMode === 'Input' && 'inverted'}`} style={{
              gridColumn: `${(i % MAX_COLS) + 1} / ${(i % MAX_COLS) + 1}`,
              gridRow: `${Math.floor(i / MAX_COLS) + 1} / ${Math.floor(i / MAX_COLS) + 1}`,
            }}>
              {char}
            </div>
          ))}
        </div>
      ) : (
        <div ref={calculatorRef} key="screen" className="screen" onKeyUp={handleKeyUp} onKeyDown={handleKeyDown} tabIndex={0}>
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
    </div>
  )
}

export default Calculator
