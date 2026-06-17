import { PieChart, Pie, Cell } from 'recharts';

function DonutRow({ label, data }) {
  return (
    <div className="mb-4">
      <div className="text-xs text-[#888] mb-2">{label}</div>
      <div className="flex items-center gap-3">
        <PieChart width={64} height={64}>
          <Pie data={data} dataKey="value" innerRadius={20} outerRadius={28} startAngle={90} endAngle={-270}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
        <div className="flex-1">
          {data.map((d) => (
            <div key={d.name} className="flex justify-between text-xs py-0.5">
              <span style={{ color: d.color }}>{d.name}</span>
              <span className="text-[#ccc] font-medium">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProblemDonut() {
  const fundamentals = [{ name: 'GFG', value: 89, color: '#639922' }];
  const dsa = [
    { name: 'Easy', value: 202, color: '#639922' },
    { name: 'Medium', value: 344, color: '#BA7517' },
    { name: 'Hard', value: 60, color: '#A32D2D' },
  ];
  const cp = [
    { name: 'CodeChef', value: 100, color: '#D85A30' },
    { name: 'Codeforces', value: 248, color: '#534AB7' },
  ];

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4 mt-3 max-w-md text-white">
      <div className="text-sm font-medium mb-3">Problems Solved</div>
      <DonutRow label="Fundamentals" data={fundamentals} />
      <div className="border-t border-[#222] my-3"></div>
      <DonutRow label="DSA" data={dsa} />
      <div className="border-t border-[#222] my-3"></div>
      <DonutRow label="Competitive Programming" data={cp} />
    </div>
  );
}

export default ProblemDonut;