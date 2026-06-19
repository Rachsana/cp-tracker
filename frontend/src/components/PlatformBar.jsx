export default function PlatformBar({ label, count, max, color }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2.5 mb-2.5">
      <span className="text-xs text-dmuted w-16 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-dborder rounded overflow-hidden">
        <div
          className="h-full rounded transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        ></div>
      </div>
      <span className="text-xs text-dmuted w-8 text-right">{count}</span>
    </div>
  );
}
