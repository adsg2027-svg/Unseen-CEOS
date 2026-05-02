import { useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { userType } = useAuth();

  const home = userType === 'venture' ? '/funders' : '/dashboard';

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldOff size={28} className="text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-warm-900 mb-2">Access Restricted</h1>
        <p className="text-sm text-warm-500 mb-6">
          This page is not available for your account type.
        </p>
        <button
          onClick={() => navigate(home)}
          className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
