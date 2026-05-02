import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function FunderForm({ user, onComplete, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    name: user?.displayName || '',
    organization: '',
    about: '',
    investmentRange: '',
    preferredSectors: '',
    fundingType: 'Grant',
    pastInvestments: '',
    website: '',
    location: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user) throw new Error('No user signed in');
      
      const payload = {
        ...formData,
        preferredSectors: formData.preferredSectors.split(',').map(s => s.trim()).filter(Boolean),
        type: 'funder',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'funders', user.uid), payload);
      onComplete();
    } catch (err) {
      console.error(err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-900 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all";
  const labelClass = "block text-xs font-semibold text-warm-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in text-left">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-warm-900">Funder Profile</h2>
        <p className="text-warm-500 text-sm mt-1">Tell ventures about what you look for</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className={labelClass}>Full Name</label><input required name="name" value={formData.name} onChange={handleChange} className={inputClass} /></div>
        <div><label className={labelClass}>Organization</label><input required name="organization" value={formData.organization} onChange={handleChange} className={inputClass} /></div>
      </div>

      <div>
        <label className={labelClass}>About / Description</label>
        <textarea required name="about" value={formData.about} onChange={handleChange} rows={3} className={inputClass} placeholder="Describe your organization and mission" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div><label className={labelClass}>City / Location</label><input name="location" value={formData.location} onChange={handleChange} className={inputClass} /></div>
        <div><label className={labelClass}>Website / LinkedIn</label><input name="website" value={formData.website} onChange={handleChange} className={inputClass} /></div>
        <div>
          <label className={labelClass}>Primary Funding Type</label>
          <select name="fundingType" value={formData.fundingType} onChange={handleChange} className={inputClass}>
            <option value="Grant">Grant</option>
            <option value="Equity">Equity</option>
            <option value="Debt / Loan">Debt / Loan</option>
            <option value="Capacity Building">Capacity Building</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className={labelClass}>Sectors of Interest (comma separated)</label><input required name="preferredSectors" value={formData.preferredSectors} onChange={handleChange} className={inputClass} placeholder="e.g. Healthcare, Tech" /></div>
        <div><label className={labelClass}>Typical Ticket Size / Range</label><input required name="investmentRange" value={formData.investmentRange} onChange={handleChange} className={inputClass} placeholder="e.g. $10k - $50k" /></div>
      </div>

      <div>
        <label className={labelClass}>Notable Past Investments (optional)</label>
        <textarea name="pastInvestments" value={formData.pastInvestments} onChange={handleChange} rows={2} className={inputClass} placeholder="List startups or projects you've supported" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mt-6"
      >
        {loading ? 'Saving Profile...' : 'Complete Profile'}
      </button>
    </form>
  );
}