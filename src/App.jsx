import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Unauthorized from './pages/Unauthorized';
import SelectRole from './pages/SelectRole';
import Dashboard from './pages/Dashboard';
import AgencyScore from './pages/AgencyScore';
import Profiles from './pages/Profiles';
import EntrepreneurProfile from './pages/EntrepreneurProfile';
import BusinessPlanBuilder from './pages/BusinessPlanBuilder';
import Matching from './pages/Matching';
import About from './pages/About';
import FundersDirectory from './pages/FundersDirectory';
import MyRequests from './pages/MyRequests';
import FunderRequests from './pages/FunderRequests';
import Admin from './pages/Admin';
import MyProfile from './pages/MyProfile';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/select-role" element={<SelectRole />} />

            {/* Authenticated */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/about" element={<About />} />
                <Route path="/my-profile" element={<MyProfile />} />

                {/* Funder-only */}
                <Route element={<PrivateRoute allowedTypes={['funder']} />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/agency" element={<AgencyScore />} />
                  <Route path="/profiles" element={<Profiles />} />
                  <Route path="/profiles/:id" element={<EntrepreneurProfile />} />
                  <Route path="/matching" element={<Matching />} />
                  <Route path="/funder-requests" element={<FunderRequests />} />
                </Route>

                {/* Venture-only */}
                <Route element={<PrivateRoute allowedTypes={['venture']} />}>
                  <Route path="/builder" element={<BusinessPlanBuilder />} />
                  <Route path="/funders" element={<FundersDirectory />} />
                  <Route path="/my-requests" element={<MyRequests />} />
                </Route>
                
                {/* Admin-only */}
                <Route element={<PrivateRoute adminOnly={true} />}>
                  <Route path="/admin" element={<Admin />} />
                </Route>
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
