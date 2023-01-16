import React from 'react'
import './App.css'
import Calculator from './Calculator'
import BLACKJACK_PRGM from './programs/Blackjack'
import SLOTS_PRGM from './programs/Slots'

const DEMO_PRGM = `
Disp "Press a key..."
Lbl A
Repeat Ans
getKey -> X
End
Disp "You pressed: ", X
Goto A
`

function App() {
  return (
    <div className="App">
      <Calculator programSource={SLOTS_PRGM} />
    </div>
  )
}

export default App
