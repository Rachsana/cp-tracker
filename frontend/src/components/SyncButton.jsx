import { useState } from "react";
import { useRecoilValue } from "recoil";
import { syncingAtom, profileAtom } from "../atoms/profileAtom";
import { useSync } from "../hooks/useSync";

export default function SyncButton() {
  const { syncAll } = useSync();
  const syncing = useRecoilValue(syncingAtom);
  const profile = useRecoilValue(profileAtom);
  const [done, setDone] = useState(false);

  const handleSync = async () => {
    const res = await syncAll();
    if (res.success) {
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    }
  };

  const lastSynced = profile?.lastSynced
    ? new Date(profile.lastSynced).toLocaleTimeString()
    : "never";

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleSync}
        disabled={syncing}
        className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border transition
          ${done
            ? "bg-[rgba(63,185,80,0.15)] border-[#3FB950] text-[#3FB950]"
            : "bg-dcard border-dborder2 text-dtext hover:bg-[#1c232c]"}
          ${syncing ? "text-dmuted pointer-events-none" : ""}`}
      >
        <i
          className={`ti ${done ? "ti-check" : "ti-refresh"} text-sm ${syncing ? "animate-spin" : ""}`}
        ></i>
        {syncing ? "Syncing..." : done ? "Synced!" : "Sync all platforms"}
      </button>
      <span className="text-[11px] text-dmuted2">Last synced: {lastSynced}</span>
    </div>
  );
}
