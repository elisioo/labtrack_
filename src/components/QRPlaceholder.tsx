export function QRPlaceholder({ size = 180 }: { size?: number }) {
  // Deterministic pseudo-random grid for visual QR effect
  const cells = 21;
  const blocks: boolean[] = [];
  let seed = 7;
  for (let i = 0; i < cells * cells; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    blocks.push(seed / 233280 > 0.5);
  }
  const cell = size / cells;
  const finder = (x: number, y: number) => (
    <>
      <rect x={x} y={y} width={cell * 7} height={cell * 7} fill="currentColor" />
      <rect x={x + cell} y={y + cell} width={cell * 5} height={cell * 5} fill="white" />
      <rect x={x + cell * 2} y={y + cell * 2} width={cell * 3} height={cell * 3} fill="currentColor" />
    </>
  );
  return (
    <div className="rounded-xl border bg-white p-3" style={{ width: size + 24, height: size + 24 }}>
      <svg width={size} height={size} className="text-primary">
        <rect width={size} height={size} fill="white" />
        {blocks.map((b, i) => {
          if (!b) return null;
          const x = (i % cells) * cell;
          const y = Math.floor(i / cells) * cell;
          // Skip finder areas
          if ((x < cell * 8 && y < cell * 8) || (x > size - cell * 8 && y < cell * 8) || (x < cell * 8 && y > size - cell * 8)) return null;
          return <rect key={i} x={x} y={y} width={cell} height={cell} fill="currentColor" />;
        })}
        {finder(0, 0)}
        {finder(size - cell * 7, 0)}
        {finder(0, size - cell * 7)}
      </svg>
    </div>
  );
}
