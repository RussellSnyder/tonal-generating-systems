import ABCJS from 'abcjs';
import { useEffect, useRef } from 'react';
import { Chord, Note, Scale } from "tonal";


function noteNameToAbc(noteName) {
  const match = /^([A-Ga-g])([#b]{1,2})?(\d+)$/.exec(noteName)
  if (!match) return noteName


  const [, letter, accidental, octaveString] = match
const octave = Number(octaveString ? octaveString : 4)
  let abcAccidental = ''

  switch(accidental) {
    case 'bb':
      abcAccidental = `__`
      break;
    case 'b':
      abcAccidental = `_`
      break;
    case '#':
      abcAccidental = `^`
      break;
    case '##':
      abcAccidental = `^^`
      break;
  }

  if (octave === 4) return `${abcAccidental}${letter}`
  if (octave === 5) return `${abcAccidental}${letter.toLowerCase()}`
  if (octave === 6) return `${abcAccidental}${letter.toLowerCase()}'`

  // generic fallback for other octaves
  const diff = octave - 4
  const octaveMarker = diff > 0 ? "'".repeat(diff) : ",".repeat(Math.abs(diff))
  return `${abcAccidental}${letter.toLowerCase()}${octaveMarker}`
}

function createABCScale(root, scaleRoot, scale) {
  const range = Scale.rangeOf(`${scaleRoot} ${scale}`)
  const rangeStart = root.toUpperCase() + '4'
  const rangeEnd = Note.transpose(rangeStart, 'M7')
  const notes = range(rangeStart, rangeEnd)
  return notes.map(noteNameToAbc)
}

function getAbcChordNotation(root, chord, scales, clefValue) {
    const chordNotes = Chord.notes(chord, root + 4).map(noteNameToAbc)
    const roots = scales.map(({distanceFromRoot}) => Note.transpose(root, distanceFromRoot))
    const scaleNotes = scales.map(({name}, i) => createABCScale(root, roots[i], name))
  const firstChord = `"${root}${chord}" [${chordNotes.join(' ')}]`

  const groupedScaleNotes = groupScalesForDisplay(scaleNotes)

  const abcScales = groupedScaleNotes.map((scaleNotes, i) =>
    (scaleNotes.map((sn, j) => {
        const index = i * scaleNotes.length + j
        return `"^${roots[index]} ${scales[index].name}" ${sn.join(' ')}`
    }).join(' | ')
  )).join(' \n ')

  return [
    'X:1',
    'L:4/4',
    `V:1 clef=${clefValue}`,
    `${firstChord} || ${abcScales} |`,
  ].join('\n')
}

function chunkItems(items, size) {
  const chunks = []

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }

  return chunks
}

function groupScalesForDisplay(scales) {
  if (!Array.isArray(scales) || scales.length === 0) {
    return []
  }

  if (scales.length === 6) {
    return chunkItems(scales, 3)
  }

  if (scales.length === 8) {
    return chunkItems(scales, 4)
  }

  return [scales]
}

function ChordScaleComponent({ name='yolo', chord="major seventh", scales=[], root = 'C', clefValue = 'treble' }) {
  const staffRef = useRef(null)

  useEffect(() => {
    if (!staffRef.current) {
      return
    }

    ABCJS.renderAbc(staffRef.current, getAbcChordNotation(root, chord, scales,clefValue), {
      responsive: 'resize',
    })
  }, [chord, clefValue, root, scales])

  return (
    <section className="chord-scale-component" aria-label={`Chord and scales for ${root}`}>
      <div className="chord-scale-header">
        <span className="chord-scale-root">{root}{name}</span>
      </div>
      <div ref={staffRef} className="abcjs-notation" />
    </section>
  )
}

export default ChordScaleComponent
