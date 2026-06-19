import { Routes, Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "./atoms/userAtom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Submissions from "./pages/Submissions";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

function PrivateLayout({ children }) {
  const user = useRecoilValue(userAtom);
  if (!user) return <Navigate to="/login" />;
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-dbg">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={<PrivateLayout><Dashboard /></PrivateLayout>}
        />
        <Route
          path="/submissions"
          element={<PrivateLayout><Submissions /></PrivateLayout>}
        />
        <Route
          path="/profile"
          element={<PrivateLayout><Profile /></PrivateLayout>}
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}
