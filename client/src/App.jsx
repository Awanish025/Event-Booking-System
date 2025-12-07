import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import EventListing from './pages/EventListing';
import EventDetails from './pages/EventDetails';
import BookingSuccess from './pages/BookingSuccess';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/events" element={<EventListing />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/success" element={<BookingSuccess />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
