import React, { useState } from 'react'
import HomeScreen, { MAX_COLS } from './tibasic/screen/HomeScreen'
import Interpreter from './tibasic/interpreter/Interpreter'
import Scanner from './tibasic/lexer/scanner'
import Parser from './tibasic/parser/Parser'

import './Calculator.css'
import './fonts/ti-83-plus-large.ttf'

const screen = new HomeScreen()
const interpreter = new Interpreter(screen)

function Calculator() {
  const [screenText, setScreenText] = useState(screen.getChars())
  const [input, setInput] = useState('')

  const handleExecute = (e: any) => {
    e.preventDefault()

    const tokens = new Scanner().scan(input)
    console.log(tokens)
    const astNode = new Parser(tokens).parse()
    console.log(astNode)
    interpreter.interpret(astNode)
    setScreenText(screen.getChars())
    setInput('')
  }

  return (
    <div className="calculator">
      <div className="screen">
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