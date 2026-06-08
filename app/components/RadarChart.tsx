import { STATS_CONFIG } from "@/lib/constants";

interface StatPoint {
  id: string;
  value: number;
  color: string;
}

interface RadarChartProps {
  stats: StatPoint[];
  size?: number;
  compare?: { value: number; color: string }[]; // optional NPC overlay
  lang?: string;
}

const MATH_ANGLES = [90, 30, -30, -90, -150, 150]; // top→CW hexagon

function pt(angle: number, r: number, cx: number, cy: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function poly(values: number[], maxR: number, cx: number, cy: number) {
  return MATH_ANGLES.map((a, i) => {
    const p = pt(a, (values[i] / 100) * maxR, cx, cy);
    return `${p.x},${p.y}`;
  }).join(" ");
}

function hex(frac: number, maxR: number, cx: number, cy: number) {
  return MATH_ANGLES.map((a) => {
    const p = pt(a, maxR * frac, cx, cy);
    return `${p.x},${p.y}`;
  }).join(" ");
}

export default function RadarChart({ stats, size = 280, compare, lang }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const labelR = maxR + 24;

  const values = stats.map((s) => s.value);
  const dominant = [...stats].sort((a, b) => b.value - a.value)[0];
  const fillColor = dominant?.color ?? "#00d4ff";
  const dataPoints = poly(values, maxR, cx, cy);
  const comparePoints = compare ? poly(compare.map((c) => c.value), maxR, cx, cy) : null;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%"
      style={{ maxWidth: size, maxHeight: size }}>
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1.0].map((f, i) => (
        <polygon key={i} points={hex(f, maxR, cx, cy)}
          fill="none" stroke={f === 1.0 ? "#2a2a42" : "#1c1c2e"}
          strokeWidth={f === 1.0 ? 1.5 : 1}
          strokeDasharray={f < 1.0 ? "3 3" : undefined} />
      ))}

      {/* Ring labels */}
      {[25, 50, 75].map((v) => {
        const p = pt(90, (v / 100) * maxR, cx, cy);
        return (
          <text key={v} x={p.x + 3} y={p.y} fontSize={7}
            fill="#374151" fontFamily="monospace">{v}</text>
        );
      })}

      {/* Axis spokes */}
      {MATH_ANGLES.map((a, i) => {
        const end = pt(a, maxR, cx, cy);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y}
          stroke="#1c1c2e" strokeWidth={1} />;
      })}

      {/* NPC compare overlay */}
      {comparePoints && (
        <polygon points={comparePoints} fill="#ffffff08"
          stroke="#ffffff22" strokeWidth={1} strokeDasharray="4 3"
          strokeLinejoin="round" />
      )}

      {/* Data polygon */}
      <polygon points={dataPoints} fill={fillColor} fillOpacity={0.12}
        stroke={fillColor} strokeWidth={1.5} strokeLinejoin="round"
        style={{ transition: "all 0.4s ease",
          filter: `drop-shadow(0 0 4px ${fillColor}55)` }} />

      {/* Data point dots */}
      {stats.map((s, i) => {
        const r = (s.value / 100) * maxR;
        const p = pt(MATH_ANGLES[i], r, cx, cy);
        return (
          <circle key={s.id} cx={p.x} cy={p.y} r={3} fill={s.color}
            style={{ filter: `drop-shadow(0 0 4px ${s.color})`,
              transition: "all 0.4s ease" }} />
        );
      })}

      {/* Axis labels */}
      {STATS_CONFIG.map((cfg, i) => {
        const a = MATH_ANGLES[i];
        const p = pt(a, labelR, cx, cy);
        const anchor: "start" | "middle" | "end" =
          a === 90 || a === -90 ? "middle" :
          (a > 0 && a < 90) || (a > -90 && a < 0 && a > -90) ? "start" :
          a === 30 || a === -30 ? "start" : "end";

        const thOffset = lang === "jp" ? 5 : 15;
        return (
          <g key={cfg.id}>
            <text x={p.x} y={p.y - 6} textAnchor={anchor} fontSize={8}
              fill={stats[i].color} fontFamily="monospace"
              style={{ filter: `drop-shadow(0 0 3px ${stats[i].color}66)` }}>
              {cfg.nameJp}
            </text>
            {lang !== "jp" && (
              <text x={p.x} y={p.y + 5} textAnchor={anchor} fontSize={7}
                fill="#4b5563" fontFamily="monospace">{cfg.nameTh}</text>
            )}
            <text x={p.x} y={p.y + thOffset} textAnchor={anchor} fontSize={9}
              fill={stats[i].color} fontWeight="bold" fontFamily="monospace">
              {stats[i].value}
            </text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={2} fill="#2a2a42" />
    </svg>
  );
}
