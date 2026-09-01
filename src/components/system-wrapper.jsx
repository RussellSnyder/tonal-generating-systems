import { useState } from 'react'
import { DEFAULT_KEYS, TONAL_SYSTEMS } from '../data/tonal-systems'
import TonalSystem from './tonal-system'

const CLEFS = [
  { value: 'treble', label: 'Treble' },
  { value: 'bass', label: 'Bass' },
  { value: 'alto', label: 'Alto' },
]

const CHORD_TYPES = [
  { value: 'four-note', label: '4-note chords' },
  { value: 'triad', label: 'Triads' },
]

function SystemWrapper({ keys = DEFAULT_KEYS }) {
  const [selectedKey, setSelectedKey] = useState(keys[0])
  const [selectedClef, setSelectedClef] = useState(CLEFS[0].value)
  const [selectedChordType, setSelectedChordType] = useState(CHORD_TYPES[0].value)
  const [octaveShift, setOctaveShift] = useState(0)

  return (
    <>
      <section className="system-controls" aria-labelledby="system-controls-title">
        <div>
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
        </div>
        <div>
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
        </div>
        <div>
          <label htmlFor="chord-type-select">Choose chord type</label>
          <select
            id="chord-type-select"
            value={selectedChordType}
            onChange={(event) => setSelectedChordType(event.target.value)}
          >
            {CHORD_TYPES.map((chordType) => (
              <option key={chordType.value} value={chordType.value}>
                {chordType.label}
              </option>
            ))}
          </select>
        </div>
        <div>
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
        </div>
      </section>
      {TONAL_SYSTEMS.map((system) => (
        <TonalSystem
          key={system.id}
          system={system}
          keyValue={selectedKey}
          clefValue={selectedClef}
          chordType={selectedChordType}
          octaveShift={octaveShift}
        />
      ))}
    </>
  )
}

export default SystemWrapper