import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { userAtom, tokenAtom } from "../atoms/userAtom";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    codeforcesHandle: "",
    leetcodeHandle: "",
    codechefHandle: "",
    gfgHandle: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useSetRecoilState(userAtom);
  const setToken = useSetRecoilState(tokenAtom);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/signup", form);
      localStorage.setItem("cp_token", res.data.token);
      localStorage.setItem("cp_user", JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-dborder2 rounded-lg px-3 py-2 text-sm bg-dbg text-dtext2 focus:outline-none focus:border-accent";

  return (
    <div className="min-h-screen flex items-center justify-center bg-dbg px-4">
      <div className="w-full max-w-md bg-dcard border border-dborder rounded-lg p-8">
        <div className="flex items-center gap-2 mb-1">
          <i className="ti ti-code text-xl text-accent"></i>
          <span className="text-lg font-medium text-dtext">CP Tracker</span>
        </div>
        <p className="text-sm text-dmuted mb-6">Create your account</p>

        {error && (
          <div className="text-sm text-[#F85149] bg-[rgba(248,81,73,0.1)] border border-[#F85149]/30 rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required
            className={inputClass} />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required
            className={inputClass} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required
            className={inputClass} />

          <div className="pt-2 pb-1 text-xs text-dmuted2 uppercase tracking-wide">Platform handles (optional)</div>
          <input name="codeforcesHandle" placeholder="Codeforces handle" value={form.codeforcesHandle} onChange={handleChange}
            className={inputClass} />
          <input name="leetcodeHandle" placeholder="LeetCode handle" value={form.leetcodeHandle} onChange={handleChange}
            className={inputClass} />
          <input name="codechefHandle" placeholder="CodeChef handle" value={form.codechefHandle} onChange={handleChange}
            className={inputClass} />
          <input name="gfgHandle" placeholder="GeeksforGeeks handle" value={form.gfgHandle} onChange={handleChange}
            className={inputClass} />

          <button type="submit" disabled={loading}
            className="w-full bg-accent text-[#0D1117] text-sm font-medium rounded-lg py-2.5 hover:opacity-90 disabled:opacity-50">
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-dmuted text-center mt-5">
          Already have an account? <Link to="/login" className="text-accent font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}
