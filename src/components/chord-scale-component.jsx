import ABCJS from 'abcjs';
import { useEffect, useRef } from 'react';
import { Chord, Note } from 'tonal';
import { createABCScale, groupScalesForDisplay, noteNameToAbc } from '../utils/abc-notation';

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
