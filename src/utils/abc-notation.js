import { Note, Scale } from "tonal";

export function noteNameToAbc(noteName) {
  const match = /^([A-Ga-g])([#b]{1,2})?(\d+)$/.exec(noteName);
  if (!match) return noteName;

  const [, letter, accidental = "", octaveString] = match;
  const octave = Number(octaveString ?? 4);
  let abcAccidental = "";

  switch (accidental) {
    case "bb":
      abcAccidental = `__`;
      break;
    case "b":
      abcAccidental = `_`;
      break;
    case "#":
      abcAccidental = `^`;
      break;
    case "##":
      abcAccidental = `^^`;
      break;
    default:
      break;
  }

  if (octave === 4) return `${abcAccidental}${letter}`;
  if (octave === 5) return `${abcAccidental}${letter.toLowerCase()}`;
  if (octave === 6) return `${abcAccidental}${letter.toLowerCase()}'`;

  const diff = octave - 4;
  const octaveMarker = diff > 0 ? "'".repeat(diff) : ",".repeat(Math.abs(diff));
  return `${abcAccidental}${letter.toLowerCase()}${octaveMarker}`;
}

export function createABCScale(root, scaleRoot, scale) {
  const range = Scale.rangeOf(`${scaleRoot} ${scale}`);
  const rangeStart = root.toUpperCase() + "4";
  const rangeEnd = Note.transpose(rangeStart, "M7");
  const notes = range(rangeStart, rangeEnd);
  return notes.map(noteNameToAbc);
}

export function chunkItems(items, size) {
  const chunks = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
}

export function groupScalesForDisplay(scales) {
  if (!Array.isArray(scales) || scales.length === 0) {
    return [];
  }

  if (scales.length === 6) {
    return chunkItems(scales, 3);
  }

  if (scales.length === 8) {
    return chunkItems(scales, 4);
  }

  return [scales];
}
