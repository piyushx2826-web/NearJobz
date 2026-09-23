import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import JobPost from './pages/JobPost';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import ApplyNow from './pages/ApplyNow';
import PrivateRoute from './components/PrivateRoute';
import AllJobs from './pages/AllJobs';
import CategoryJobs from './pages/CategoryJobs';
import ApplicationsReceived from './pages/ApplicationsReceived';
import ProfilePage from './pages/ProfilePage';
import TermsAndConditions from './pages/TermsAndConditions';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />


          <Route path="/:jobId" element={<ApplyNow />} />

          <Route path="/post-job" element={
            <PrivateRoute>
              <JobPost />
            </PrivateRoute>
          } />
          <Route path="/applications-received" element={<ApplicationsReceived />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

          <Route path="/jobs" element={<AllJobs />} />
          <Route path="/category/:categoryName" element={<CategoryJobs />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
