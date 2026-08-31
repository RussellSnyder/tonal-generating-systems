import { useState } from 'react'
import { DEFAULT_KEYS, TONAL_SYSTEMS } from '../data/tonal-systems'
import TonalSystem from './tonal-system'

const CLEFS = [
  { value: 'treble', label: 'Treble' },
  { value: 'bass', label: 'Bass' },
  { value: 'alto', label: 'Alto' },
]

function SystemWrapper({ keys = DEFAULT_KEYS }) {
  const [selectedKey, setSelectedKey] = useState(keys[0])
  const [selectedClef, setSelectedClef] = useState(CLEFS[0].value)
  const [octaveShift, setOctaveShift] = useState(0)

  return (
    <>
      <section className="system-controls" aria-labelledby="system-controls-title">
        <label htmlFor="key-select">Choose a key</label>
        <select
          id="key-select"
          value={selectedKey}
          onChange={(event) => setSelectedKey(event.target.value)}
        >
          {keys.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
        <label htmlFor="clef-select">Choose a clef</label>
        <select
          id="clef-select"
          value={selectedClef}
          onChange={(event) => setSelectedClef(event.target.value)}
        >
          {CLEFS.map((clef) => (
            <option key={clef.value} value={clef.value}>
              {clef.label}
            </option>
          ))}
        </select>
        <label htmlFor="octave-select">Choose an octave</label>
        <select
          id="octave-select"
          value={octaveShift}
          onChange={(event) => setOctaveShift(Number(event.target.value))}
        >
          <option value={1}>Start at {selectedKey}5</option>
          <option value={0}>Start at {selectedKey}4</option>
          <option value={-1}>Start at {selectedKey}3</option>
          <option value={-2}>Start at {selectedKey}2</option>
        </select>
      </section>
      {TONAL_SYSTEMS.map((system) => (
        <TonalSystem
          key={system.id}
          system={system}
          keyValue={selectedKey}
          clefValue={selectedClef}
          octaveShift={octaveShift}
        />
      ))}
    </>
  )
}

export default SystemWrapper