import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { profileAtom, submissionsAtom } from "../atoms/profileAtom";
import { userAtom } from "../atoms/userAtom";
import { useSync } from "../hooks/useSync";
import StatCard from "../components/StatCard";
import PlatformBar from "../components/PlatformBar";
import SubmissionsTable from "../components/SubmissionsTable";
import SyncButton from "../components/SyncButton";

export default function Dashboard() {
  const profile = useRecoilValue(profileAtom);
  const submissions = useRecoilValue(submissionsAtom);
  const user = useRecoilValue(userAtom);
  const { loadProfile } = useSync();

  useEffect(() => {
    loadProfile();
  }, []);

  const totalSolved =
    (profile?.lcTotalSolved || 0) + (profile?.gfgSolved || 0);

  const maxCount = Math.max(
    profile?.lcTotalSolved || 0,
    profile?.gfgSolved || 0,
    1
  );

  return (
    <div className="p-5 bg-dbg min-h-screen">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-lg font-medium text-dtext">
            Good morning, {user?.username || "there"} 👋
          </h1>
          <p className="text-sm text-dmuted">
            Your coding progress across all 4 platforms
          </p>
        </div>
        <SyncButton />
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard
          icon="ti-check" iconColor="#3FB950" label="Total solved"
          value={totalSolved}
          badge="Updated" badgeColor={{ bg: "rgba(63,185,80,0.15)", text: "#3FB950" }}
        />
        <StatCard
          icon="ti-trophy" iconColor="#58A6FF" label="CF rating"
          value={profile?.cfRating || "—"}
          badge={profile?.cfRank || "Unrated"} badgeColor={{ bg: "rgba(56,139,253,0.15)", text: "#58A6FF" }}
        />
        <StatCard
          icon="ti-star" iconColor="#2DD4BF" label="CodeChef rating"
          value={profile?.ccRating || "—"}
          badge={profile?.ccStars || "Unrated"} badgeColor={{ bg: "rgba(20,184,166,0.15)", text: "#2DD4BF" }}
        />
        <StatCard
          icon="ti-leaf" iconColor="#D29922" label="GFG solved"
          value={profile?.gfgSolved || "—"}
          badge="Synced" badgeColor={{ bg: "rgba(210,153,34,0.15)", text: "#D29922" }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-dcard border border-dborder rounded-lg p-4">
          <h2 className="text-sm font-medium text-dtext mb-3.5 flex items-center gap-1.5">
            <i className="ti ti-chart-bar text-accent"></i> Problems by platform
          </h2>
          <PlatformBar label="LeetCode" count={profile?.lcTotalSolved || 0} max={maxCount} color="#D29922" />
          <PlatformBar label="GFG" count={profile?.gfgSolved || 0} max={maxCount} color="#3FB950" />
          <PlatformBar label="Codeforces" count={profile?.cfRating ? 1 : 0} max={1} color="#58A6FF" />
          <PlatformBar label="CodeChef" count={profile?.ccRating ? 1 : 0} max={1} color="#2DD4BF" />
        </div>

        <div className="bg-dcard border border-dborder rounded-lg p-4">
          <h2 className="text-sm font-medium text-dtext mb-3.5 flex items-center gap-1.5">
            <i className="ti ti-link text-accent"></i> Connected platforms
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-dborder pb-3">
              <span className="text-dtext2">Codeforces</span>
              <span className="font-medium text-[#58A6FF]">{profile?.cfRating || "Not connected"}</span>
            </div>
            <div className="flex justify-between border-b border-dborder pb-3">
              <span className="text-dtext2">LeetCode</span>
              <span className="font-medium text-[#D29922]">{profile?.lcTotalSolved || "Not connected"}</span>
            </div>
            <div className="flex justify-between border-b border-dborder pb-3">
              <span className="text-dtext2">CodeChef</span>
              <span className="font-medium text-[#2DD4BF]">{profile?.ccRating || "Not connected"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dtext2">GeeksforGeeks</span>
              <span className="font-medium text-[#3FB950]">{profile?.gfgSolved || "Not connected"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-dcard border border-dborder rounded-lg p-4">
        <h2 className="text-sm font-medium text-dtext mb-3.5 flex items-center gap-1.5">
          <i className="ti ti-history text-accent"></i> Recent submissions
        </h2>
        <SubmissionsTable submissions={submissions} />
      </div>
    </div>
  );
}
