import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Handshake, AlertCircle } from 'lucide-react';
import VentureForm from '../components/profile/VentureForm';
import FunderForm from '../components/profile/FunderForm';
import T from '../components/common/T';

const USER_TYPES = [
  {
    value: 'venture',
    label: 'Entrepreneur',
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

export default function SelectRole() {
  const { saveUserType, user, userType: existingType } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (existingType) {
      setUserType(existingType);
      setStep(2);
    }
  }, [existingType]);

  async function handleComplete() {
    setError('');
    setLoading(true);
    try {
      await saveUserType(userType);
      navigate(userType === 'venture' ? '/funders' : '/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleContinue() {
    if (!userType) return setError('Please select your account type to continue.');
    setStep(2);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-amber-700 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">UC</span>
            </div>
            <h1 className="text-2xl font-bold text-white">The Unseen CEOs</h1>
          </div>
          <p className="text-primary-200 text-sm">
            {step === 1
              ? (user?.displayName ? `Welcome, ${user.displayName}! One last step.` : 'Welcome! One last step.')
              : 'Complete your profile'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 transition-all">
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <T>{error}</T>
            </div>
          )}

          {step === 1 ? (
            <>
              <h2 className="text-lg font-bold text-warm-900 mb-1 text-center"><T>Choose your account type</T></h2>
              <p className="text-sm text-warm-500 mb-5 text-center">
                <T>This determines which tools and views you'll have access to.</T>
              </p>

              <div className="grid grid-cols-1 gap-3 mb-6 max-w-md mx-auto">
                {USER_TYPES.map(({ value, label, description, icon: Icon, color }) => {
                  const selected = userType === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setUserType(value)}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all
                        ${selected
                          ? color === 'primary'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-amber-500 bg-amber-50'
                          : 'border-warm-200 hover:border-warm-300 bg-white'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                        ${selected
                          ? color === 'primary' ? 'bg-primary-500' : 'bg-amber-500'
                          : 'bg-warm-100'
                        }`}>
                        <Icon size={18} className={selected ? 'text-white' : 'text-warm-500'} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${selected ? (color === 'primary' ? 'text-primary-700' : 'text-amber-700') : 'text-warm-800'}`}>
                          <T>{label}</T>
                        </p>
                        <p className="text-xs text-warm-500 mt-0.5 leading-snug"><T>{description}</T></p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="max-w-md mx-auto">
                <button
                  onClick={handleContinue}
                  disabled={!userType}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  <T>Continue</T>
                </button>
              </div>
            </>
          ) : (
            <div className="w-full max-w-xl mx-auto">
              {userType === 'venture' ? (
                <VentureForm user={user} onComplete={handleComplete} />
              ) : (
                <FunderForm user={user} onComplete={handleComplete} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
