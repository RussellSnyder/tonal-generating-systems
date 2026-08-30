import ABCJS from 'abcjs'
import { useEffect } from 'react'

const HARMONIC_MINOR_SEVENTH_QUALITIES = ['mMaj7', 'm7b5', 'maj7#5', 'm7', '7', 'maj7', 'dim7']
const HARMONIC_MINOR_SCALE_NOTES = {
  C: 'C D _E F G _A B c',
  'C#': '^C ^D E ^F ^G A ^B ^c',
  D: 'D E F G A _B ^c d',
  Eb: '_E F _G _A _B _c ^d _e',
  E: 'E ^F G A B c ^d e',
  F: 'F G _A _B c _d e f',
  'F#': '^F ^G A B ^c d ^e ^f',
  G: 'G A _B c d _e ^f g',
  Ab: '_A _B _c _d _e _f g _a',
  A: 'A B c d e f ^g a',
  Bb: '_B c _d _e f _g a _b',
  B: 'B ^c d e ^f g ^a b',
}

function toNextOctave(noteToken) {
  return noteToken.replace(/[A-Ga-g]$/, (note) => note.toLowerCase())
}

function toLowerOctave(noteToken) {
  return noteToken.replace(/[A-Ga-g]$/, (note) =>
    note === note.toLowerCase() ? note.toUpperCase() : `${note},`,
  )
}

function toChordRoot(noteToken) {
  const noteLetter = noteToken.slice(-1).toUpperCase()
  const accidental = noteToken.startsWith('^')
    ? '#'
    : noteToken.startsWith('_')
      ? 'b'
      : ''

  return `${noteLetter}${accidental}`
}

function HarmonicMinorSystem({ keyValue = 'C', clefValue = 'treble' }) {
  const selectedKey = keyValue
  const scaleNotes =
    HARMONIC_MINOR_SCALE_NOTES[selectedKey] ?? HARMONIC_MINOR_SCALE_NOTES.C
  const scaleDegrees = scaleNotes.split(' ')
  const chordProgression = Array.from({ length: 7 }, (unused, degree) => {
    const chordNotes = [0, 2, 4, 6].map((interval) => {
      const scaleIndex = degree + interval
      const noteToken = scaleDegrees[scaleIndex]

      return noteToken ?? toNextOctave(scaleDegrees[scaleIndex - 7])
    })
    const renderedChordNotes =
      clefValue === 'bass' || clefValue === 'alto'
        ? chordNotes.map(toLowerOctave)
        : chordNotes

    const chordRoot = toChordRoot(scaleDegrees[degree])
    const chordQuality = HARMONIC_MINOR_SEVENTH_QUALITIES[degree]

    return `"${chordRoot}${chordQuality}"[${renderedChordNotes.join('')}]`
  }).join(' ')

  useEffect(() => {
    ABCJS.renderAbc(
      'abc-harmonic-minor',
      `X:4
T:Harmonic Minor
V:1 clef=${clefValue}
L:4/4
${chordProgression}`,
    )
  }, [chordProgression, clefValue, selectedKey])

  return (
    <section
      id="abc-harmonic-minor"
      aria-label={`${selectedKey} harmonic minor notation`}
    />
  )
}

export default HarmonicMinorSystem