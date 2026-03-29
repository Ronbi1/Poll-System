import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {

  return (
    <BrowserRouter>
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h2 style={{ textAlign: 'center' }}>📊 Poll System</h2>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/poll/:id" element={<div>Poll View Page (Vote & Results)</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App
