import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, TrendingUp, Handshake } from 'lucide-react';

const USER_TYPES = [
  {
    value: 'venture',
    label: 'Venture',
    description: 'I am a woman entrepreneur looking to grow my business and access resources.',
    icon: TrendingUp,
    color: 'primary',
  },
  {
    value: 'funder',
    label: 'Funder',
    description: 'I am an investor or organization looking to discover and support entrepreneurs.',
    icon: Handshake,
    color: 'amber',
  },
];

export default function Signup() {
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!userType) return setError('Please select your account type.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');

    setError('');
    setLoading(true);
    try {
      await signup(email, password, displayName, userType);
      navigate(userType === 'venture' ? '/funders' : '/dashboard');
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError('');
    setGoogleLoading(true);
    try {
      const { isNewUser, userType: googleType } = await signInWithGoogle();
      navigate(isNewUser ? '/select-role' : googleType === 'venture' ? '/funders' : '/dashboard');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(friendlyError(err.code));
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-amber-700 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">UC</span>
            </div>
            <h1 className="text-2xl font-bold text-white">The Unseen CEOs</h1>
          </div>
          <p className="text-primary-200 text-sm">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Google Sign-Up */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 border border-warm-200 hover:border-warm-300 hover:bg-warm-50 disabled:opacity-60 rounded-lg py-2.5 text-sm font-medium text-warm-700 transition-colors mb-5"
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-warm-300 border-t-primary-500 rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-warm-200" />
            <span className="text-xs text-warm-400">or sign up with email</span>
            <div className="flex-1 h-px bg-warm-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* User type selection */}
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-2">I am a…</label>
              <div className="grid grid-cols-2 gap-3">
                {USER_TYPES.map(({ value, label, description, icon: Icon, color }) => {
                  const selected = userType === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setUserType(value)}
                      className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all
                        ${selected
                          ? color === 'primary'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-amber-500 bg-amber-50'
                          : 'border-warm-200 hover:border-warm-300 bg-white'
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                        ${selected
                          ? color === 'primary' ? 'bg-primary-500' : 'bg-amber-500'
                          : 'bg-warm-100'
                        }`}>
                        <Icon size={16} className={selected ? 'text-white' : 'text-warm-500'} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${selected ? (color === 'primary' ? 'text-primary-700' : 'text-amber-700') : 'text-warm-800'}`}>
                          {label}
                        </p>
                        <p className="text-xs text-warm-500 mt-0.5 leading-snug">{description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full border border-warm-200 rounded-lg px-3.5 py-2.5 text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-warm-200 rounded-lg px-3.5 py-2.5 text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full border border-warm-200 rounded-lg px-3.5 py-2.5 text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-warm-200 rounded-lg px-3.5 py-2.5 text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-warm-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.583c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.583 9 3.583z" fill="#EA4335" />
    </svg>
  );
}

function friendlyError(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
