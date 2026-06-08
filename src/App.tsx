import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Properties } from './pages/Properties';
import { PropertyDetail } from './pages/PropertyDetail';
import { RenovationTracker } from './pages/RenovationTracker';
import { Analytics } from './pages/Analytics';
import { PropertiesHub } from './pages/PropertiesHub';
import { Procurement } from './pages/Procurement';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/hub" element={<PropertiesHub />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/properties/:id" element={<PropertyDetail />} />
                  <Route path="/renovations" element={<RenovationTracker />} />
                  <Route path="/procurement" element={<Procurement />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
