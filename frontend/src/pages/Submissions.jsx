import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { tokenAtom } from "../atoms/userAtom";
import SubmissionsTable from "../components/SubmissionsTable";

export default function Submissions() {
  const token = useRecoilValue(tokenAtom);
  const [submissions, setSubmissions] = useState([]);
  const [platform, setPlatform] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/submissions?limit=50${platform ? `&platform=${platform}` : ""}`,
        { headers: { authorization: token } }
      );
      setSubmissions(res.data.submissions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [platform]);

  return (
    <div className="p-5 bg-dbg min-h-screen">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-medium text-dtext">All Submissions</h1>
          <p className="text-sm text-dmuted">Every problem you've solved, across platforms</p>
        </div>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="border border-dborder2 rounded-lg px-3 py-2 text-sm bg-dcard text-dtext2"
        >
          <option value="">All platforms</option>
          <option value="codeforces">Codeforces</option>
          <option value="leetcode">LeetCode</option>
          <option value="codechef">CodeChef</option>
          <option value="gfg">GeeksforGeeks</option>
        </select>
      </div>

      <div className="bg-dcard border border-dborder rounded-lg p-4">
        {loading ? (
          <div className="text-sm text-dmuted2 text-center py-8">Loading...</div>
        ) : (
          <SubmissionsTable submissions={submissions} />
        )}
      </div>
    </div>
  );
}
