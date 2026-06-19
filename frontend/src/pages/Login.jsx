import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { userAtom, tokenAtom } from "../atoms/userAtom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useSetRecoilState(userAtom);
  const setToken = useSetRecoilState(tokenAtom);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", form);
      localStorage.setItem("cp_token", res.data.token);
      localStorage.setItem("cp_user", JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-dborder2 rounded-lg px-3 py-2 text-sm bg-dcard text-dtext2 focus:outline-none focus:border-accent";

  return (
    <div className="min-h-screen flex items-center justify-center bg-dbg px-4">
      <div className="w-full max-w-md bg-dcard border border-dborder rounded-lg p-8">
        <div className="flex items-center gap-2 mb-1">
          <i className="ti ti-code text-xl text-accent"></i>
          <span className="text-lg font-medium text-dtext">CP Tracker</span>
        </div>
        <p className="text-sm text-dmuted mb-6">Welcome back, login to continue</p>

        {error && (
          <div className="text-sm text-[#F85149] bg-[rgba(248,81,73,0.1)] border border-[#F85149]/30 rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email" placeholder="Email" required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
          <input
            type="password" placeholder="Password" required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={inputClass}
          />
          <button type="submit" disabled={loading}
            className="w-full bg-accent text-[#0D1117] text-sm font-medium rounded-lg py-2.5 hover:opacity-90 disabled:opacity-50">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-dmuted text-center mt-5">
          Don't have an account? <Link to="/signup" className="text-accent font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
