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