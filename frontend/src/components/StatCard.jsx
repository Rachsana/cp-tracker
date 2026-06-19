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
