import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import VentureForm from '../components/profile/VentureForm';
import FunderForm from '../components/profile/FunderForm';
import { Loader2 } from 'lucide-react';

export default function MyProfile() {
  const { user, userType } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      if (!user || !userType) {
        setLoading(false);
        return;
      }
      
      const collectionName = userType === 'venture' ? 'entrepreneurs' : 'funders';
      const docRef = doc(db, collectionName, user.uid);
      const snap = await getDoc(docRef);
      
      if (snap.exists()) {
        const data = snap.data();
        // Convert to string for forms
        if (data.currentFundingSources && Array.isArray(data.currentFundingSources)) {
          data.currentFundingSources = data.currentFundingSources.join(', ');
        }
        if (data.challenges && Array.isArray(data.challenges)) {
          data.challenges = data.challenges.join(', ');
        }
        if (data.preferredSectors && Array.isArray(data.preferredSectors)) {
          data.preferredSectors = data.preferredSectors.join(', ');
        }
        setProfileData(data);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [user, userType]);

  const handleComplete = () => {
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium text-sm text-center shadow-sm">
          {successMsg}
        </div>
      )}
      
      <div className="bg-white rounded-2xl shadow-sm border border-warm-200 p-6 md:p-8">
        {userType === 'venture' ? (
          <VentureForm user={user} onComplete={handleComplete} initialData={profileData} />
        ) : (
          <FunderForm user={user} onComplete={handleComplete} initialData={profileData} />
        )}
      </div>
    </div>
  );
}