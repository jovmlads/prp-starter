import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RootLayout } from './components/layout/root-layout';
import './styles/globals.css';

import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Settings from './pages/settings';
import Profile from './pages/profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
