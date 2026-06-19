import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { tokenAtom } from "../atoms/userAtom";

export default function Profile() {
  const token = useRecoilValue(tokenAtom);
  const [form, setForm] = useState({
    codeforcesHandle: "",
    leetcodeHandle: "",
    codechefHandle: "",
    gfgHandle: "",
  });
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/profile/me", { headers: { authorization: token } })
      .then((res) => {
        const u = res.data;
        setEmail(u.email);
        setUsername(u.username);
        setForm({
          codeforcesHandle: u.codeforcesHandle || "",
          leetcodeHandle: u.leetcodeHandle || "",
          codechefHandle: u.codechefHandle || "",
          gfgHandle: u.gfgHandle || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaved(false);
    try {
      await axios.put("/api/profile/handles", form, {
        headers: { authorization: token },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-5 bg-dbg min-h-screen text-sm text-dmuted2">Loading profile...</div>;
  }

  const inputClass = "w-full border border-dborder2 rounded-lg px-3 py-2 text-sm bg-dcard text-dtext2 focus:outline-none focus:border-accent";

  return (
    <div className="p-5 bg-dbg min-h-screen">
      <h1 className="text-lg font-medium text-dtext mb-1">Profile</h1>
      <p className="text-sm text-dmuted mb-5">Manage your account and platform handles</p>

      <div className="max-w-lg bg-dcard border border-dborder rounded-lg p-5">
        <div className="mb-4 pb-4 border-b border-dborder">
          <div className="text-xs text-dmuted mb-1">Username</div>
          <div className="text-sm font-medium text-dtext">{username}</div>
        </div>
        <div className="mb-5 pb-5 border-b border-dborder">
          <div className="text-xs text-dmuted mb-1">Email</div>
          <div className="text-sm font-medium text-dtext">{email}</div>
        </div>

        {saved && (
          <div className="text-sm text-[#3FB950] bg-[rgba(63,185,80,0.1)] border border-[#3FB950]/30 rounded-lg px-3 py-2 mb-4">
            Handles updated! Hit "Sync all platforms" on the dashboard to fetch new data.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="text-xs text-dmuted block mb-1">Codeforces handle</label>
            <input
              value={form.codeforcesHandle}
              onChange={(e) => setForm({ ...form, codeforcesHandle: e.target.value })}
              className={inputClass}
              placeholder="e.g. tourist"
            />
          </div>
          <div>
            <label className="text-xs text-dmuted block mb-1">LeetCode handle</label>
            <input
              value={form.leetcodeHandle}
              onChange={(e) => setForm({ ...form, leetcodeHandle: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-dmuted block mb-1">CodeChef handle</label>
            <input
              value={form.codechefHandle}
              onChange={(e) => setForm({ ...form, codechefHandle: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-dmuted block mb-1">GeeksforGeeks handle</label>
            <input
              value={form.gfgHandle}
              onChange={(e) => setForm({ ...form, gfgHandle: e.target.value })}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="bg-accent text-[#0D1117] text-sm font-medium rounded-lg px-4 py-2 hover:opacity-90"
          >
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
}
