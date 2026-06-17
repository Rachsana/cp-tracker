function StatCard({ label, value }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4">
      <div className="text-xs text-[#555] mb-2">{label}</div>
      <div className="text-3xl font-medium">{value}</div>
    </div>
  );
}

export default StatCard;