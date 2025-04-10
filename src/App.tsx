
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ManagementPage from './pages/management';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<div>หน้าหลัก</div>} />
        <Route path="/management" element={<ManagementPage />} />
      </Routes>
    </Router>
  );
}

export default App;
