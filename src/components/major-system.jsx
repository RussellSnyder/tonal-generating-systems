import ABCJS from 'abcjs'
import { useEffect } from 'react'

const MAJOR_SEVENTH_QUALITIES = ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7b5']
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

function MajorSystem({ keyValue = 'C', clefValue = 'treble' }) {
  const selectedKey = keyValue
  const scaleNotes = MAJOR_SCALE_NOTES[selectedKey] ?? MAJOR_SCALE_NOTES.C
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
    const chordQuality = MAJOR_SEVENTH_QUALITIES[degree]

    return `"${chordRoot}${chordQuality}"[${renderedChordNotes.join('')}]`
  }).join(' ')

  useEffect(() => {
    ABCJS.renderAbc(
      'abc-major',
      `X:2
T:Major
V:1 clef=${clefValue}
L:4/4
${chordProgression}`,
    )
  }, [chordProgression, clefValue, selectedKey])

  return (
    <section id="abc-major" aria-label={`${selectedKey} major scale notation`} />
  )
}

export default MajorSystem
