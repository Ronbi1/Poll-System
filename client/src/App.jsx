import { BrowserRouter, Routes, Route } from 'react-router-dom'; import './App.css'

function App() {

  return (
    <BrowserRouter>
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h2>📊 Poll System</h2>

        <Routes>
          <Route path="/" element={<div>Home Page (Create Poll)</div>} />
          <Route path="/poll/:id" element={<div>Poll View Page (Vote & Results)</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App
