import React from 'react'
import './App.css'
import Calculator from './Calculator'
import BLACKJACK_PRGM from './programs/Blackjack'
import SLOTS_PRGM from './programs/Slots'

function App() {
  return (
    <div className="App">
      <Calculator programSource={SLOTS_PRGM} />
    </div>
  )
}

export default App
