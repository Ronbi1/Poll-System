import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PollViewPage from './pages/PollViewPage';
import Navbar from './components/Navbar';
import PollsListPage from './pages/PollsListPage';

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/polls" element={<PollsListPage />} />
          <Route path="/poll/:id" element={<PollViewPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App
