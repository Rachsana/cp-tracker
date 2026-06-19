const verdictStyle = {
  AC: "bg-[rgba(63,185,80,0.15)] text-[#3FB950]",
  WA: "bg-[rgba(248,81,73,0.15)] text-[#F85149]",
  TLE: "bg-[rgba(210,153,34,0.15)] text-[#D29922]",
};

const platformStyle = {
  codeforces: "bg-[rgba(56,139,253,0.15)] text-[#58A6FF]",
  leetcode: "bg-[rgba(210,153,34,0.15)] text-[#D29922]",
  codechef: "bg-[rgba(20,184,166,0.15)] text-[#2DD4BF]",
  gfg: "bg-[rgba(63,185,80,0.15)] text-[#3FB950]",
};

export default function SubmissionsTable({ submissions }) {
  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-sm text-dmuted2 text-center py-8">
        No submissions yet. Hit "Sync all platforms" to fetch your data.
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-xs text-dmuted2 border-b border-dborder">
          <th className="text-left font-normal pb-2.5">Problem</th>
          <th className="text-left font-normal pb-2.5">Platform</th>
          <th className="text-left font-normal pb-2.5">Verdict</th>
          <th className="text-left font-normal pb-2.5">When</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((s) => (
          <tr key={s.id} className="border-b border-dborder last:border-0">
            <td className="py-2.5 font-medium text-dtext2">{s.problemName}</td>
            <td className="py-2.5">
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${platformStyle[s.platform] || "bg-dborder text-dmuted"}`}>
                {s.platform}
              </span>
            </td>
            <td className="py-2.5">
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${verdictStyle[s.verdict] || "bg-dborder text-dmuted"}`}>
                {s.verdict}
              </span>
            </td>
            <td className="py-2.5 text-dmuted2">
              {new Date(s.solvedAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
