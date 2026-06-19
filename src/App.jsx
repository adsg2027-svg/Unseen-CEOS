import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { FormSchemaProvider } from './context/FormSchemaContext';
import { LanguageProvider } from './context/LanguageContext';
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
import Discover from './pages/Discover';
import About from './pages/About';
import FundersDirectory from './pages/FundersDirectory';
import MyRequests from './pages/MyRequests';
import FunderRequests from './pages/FunderRequests';
import Admin from './pages/Admin';
import MyProfile from './pages/MyProfile';
import PitchDeck from './pages/PitchDeck';
import Chat from './pages/Chat';

function App() {
  return (
    <LanguageProvider>
    <AuthProvider>
      <DataProvider>
        <FormSchemaProvider>
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
                <Route path="/chat/:connectionId" element={<Chat />} />

                {/* Funder-only */}
                <Route element={<PrivateRoute allowedTypes={['funder']} />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/profiles/:id" element={<EntrepreneurProfile />} />
                  <Route path="/profiles" element={<Navigate to="/discover" replace />} />
                  <Route path="/agency" element={<Navigate to="/discover" replace />} />
                  <Route path="/matching" element={<Navigate to="/discover" replace />} />
                  <Route path="/funder-requests" element={<FunderRequests />} />
                </Route>

                {/* Venture-only */}
                <Route element={<PrivateRoute allowedTypes={['venture']} />}>
                  <Route path="/funders" element={<FundersDirectory />} />
                  <Route path="/my-requests" element={<MyRequests />} />
                  <Route path="/pitch-deck" element={<PitchDeck />} />
                  <Route path="/builder" element={<BusinessPlanBuilder />} />
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
        </FormSchemaProvider>
      </DataProvider>
    </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
