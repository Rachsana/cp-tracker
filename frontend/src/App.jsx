<<<<<<< HEAD
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
=======
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/dashboard/Rachnaa/RachnaSPatel/rachna_911/rrachnapil5y')
      .then(res => res.json())
      .then(setData)
      .catch(() => setError('Failed to load dashboard data'));
  }, []);

  if (error) return <p className="text-red-400 p-6">{error}</p>;
  if (!data) return <p className="text-white p-6">Loading...</p>;

  return <Dashboard data={data} />;
}

export default App;
>>>>>>> 6d5368b3e74091ce1517fb7e367b68c34bd1c07c
