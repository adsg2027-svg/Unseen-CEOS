import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function VentureForm({ user, onComplete, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    name: user?.displayName || '',
    age: '',
    location: '',
    state: '',
    sector: '',
    businessName: '',
    businessType: '',
    yearsInBusiness: '',
    registrationType: 'Informal',
    agencyScore: {
      pricingControl: 3,
      supplierNegotiation: 3,
      profitControl: 3,
      operationsManagement: 3,
      digitalSkills: 3,
    },
    monthlyRevenue: '',
    monthlyCosts: '',
    fundingNeeded: '',
    fundingPurpose: '',
    currentFundingSources: '',
    unitEconomics: {
      productName: '',
      unitPrice: '',
      unitCost: '',
      dailyUnits: '',
    },
    growthPlan: {
      shortTerm: '',
      mediumTerm: '',
      longTerm: '',
    },
    challenges: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: ['pricingControl', 'supplierNegotiation', 'profitControl', 'operationsManagement', 'digitalSkills'].includes(child)
            ? Number(value) : value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user) throw new Error('No user signed in');
      
      const { pricingControl, supplierNegotiation, profitControl, operationsManagement, digitalSkills } = formData.agencyScore;
      const total = pricingControl + supplierNegotiation + profitControl + operationsManagement + digitalSkills;
      const percentage = Math.round((total / 25) * 100);

      const payload = {
        ...formData,
        age: Number(formData.age) || 0,
        yearsInBusiness: Number(formData.yearsInBusiness) || 0,
        monthlyRevenue: Number(formData.monthlyRevenue) || 0,
        monthlyCosts: Number(formData.monthlyCosts) || 0,
        monthlyProfit: (Number(formData.monthlyRevenue) || 0) - (Number(formData.monthlyCosts) || 0),
        fundingNeeded: Number(formData.fundingNeeded) || 0,
        currentFundingSources: formData.currentFundingSources.split(',').map(s => s.trim()).filter(Boolean),
        challenges: formData.challenges.split(',').map(s => s.trim()).filter(Boolean),
        agencyScore: {
          ...formData.agencyScore,
          total,
          percentage
        },
        unitEconomics: {
          ...formData.unitEconomics,
          unitPrice: Number(formData.unitEconomics.unitPrice) || 0,
          unitCost: Number(formData.unitEconomics.unitCost) || 0,
          dailyUnits: Number(formData.unitEconomics.dailyUnits) || 0,
          marginPerUnit: (Number(formData.unitEconomics.unitPrice) || 0) - (Number(formData.unitEconomics.unitCost) || 0)
        },
        interviewDate: new Date().toISOString().split('T')[0],
        interviewedBy: 'Self Registered',
        isShortlisted: false,
        avatarColor: '#E97451',
        type: 'venture'
      };

      await setDoc(doc(db, 'entrepreneurs', user.uid), payload);
      onComplete();
    } catch (err) {
      console.error(err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";
  const labelClass = "block text-xs font-semibold text-warm-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in text-left">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-warm-900">Venture Profile</h2>
        <p className="text-warm-500 text-sm mt-1">Tell us about yourself and your business</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className={labelClass}>Full Name</label><input required name="name" value={formData.name} onChange={handleChange} className={inputClass} /></div>
        <div><label className={labelClass}>Age</label><input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClass} /></div>
        <div><label className={labelClass}>City / Location</label><input required name="location" value={formData.location} onChange={handleChange} className={inputClass} /></div>
        <div><label className={labelClass}>State</label><input required name="state" value={formData.state} onChange={handleChange} className={inputClass} /></div>
        <div><label className={labelClass}>Business Name</label><input required name="businessName" value={formData.businessName} onChange={handleChange} className={inputClass} /></div>
        <div><label className={labelClass}>Sector (e.g., Food)</label><input required name="sector" value={formData.sector} onChange={handleChange} className={inputClass} /></div>
        <div><label className={labelClass}>Business Type</label><input required name="businessType" value={formData.businessType} onChange={handleChange} className={inputClass} /></div>
        <div><label className={labelClass}>Years in Business</label><input type="number" required name="yearsInBusiness" value={formData.yearsInBusiness} onChange={handleChange} className={inputClass} /></div>
        <div>
          <label className={labelClass}>Registration Type</label>
          <select name="registrationType" value={formData.registrationType} onChange={handleChange} className={inputClass}>
            <option value="Informal">Informal</option>
            <option value="Udyam">Udyam</option>
            <option value="MSME">MSME</option>
            <option value="Private Limited">Private Limited</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-warm-100 pt-4">
        <div><label className={labelClass}>Monthly Revenue (₹)</label><input type="number" required name="monthlyRevenue" value={formData.monthlyRevenue} onChange={handleChange} className={inputClass} /></div>
        <div><label className={labelClass}>Monthly Costs (₹)</label><input type="number" required name="monthlyCosts" value={formData.monthlyCosts} onChange={handleChange} className={inputClass} /></div>
        <div><label className={labelClass}>Funding Needed (₹)</label><input type="number" required name="fundingNeeded" value={formData.fundingNeeded} onChange={handleChange} className={inputClass} /></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className={labelClass}>Purpose of Funding</label><input required name="fundingPurpose" value={formData.fundingPurpose} onChange={handleChange} className={inputClass} placeholder="e.g. Buy new equipment" /></div>
        <div><label className={labelClass}>Current Funding Sources</label><input name="currentFundingSources" value={formData.currentFundingSources} onChange={handleChange} className={inputClass} placeholder="Comma separated" /></div>
      </div>

      <div className="border-t border-warm-100 pt-4">
        <h3 className="text-sm font-bold text-warm-900 mb-3">Unit Economics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2"><label className={labelClass}>Main Product</label><input required name="unitEconomics.productName" value={formData.unitEconomics.productName} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Price per Unit (₹)</label><input type="number" required name="unitEconomics.unitPrice" value={formData.unitEconomics.unitPrice} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Cost per Unit (₹)</label><input type="number" required name="unitEconomics.unitCost" value={formData.unitEconomics.unitCost} onChange={handleChange} className={inputClass} /></div>
        </div>
      </div>

      <div className="border-t border-warm-100 pt-4">
        <h3 className="text-sm font-bold text-warm-900 mb-3">Agency Self-Reflection (1 to 5)</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Pricing Control ({formData.agencyScore.pricingControl})</label>
            <input type="range" min="1" max="5" name="agencyScore.pricingControl" value={formData.agencyScore.pricingControl} onChange={handleChange} className="w-full" />
          </div>
          <div>
            <label className={labelClass}>Supplier Negotiation ({formData.agencyScore.supplierNegotiation})</label>
            <input type="range" min="1" max="5" name="agencyScore.supplierNegotiation" value={formData.agencyScore.supplierNegotiation} onChange={handleChange} className="w-full" />
          </div>
          <div>
            <label className={labelClass}>Profit Control ({formData.agencyScore.profitControl})</label>
            <input type="range" min="1" max="5" name="agencyScore.profitControl" value={formData.agencyScore.profitControl} onChange={handleChange} className="w-full" />
          </div>
          <div>
            <label className={labelClass}>Operations Management ({formData.agencyScore.operationsManagement})</label>
            <input type="range" min="1" max="5" name="agencyScore.operationsManagement" value={formData.agencyScore.operationsManagement} onChange={handleChange} className="w-full" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Digital Skills ({formData.agencyScore.digitalSkills})</label>
            <input type="range" min="1" max="5" name="agencyScore.digitalSkills" value={formData.agencyScore.digitalSkills} onChange={handleChange} className="w-full" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mt-6"
      >
        {loading ? 'Saving Profile...' : 'Complete Profile'}
      </button>
    </form>
  );
}