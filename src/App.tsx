import React, { useEffect, useState } from 'react';
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

const PROGRAMS: { [name: string]: string } = {
  'Slots': SLOTS_PRGM,
  'Blackjack': BLACKJACK_PRGM,
  'Demo': DEMO_PRGM,
}

const HINTS: { [name: string]: string } = {
  'Slots': 'Press Enter to continue...',
  'Blackjack': 'Press Enter to continue...',
  'Demo': 'Press any TI83 key to see the key code...',
}

function App() {
  const [ready, setReady] = useState(false)
  const [program, setProgram] = useState('Slots')
  const [showOptions, setShowOptions] = useState(true)

  useEffect(() => {
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search)
      if (params.has('program') && params.get('program')! in PROGRAMS) {
        setProgram(params.get('program')!)
        setShowOptions(false)
      }
    }
    setReady(true)
  }, [])

  if (!ready) {
    return <div />
  }

  return (
    <div className="App">
      <Calculator key={program} programSource={PROGRAMS[program]} />
      {showOptions && (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          marginLeft: '10px',
        }}>
          <pre style={{marginRight: '5px'}}>Program:</pre>
          <select value={program} onChange={(e) => setProgram(e.currentTarget.value)}>
            {Object.entries(PROGRAMS).map(([key, value]) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          <pre style={{marginLeft: '10px'}}>{HINTS[program]}</pre>
        </div>
      )}
    </div>
  )
}

export default App
