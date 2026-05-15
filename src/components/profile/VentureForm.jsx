import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useFormSchema } from '../../context/FormSchemaContext';
import { calculateAgencyScore } from '../../utils/agencyScore';
import { Loader2 } from 'lucide-react';

const AGENCY_PARAMS = [
  { key: 'pricingControl',       label: 'Pricing Control',        desc: 'Sets her own prices independently' },
  { key: 'supplierNegotiation',  label: 'Supplier Negotiation',   desc: 'Chooses and negotiates with suppliers' },
  { key: 'profitControl',        label: 'Profit Control',         desc: 'Decides how profits are spent/reinvested' },
  { key: 'operationsManagement', label: 'Operations Management',  desc: 'Manages daily business operations' },
  { key: 'digitalSkills',        label: 'Digital Skills',         desc: 'Uses UPI, digital bookkeeping, phone for business' },
];

function buildInitialFlat(schema, user, existing) {
  const init = {};
  schema.forEach(f => {
    if (existing?.[f.key] !== undefined) {
      init[f.key] = Array.isArray(existing[f.key])
        ? existing[f.key].join(', ')
        : String(existing[f.key]);
    } else {
      init[f.key] = f.type === 'select' ? (f.options?.[0] ?? '') : '';
    }
  });
  if (!init.name && user?.displayName) init.name = user.displayName;
  return init;
}

function DynamicField({ field, value, onChange, inputClass, labelClass }) {
  const id = `field-${field.key}`;
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {field.label}
        {field.required
          ? <span className="text-red-500 ml-0.5">*</span>
          : <span className="text-warm-400 ml-1 font-normal text-[10px]">(optional)</span>}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          id={id}
          name={field.key}
          value={value}
          onChange={onChange}
          required={field.required}
          placeholder={field.placeholder}
          rows={3}
          className={inputClass}
        />
      ) : field.type === 'select' ? (
        <select id={id} name={field.key} value={value} onChange={onChange} required={field.required} className={inputClass}>
          {(field.options ?? []).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          id={id}
          type={field.type === 'number' ? 'number' : 'text'}
          name={field.key}
          value={value}
          onChange={onChange}
          required={field.required}
          placeholder={field.placeholder}
          className={inputClass}
        />
      )}
    </div>
  );
}

export default function VentureForm({ user, onComplete, initialData }) {
  const { ventureSchema, schemasLoading } = useFormSchema();
  const [flatData, setFlatData]   = useState(() => buildInitialFlat(ventureSchema, user, initialData));
  const [agencyScore, setAgency]  = useState(initialData?.agencyScore ?? { pricingControl: 3, supplierNegotiation: 3, profitControl: 3, operationsManagement: 3, digitalSkills: 3 });
  const [unitEcon, setUnitEcon]   = useState(initialData?.unitEconomics ?? { productName: '', unitPrice: '', unitCost: '', dailyUnits: '' });
  const [growthPlan, setGrowth]   = useState(initialData?.growthPlan ?? { shortTerm: '', mediumTerm: '', longTerm: '' });
  const [loading, setLoading]     = useState(false);

  // Re-init flat fields whenever schema loads / changes
  useEffect(() => {
    setFlatData(buildInitialFlat(ventureSchema, user, initialData));
  }, [ventureSchema]);

  const handleFlat = e => setFlatData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user) throw new Error('No user signed in');

      // Build payload from flat dynamic fields
      const payload = {};
      ventureSchema.forEach(f => {
        const raw = flatData[f.key] ?? '';
        if (f.storeAsArray) {
          payload[f.key] = raw.split(',').map(s => s.trim()).filter(Boolean);
        } else if (f.type === 'number') {
          payload[f.key] = Number(raw) || 0;
        } else {
          payload[f.key] = raw;
        }
      });

      // Derived fields
      payload.monthlyProfit = (payload.monthlyRevenue ?? 0) - (payload.monthlyCosts ?? 0);

      // Agency score
      const score = calculateAgencyScore(agencyScore);
      payload.agencyScore = { ...agencyScore, total: score.total, percentage: score.percentage };

      // Unit economics
      const up = Number(unitEcon.unitPrice) || 0;
      const uc = Number(unitEcon.unitCost)  || 0;
      payload.unitEconomics = {
        productName: unitEcon.productName,
        unitPrice:   up,
        unitCost:    uc,
        dailyUnits:  Number(unitEcon.dailyUnits) || 0,
        marginPerUnit: up - uc,
      };

      // Growth plan
      payload.growthPlan = growthPlan;

      // Metadata
      payload.interviewDate  = new Date().toISOString().split('T')[0];
      payload.interviewedBy  = 'Self Registered';
      payload.isShortlisted  = initialData?.isShortlisted ?? false;
      payload.avatarColor    = initialData?.avatarColor ?? '#E97451';
      payload.type           = 'venture';

      await setDoc(doc(db, 'entrepreneurs', user.uid), payload);
      onComplete();
    } catch (err) {
      console.error(err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-white border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all';
  const labelClass = 'block text-xs font-semibold text-warm-700 mb-1';

  if (schemasLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 text-primary-500 animate-spin" />
      </div>
    );
  }

  // Group dynamic fields by section
  const sorted   = [...ventureSchema].sort((a, b) => a.order - b.order);
  const sections = sorted.reduce((acc, f) => {
    if (!acc[f.section]) acc[f.section] = [];
    acc[f.section].push(f);
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-warm-900">Venture Profile</h2>
        <p className="text-warm-500 text-sm mt-1">Tell us about yourself and your business</p>
      </div>

      {/* Dynamic sections */}
      {Object.entries(sections).map(([section, sFields]) => (
        <div key={section}>
          <h3 className="text-xs font-bold text-warm-500 uppercase tracking-wider mb-3 border-b border-warm-100 pb-1">{section}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sFields.map(f => (
              <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <DynamicField
                  field={f}
                  value={flatData[f.key] ?? ''}
                  onChange={handleFlat}
                  inputClass={inputClass}
                  labelClass={labelClass}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Hardcoded: Unit Economics */}
      <div>
        <h3 className="text-xs font-bold text-warm-500 uppercase tracking-wider mb-3 border-b border-warm-100 pb-1">Unit Economics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Main Product / Service<span className="text-red-500 ml-0.5">*</span></label>
            <input required value={unitEcon.productName} onChange={e => setUnitEcon(p => ({ ...p, productName: e.target.value }))} className={inputClass} placeholder="e.g. Tiffin meals" />
          </div>
          <div>
            <label className={labelClass}>Price per Unit (₹)<span className="text-red-500 ml-0.5">*</span></label>
            <input type="number" required value={unitEcon.unitPrice} onChange={e => setUnitEcon(p => ({ ...p, unitPrice: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Cost per Unit (₹)<span className="text-red-500 ml-0.5">*</span></label>
            <input type="number" required value={unitEcon.unitCost} onChange={e => setUnitEcon(p => ({ ...p, unitCost: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Units / Day <span className="text-warm-400 ml-1 font-normal text-[10px]">(optional)</span></label>
            <input type="number" value={unitEcon.dailyUnits} onChange={e => setUnitEcon(p => ({ ...p, dailyUnits: e.target.value }))} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Hardcoded: Growth Plan */}
      <div>
        <h3 className="text-xs font-bold text-warm-500 uppercase tracking-wider mb-3 border-b border-warm-100 pb-1">Growth Plan <span className="text-warm-400 font-normal normal-case tracking-normal text-[11px]">(optional)</span></h3>
        <div className="grid grid-cols-1 gap-3">
          {['shortTerm', 'mediumTerm', 'longTerm'].map(k => (
            <div key={k}>
              <label className={labelClass}>{{ shortTerm: 'Short-term (3 months)', mediumTerm: 'Mid-term (6–12 months)', longTerm: 'Long-term (2–3 years)' }[k]}</label>
              <input value={growthPlan[k]} onChange={e => setGrowth(p => ({ ...p, [k]: e.target.value }))} className={inputClass} />
            </div>
          ))}
        </div>
      </div>

      {/* Hardcoded: Agency Self-Reflection */}
      <div>
        <h3 className="text-xs font-bold text-warm-500 uppercase tracking-wider mb-1 border-b border-warm-100 pb-1">Agency Self-Reflection</h3>
        <p className="text-xs text-warm-400 mb-3">Rate yourself 1–5 on each dimension of business autonomy</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AGENCY_PARAMS.map(({ key, label, desc }) => (
            <div key={key} className={key === 'digitalSkills' ? 'sm:col-span-2' : ''}>
              <label className={labelClass}>
                {label}
                <span className="ml-2 font-black text-primary-500">{agencyScore[key]}</span>
                <span className="ml-1 text-warm-400 font-normal">/ 5</span>
              </label>
              <p className="text-[11px] text-warm-400 mb-1">{desc}</p>
              <input
                type="range" min="1" max="5" step="1"
                value={agencyScore[key]}
                onChange={e => setAgency(p => ({ ...p, [key]: Number(e.target.value) }))}
                className="w-full accent-primary-500"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mt-4"
      >
        {loading ? 'Saving Profile…' : 'Complete Profile'}
      </button>
    </form>
  );
}
