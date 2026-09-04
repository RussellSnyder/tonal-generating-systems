import ABCJS from "abcjs";
import { useEffect } from "react";
import { Chord, Range, Scale } from "tonal";
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
  const { note, octave } = tonal_getNoteAndOctave(root);

  const tonal_scale = Scale.get(`${root} ${system.scale}`).notes;

  const tonal_chords = tonal_scale.map((note, i) =>
    Range.numeric([0, numberOfNotesInChord - 1]).map(
      Chord.steps(system.chordQualities[i].value, note),
    ),
  );

  const abc_chords = tonal_chords.map((chord) => chord.map(noteNameToAbc));
  const abc_chordString = abc_chords
    .map((chord, i) => {
      let symbol;
      if (numberOfNotesInChord === 3) {
        symbol = system.triadQualities[i];
      } else {
        symbol = system.chordQualities[i].label;
      }

      return `"${tonal_getNoteAndOctave(tonal_scale[i]).note}${symbol}" [${chord.join(" ")}]`;
    })
    .join("|");

  useEffect(() => {
    ABCJS.renderAbc(
      system.id,
      `X:${system.abcId}
T:${system.title}
V:1 clef=${clefValue}
L:4/4
${abc_chordString}`,
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

  return <section id={system.id} aria-label={`${root} ${system.ariaLabel}`} />;
}

export default TonalSystem;
