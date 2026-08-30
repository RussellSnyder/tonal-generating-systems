const DEFAULT_SCALES = ['Major', 'Natural minor', 'Dorian', 'Mixolydian']

function ScaleSystem({ scales = DEFAULT_SCALES, value, onChange }) {
  const selectedScale = value ?? scales[0]

  return (
    <section aria-labelledby="scale-system-title">
      <h2 id="scale-system-title">Scale system</h2>
      <label htmlFor="scale-select">Choose a scale</label>
      <select
        id="scale-select"
        value={selectedScale}
        onChange={(event) => onChange?.(event.target.value)}
      >
        {scales.map((scale) => (
          <option key={scale} value={scale}>
            {scale}
          </option>
        ))}
      </select>
    </section>
  )
}

export default ScaleSystem
