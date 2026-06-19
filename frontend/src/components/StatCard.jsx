<<<<<<< HEAD
export default function StatCard({ icon, iconColor, label, value, badge, badgeColor }) {
  return (
    <div className="bg-dcard border border-dborder rounded-lg p-4">
      <div className="flex items-center gap-1.5 text-xs text-dmuted mb-1.5">
        <i className={`ti ${icon} text-sm`} style={{ color: iconColor }}></i>
        {label}
      </div>
      <div className="text-2xl font-medium text-dtext">{value}</div>
      {badge && (
        <span
          className="inline-block text-[11px] px-2 py-0.5 rounded-full mt-1.5"
          style={{ background: badgeColor?.bg, color: badgeColor?.text }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}
=======
function StatCard({ label, value }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4">
      <div className="text-xs text-[#555] mb-2">{label}</div>
      <div className="text-3xl font-medium">{value}</div>
    </div>
  );
}

export default StatCard;
>>>>>>> 6d5368b3e74091ce1517fb7e367b68c34bd1c07c
