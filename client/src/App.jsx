import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts (We will create these)
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Providers
import { ThemeProvider } from './context/ThemeContext';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import BrowseEvents from './pages/student/BrowseEvents';
import MyTickets from './pages/student/MyTickets';
import EventDetails from './pages/student/EventDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateEvent from './pages/admin/CreateEvent';
import ManageRegistrations from './pages/admin/ManageRegistrations';
import QRScanner from './pages/admin/QRScanner';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Student Dashboard Routes */}
          <Route path="/student" element={<DashboardLayout role="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="events" element={<BrowseEvents />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="tickets" element={<MyTickets />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<DashboardLayout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="events/create" element={<CreateEvent />} />
            <Route path="registrations" element={<ManageRegistrations />} />
            <Route path="scan" element={<QRScanner />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}

export default App;
