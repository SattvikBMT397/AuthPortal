import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Register';
import Login from './pages/Login';
import { AuthProvider } from './Contexts/AuthContext';
import Profile from './pages/profile';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './Contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrivateRouteProps } from './utils/interface';

const PrivateRoute = ({ children, role }:PrivateRouteProps) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (role && currentUser.roleType !== role) {
      navigate('/');
    }
  }, [currentUser, role, navigate]);

  return currentUser ? children : null;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

