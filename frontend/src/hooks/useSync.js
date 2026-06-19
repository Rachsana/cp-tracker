import { useSetRecoilState, useRecoilValue } from "recoil";
import { profileAtom, submissionsAtom, syncingAtom } from "../atoms/profileAtom";
import { tokenAtom } from "../atoms/userAtom";
import axios from "axios";

export function useSync() {
  const token = useRecoilValue(tokenAtom);
  const setSyncing = useSetRecoilState(syncingAtom);
  const setProfile = useSetRecoilState(profileAtom);
  const setSubmissions = useSetRecoilState(submissionsAtom);

  const syncAll = async () => {
    setSyncing(true);
    try {
      const [syncRes, subsRes] = await Promise.all([
        axios.post("/api/sync/all", {}, { headers: { authorization: token } }),
        axios.get("/api/submissions?limit=10", { headers: { authorization: token } }),
      ]);
      setProfile(syncRes.data.profile);
      setSubmissions(subsRes.data.submissions);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setSyncing(false);
    }
  };

  const loadProfile = async () => {
    try {
      const [profileRes, subsRes] = await Promise.all([
        axios.get("/api/submissions/stats", { headers: { authorization: token } }),
        axios.get("/api/submissions?limit=10", { headers: { authorization: token } }),
      ]);
      setProfile(profileRes.data.profile);
      setSubmissions(subsRes.data.submissions);
    } catch (err) {
      console.error(err);
    }
  };

  return { syncAll, loadProfile };
}
