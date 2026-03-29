import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PollViewPage from './pages/PollViewPage';

function App() {

  return (
    <BrowserRouter>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Link
          to="/"
          onClick={() => window.location.href = '/'}
          style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}
        >
          🏠 Create New Poll
        </Link>
      </div>
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h2 style={{ textAlign: 'center' }}>📊 Poll System</h2>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/poll/:id" element={<PollViewPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App
