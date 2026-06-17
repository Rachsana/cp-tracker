function Heatmap() {
  const colors = ['#1f1f1f', '#1a2e1a', '#2d5a1b', '#3b6d11', '#639922', '#9FE1CB'];
  const cells = Array.from({ length: 156 }, () => colors[Math.floor(Math.random() * colors.length)]);

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4 mt-3 max-w-md">
      <div className="text-xs text-[#555] mb-3">Submission activity</div>
      <div className="grid grid-cols-[repeat(26,minmax(0,1fr))] gap-[2px]">
        {cells.map((color, i) => (
          <div key={i} className="aspect-square rounded-[2px]" style={{ backgroundColor: color }} />
        ))}
      </div>
    </div>
  );
}

export default Heatmap;