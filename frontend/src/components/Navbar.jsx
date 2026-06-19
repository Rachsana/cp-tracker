import { useRecoilState, useSetRecoilState } from "recoil";
import { useNavigate, NavLink } from "react-router-dom";
import { userAtom, tokenAtom } from "../atoms/userAtom";

export default function Navbar() {
  const [user, setUser] = useRecoilState(userAtom);
  const setToken = useSetRecoilState(tokenAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("cp_user");
    localStorage.removeItem("cp_token");
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "U";

  const linkClass = ({ isActive }) =>
    `cursor-pointer text-sm ${isActive ? "font-medium text-dtext" : "text-dmuted"}`;

  return (
    <nav className="flex items-center justify-between px-5 py-3 border-b border-dborder bg-dbg">
      <div className="flex items-center gap-2 text-[15px] font-medium text-dtext">
        <i className="ti ti-code text-lg text-accent"></i>
        CP Tracker
      </div>
      <div className="flex gap-5">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/submissions" className={linkClass}>Submissions</NavLink>
        <NavLink to="/profile" className={linkClass}>Profile</NavLink>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="text-xs text-dmuted hover:text-dtext"
        >
          Logout
        </button>
        <div className="w-8 h-8 rounded-full bg-[#1F2937] flex items-center justify-center text-xs font-medium text-accent">
          {initials}
        </div>
      </div>
    </nav>
  );
}
