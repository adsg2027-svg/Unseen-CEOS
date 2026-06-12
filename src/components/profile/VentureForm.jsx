import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useFormSchema } from '../../context/FormSchemaContext';
import { calculateAgencyScore } from '../../utils/agencyScore';
import { Loader2 } from 'lucide-react';
import T from '../common/T';

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
        <T>{field.label}</T>
        {field.required
          ? <span className="text-red-500 ml-0.5">*</span>
          : <span className="text-warm-400 ml-1 font-normal text-[10px]">(<T>optional</T>)</span>}
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

  useEffect(() => {
    setFlatData(buildInitialFlat(ventureSchema, user, initialData));
  }, [ventureSchema]);

  const handleFlat = e => setFlatData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user) throw new Error('No user signed in');

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

      payload.monthlyProfit = (payload.monthlyRevenue ?? 0) - (payload.monthlyCosts ?? 0);

      const score = calculateAgencyScore(agencyScore);
      payload.agencyScore = { ...agencyScore, total: score.total, percentage: score.percentage };

      const up = Number(unitEcon.unitPrice) || 0;
      const uc = Number(unitEcon.unitCost)  || 0;
      payload.unitEconomics = {
        productName: unitEcon.productName,
        unitPrice:   up,
        unitCost:    uc,
        dailyUnits:  Number(unitEcon.dailyUnits) || 0,
        marginPerUnit: up - uc,
      };

      payload.growthPlan = growthPlan;

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

  const sorted   = [...ventureSchema].sort((a, b) => a.order - b.order);
  const sections = sorted.reduce((acc, f) => {
    if (!acc[f.section]) acc[f.section] = [];
    acc[f.section].push(f);
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-warm-900"><T>Venture Profile</T></h2>
        <p className="text-warm-500 text-sm mt-1"><T>Tell us about yourself and your business</T></p>
      </div>

      {Object.entries(sections).map(([section, sFields]) => (
        <div key={section}>
          <h3 className="text-xs font-bold text-warm-500 uppercase tracking-wider mb-3 border-b border-warm-100 pb-1"><T>{section}</T></h3>
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

      <div>
        <h3 className="text-xs font-bold text-warm-500 uppercase tracking-wider mb-3 border-b border-warm-100 pb-1"><T>Unit Economics</T></h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}><T>Main Product / Service</T><span className="text-red-500 ml-0.5">*</span></label>
            <input required value={unitEcon.productName} onChange={e => setUnitEcon(p => ({ ...p, productName: e.target.value }))} className={inputClass} placeholder="e.g. Tiffin meals" />
          </div>
          <div>
            <label className={labelClass}><T>Price per Unit (₹)</T><span className="text-red-500 ml-0.5">*</span></label>
            <input type="number" required value={unitEcon.unitPrice} onChange={e => setUnitEcon(p => ({ ...p, unitPrice: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}><T>Cost per Unit (₹)</T><span className="text-red-500 ml-0.5">*</span></label>
            <input type="number" required value={unitEcon.unitCost} onChange={e => setUnitEcon(p => ({ ...p, unitCost: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}><T>Units / Day</T> <span className="text-warm-400 ml-1 font-normal text-[10px]">(<T>optional</T>)</span></label>
            <input type="number" value={unitEcon.dailyUnits} onChange={e => setUnitEcon(p => ({ ...p, dailyUnits: e.target.value }))} className={inputClass} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-warm-500 uppercase tracking-wider mb-3 border-b border-warm-100 pb-1">
          <T>Growth Plan</T> <span className="text-warm-400 font-normal normal-case tracking-normal text-[11px]">(<T>optional</T>)</span>
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {[
            { key: 'shortTerm',  labelKey: 'Short-term (3 months)'   },
            { key: 'mediumTerm', labelKey: 'Mid-term (6–12 months)'  },
            { key: 'longTerm',   labelKey: 'Long-term (2–3 years)'   },
          ].map(({ key, labelKey }) => (
            <div key={key}>
              <label className={labelClass}><T>{labelKey}</T></label>
              <input value={growthPlan[key]} onChange={e => setGrowth(p => ({ ...p, [key]: e.target.value }))} className={inputClass} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-warm-500 uppercase tracking-wider mb-1 border-b border-warm-100 pb-1"><T>Agency Self-Reflection</T></h3>
        <p className="text-xs text-warm-400 mb-3"><T>Rate yourself 1–5 on each dimension of business autonomy</T></p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AGENCY_PARAMS.map(({ key, label, desc }) => (
            <div key={key} className={key === 'digitalSkills' ? 'sm:col-span-2' : ''}>
              <label className={labelClass}>
                <T>{label}</T>
                <span className="ml-2 font-black text-primary-500">{agencyScore[key]}</span>
                <span className="ml-1 text-warm-400 font-normal">/ 5</span>
              </label>
              <p className="text-[11px] text-warm-400 mb-1"><T>{desc}</T></p>
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
        {loading ? <T>Saving Profile…</T> : <T>Complete Profile</T>}
      </button>
    </form>
  );
}
