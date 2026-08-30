import ABCJS from 'abcjs'
import { useEffect } from 'react'

function toNextOctave(noteToken) {
  return noteToken.replace(/[A-Ga-g]$/, (note) => note.toLowerCase())
}

function toLowerOctave(noteToken) {
  return noteToken.replace(/[A-Ga-g]$/, (note) =>
    note === note.toLowerCase() ? note.toUpperCase() : `${note},`,
  )
}

function alterNote(noteToken, semitones) {
  if (!Number.isInteger(semitones) || semitones < -2 || semitones > 2) {
    return noteToken
  }

  const noteMatch = noteToken.match(/^([_^]*)([A-Ga-g])$/)
  if (!noteMatch) {
    return noteToken
  }

  const [, accidental, note] = noteMatch
  const currentAccidental = accidental.startsWith('^')
    ? accidental.length
    : -accidental.length
  const adjustedAccidental = currentAccidental + semitones

  if (adjustedAccidental < -2 || adjustedAccidental > 2) {
    return noteToken
  }

  const accidentalSymbol = adjustedAccidental > 0
    ? '^'.repeat(adjustedAccidental)
    : '_'.repeat(-adjustedAccidental)

  return `${accidentalSymbol}${note}`
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

function TonalSystem({ system, keyValue = 'C', clefValue = 'treble' }) {
  const selectedKey = keyValue
  const scaleNotes = system.scaleNotes[selectedKey] ?? system.scaleNotes.C
  const scaleDegrees = scaleNotes.split(' ')
  const createChord = (
    degree,
    chordQuality = system.chordQualities[degree],
    noteAlterations = {},
    showSymbol = true,
    noteDegrees = [0, 2, 4, 6],
    rootDegree = degree,
    parenthesized = false,
  ) => {
    const chordNotes = noteDegrees.map((interval, noteIndex) => {
      const scaleIndex = degree + interval
      const noteToken = scaleDegrees[scaleIndex]
      const chordNote = noteToken ?? toNextOctave(scaleDegrees[scaleIndex - 7])

      return alterNote(chordNote, noteAlterations[noteIndex])
    })
    const renderedChordNotes =
      clefValue === 'bass' || clefValue === 'alto'
        ? chordNotes.map(toLowerOctave)
        : chordNotes
    const chordRoot = toChordRoot(scaleDegrees[rootDegree])
    const chordLabel = parenthesized
      ? `(${chordRoot}${chordQuality})`
      : `${chordRoot}${chordQuality}`
    const chordSymbol = `"${chordLabel}"`
    const renderedChord = showSymbol
      ? `${chordSymbol}[${renderedChordNotes.join('')}]`
      : `[${renderedChordNotes.join('')}]`

    return renderedChord
  }

  const chordEntries = Array.from({ length: 7 }, (unused, degree) => [
    { notation: createChord(degree) },
    ...(system.extraChords ?? [])
      .filter((extraChord) => extraChord.afterDegree === degree)
      .map((extraChord) => ({
        notation: createChord(
          extraChord.degree,
          extraChord.quality,
          extraChord.noteAlterations,
          extraChord.showSymbol,
          extraChord.noteDegrees,
          extraChord.rootDegree,
          extraChord.parenthesized,
        ),
      })),
  ]).flat()
  const chordProgression = chordEntries.map((entry) => entry.notation).join(' ')

  useEffect(() => {
    ABCJS.renderAbc(
      system.id,
      `X:${system.abcId}
T:${system.title}
V:1 clef=${clefValue}
L:4/4
${chordProgression}`,
    )
  }, [chordProgression, clefValue, selectedKey, system])

  return (
    <section
      id={system.id}
      aria-label={`${selectedKey} ${system.ariaLabel}`}
    />
  )
}

export default TonalSystem