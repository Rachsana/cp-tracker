import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/cf/YOUR_CF_HANDLE')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h1>CPTrack</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}

export default App;