import ABCJS from 'abcjs'
import { useEffect, useState } from 'react'

const DEFAULT_SCALES = ['Major', 'Melodic Minor', 'Harmonic Minor', 'Harmonic Major']
const DEFAULT_KEYS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
const MAJOR_SCALE_NOTES = {
  C: 'C D E F G A B c',
  'C#': '^C ^D ^E ^F ^G ^A ^B ^c',
  D: 'D E ^F G A B ^c d',
  Eb: '_E F G _A _B c d _e',
  E: 'E ^F ^G A B ^c ^d e',
  F: 'F G A _B c d e f',
  'F#': '^F ^G ^A ^B ^c ^d ^e ^f',
  G: 'G A B c d e ^f g',
  Ab: '_A _B c _d _e f g _a',
  A: 'A B ^c d e ^f ^g a',
  Bb: '_B c d _e f g a _b',
  B: 'B ^c ^d e ^f ^g ^a b',
}

function ScaleSystem({
  keys = DEFAULT_KEYS,
  keyValue,
  onKeyChange,
  scales = DEFAULT_SCALES,
  value,
  onChange,
}) {
  const [internalKey, setInternalKey] = useState(keys[0])
  const selectedKey = keyValue ?? internalKey
  const scaleNotes = MAJOR_SCALE_NOTES[selectedKey] ?? MAJOR_SCALE_NOTES.C

  useEffect(() => {
    ABCJS.renderAbc(
      'abc',
      `X:2
T:${selectedKey} major scale
M:9/4
L:4/4
${scaleNotes}`,
    )
  }, [scaleNotes, selectedKey])

  return (
    <>
    <section aria-labelledby="scale-system-title">
      <label htmlFor="key-select">Choose a key</label>
      <select
        id="key-select"
        value={selectedKey}
        onChange={(event) => {
          setInternalKey(event.target.value)
          onKeyChange?.(event.target.value)
        }}
      >
        {keys.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </section>
    <section id="abc" aria-label={`${selectedKey} major scale notation`} />
    </>
  )
}

export default ScaleSystem
