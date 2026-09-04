import ABCJS from "abcjs";
import { useEffect } from "react";
import { Chord, Note, Range, Scale } from "tonal";
import {
  abcPitchToMidi,
  noteNameToAbc,
  tonal_getNoteAndOctave,
} from "../utils/abc-notation";

function playMidiNotes(midiValues) {
  const validMidiValues = (midiValues || []).filter(
    (value) => typeof value === "number" && Number.isFinite(value),
  );

  if (validMidiValues.length === 0) {
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  const audioContext = new AudioContextClass();
  const startTime = audioContext.currentTime;

  validMidiValues.forEach((midiValue, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const noteStart = startTime + index * 0.08;
    const frequency = 440 * 2 ** ((midiValue - 69) / 12);

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, noteStart);

    gainNode.gain.setValueAtTime(0.0001, noteStart);
    gainNode.gain.exponentialRampToValueAtTime(0.18, noteStart + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.8);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(noteStart);
    oscillator.stop(noteStart + 0.85);
  });
}

function TonalSystem({
  system,
  root = "C4",
  clefValue = "treble",
  numberOfNotesInChord,
  octaveShift = 0,
}) {
  const { note } = tonal_getNoteAndOctave(root);

  const tonal_scale = Scale.get(`${root} ${system.scale}`).notes;

  const tonal_chords = tonal_scale.map((note, i) =>
    Range.numeric([0, numberOfNotesInChord - 1]).map(
      Chord.steps(system.chordQualities[i].value, note),
    ),
  );

  const chordEntries = tonal_scale.flatMap((note, i) => {
    const chord = tonal_chords[i].map(noteNameToAbc).map((note) => `${note}4`);
    const symbol =
      numberOfNotesInChord === 3
        ? system.triadQualities[i]
        : system.chordQualities[i].label;
    const entries = [
      `"${tonal_getNoteAndOctave(tonal_scale[i]).note}${symbol}" [${chord.join(" ")}]`,
    ];

    if (numberOfNotesInChord === 3) {
      return entries;
    }

    const extraChords = (system.extraChords ?? [])
      .filter((extraChord) => extraChord.afterDegree === i)
      .map((extraChord) => {
        const intervalsInRelationToRoot =
          extraChord.intervalsInRelationToRoot ?? [];
        const tonal_extraChordNotes = intervalsInRelationToRoot.map(
          (interval) => Note.transpose(root, interval),
        );
        console.log({ tonal_extraChordNotes });
        const abc_extraChordNotes = (tonal_extraChordNotes ?? [])
          .map(noteNameToAbc)
          .map((note) => `${note}`);

        const { note: extraNoteRoot } = tonal_getNoteAndOctave(
          tonal_extraChordNotes[0],
        );

        const label = `${extraNoteRoot}${extraChord.quality}`;
        const displayedLabel = extraChord.parenthesized ? `(${label})` : label;
        const symbolText =
          extraChord.showSymbol === false ? "" : `"${displayedLabel}" `;

        return `${symbolText}[${abc_extraChordNotes.join(" ")}]`;
      });

    return [...entries, ...extraChords];
  });

  const abc_chordString = chordEntries.join(" ");

  useEffect(() => {
    ABCJS.renderAbc(
      system.id,
      `X:${system.abcId}
V:1 clef=${clefValue}
L:1/4
${abc_chordString} ||`,
      {
        responsive: "resize",
        clickListener: (abcElem) => {
          if (!abcElem || abcElem.el_type !== "note") {
            return;
          }

          const abcPitchNames = (abcElem.pitches || []).map(({ name }) => name);
          const midiValues = abcPitchNames
            .map(abcPitchToMidi)
            .filter((value) => value != null);

          playMidiNotes(midiValues);
        },
      },
    );
  }, [abc_chordString, clefValue, octaveShift, root, system]);

  return (
    <section
      className="tonal-system"
      aria-label={`${root} ${system.ariaLabel}`}
    >
      <h2 className="tonal-system-title">
        {note} {system.title}
      </h2>
      <div id={system.id} />
    </section>
  );
}

export default TonalSystem;
