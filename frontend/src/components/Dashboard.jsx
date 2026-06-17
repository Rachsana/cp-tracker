import StatCard from './StatCard';
import Heatmap from './Heatmap';
import ProblemDonut from './ProblemDonut';

function Dashboard({ data }) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <div className="grid grid-cols-[200px_1fr_220px] gap-4 max-w-7xl mx-auto">

        <div className="flex flex-col gap-3">
          <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4 flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center text-lg font-medium text-[#9FE1CB]">
              RP
            </div>
            <div className="text-sm font-medium">Rachna Patel</div>
            <div className="text-xs text-[#639922]">@rachna_patel</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total Questions" value={data.totalSolved} />
            <StatCard label="Active Days" value={data.activeDays} />
          </div>
          <Heatmap />
        </div>

        <div className="flex flex-col gap-3">
          <ProblemDonut donutData={data.donutData} />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;