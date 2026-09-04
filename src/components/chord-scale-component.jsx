import ABCJS from "abcjs";
import { useEffect, useRef } from "react";
import { Chord, Note, Scale } from "tonal";
import {
  abcNoteToName,
  groupScalesForDisplay,
  noteNameToAbc,
  tonal_getNoteAndOctave,
} from "../utils/abc-notation";

function getAbcChordNotation(root, chord, scales, clefValue) {
  const { note, octave } = tonal_getNoteAndOctave(root);

  const tonal_scales = scales.map(({ name, distanceFromRoot }) => {
    const scaleRoot = Note.transpose(root, distanceFromRoot);
    return Scale.get(`${scaleRoot} ${name}`).notes;
  });

  const abc_scales = tonal_scales.map((scale) => scale.map(noteNameToAbc));
  const groupedScaleNotes = groupScalesForDisplay(abc_scales);

  const tonal_firstChord = Chord.notes(chord, root);
  const abc_firstChord = tonal_firstChord.map(noteNameToAbc);

  const firstChord = `"${note}${chord}" [${abc_firstChord.join(" ")}]`;

  const abcScales = groupedScaleNotes
    .map((scaleNotes, i) =>
      scaleNotes
        .map((sn, j) => {
          const index = i * scaleNotes.length + j;
          console.log(
            `"^${tonal_scales[index]} ${scales[index].name}" ${sn.join(" ")}`,
          );
          const rootOfScale = abcNoteToName(abc_scales[index][0]);

          return `"^${rootOfScale} ${scales[index].name}" ${sn.join(" ")}`;
        })
        .join(" | "),
    )
    .join(" \n ");

  return [
    "X:1",
    "L:4/4",
    `V:1 clef=${clefValue}`,
    `${firstChord} || ${abcScales} |`,
  ].join("\n");
}

function ChordScaleComponent({
  name = "yolo",
  chord = "major seventh",
  scales = [],
  root = "C",
  clefValue = "treble",
}) {
  const staffRef = useRef(null);
  const { note } = tonal_getNoteAndOctave(root);

  useEffect(() => {
    if (!staffRef.current) {
      return;
    }

    ABCJS.renderAbc(
      staffRef.current,
      getAbcChordNotation(root, chord, scales, clefValue),
      {
        responsive: "resize",
      },
    );
  }, [chord, clefValue, root, scales]);

  return (
    <section
      className="chord-scale-component"
      aria-label={`Chord and scales for ${root}`}
    >
      <div className="chord-scale-header">
        <span className="chord-scale-root">
          {note}
          {name}
        </span>
      </div>
      <div ref={staffRef} className="abcjs-notation" />
    </section>
  );
}

export default ChordScaleComponent;
