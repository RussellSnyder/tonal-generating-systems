import { useState } from 'react'
import HarmonicMajorSystem from './harmonic-major-system'
import HarmonicMinorSystem from './harmonic-minor-system'
import MajorSystem from './major-system'
import MelodicMinorSystem from './melodic-minor-system'

const DEFAULT_KEYS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
const CLEFS = [
  { value: 'treble', label: 'Treble' },
  { value: 'bass', label: 'Bass' },
  { value: 'alto', label: 'Alto' },
]

function SystemWrapper({ keys = DEFAULT_KEYS }) {
  const [selectedKey, setSelectedKey] = useState(keys[0])
  const [selectedClef, setSelectedClef] = useState(CLEFS[0].value)

  return (
    <>
      <section aria-labelledby="system-controls-title">
        <h2 id="system-controls-title">System controls</h2>
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
      </section>
      <MajorSystem keyValue={selectedKey} clefValue={selectedClef} />
      <MelodicMinorSystem keyValue={selectedKey} clefValue={selectedClef} />
      <HarmonicMinorSystem keyValue={selectedKey} clefValue={selectedClef} />
      <HarmonicMajorSystem keyValue={selectedKey} clefValue={selectedClef} />
    </>
  )
}

export default SystemWrapper