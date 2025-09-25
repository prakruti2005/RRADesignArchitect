import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Services from './pages/Services';
import Projects from './pages/Projects';
import DesignQuotient from './pages/DesignQuotient';
import About from './pages/About';

import Contact from './pages/Contact';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 md:pt-20 lg:pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/design-quotient" element={<DesignQuotient />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;