import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useFormSchema } from '../../context/FormSchemaContext';
import { Loader2 } from 'lucide-react';
import T from '../common/T';

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

export default function FunderForm({ user, onComplete, initialData }) {
  const { funderSchema, schemasLoading } = useFormSchema();
  const [flatData, setFlatData] = useState(() => buildInitialFlat(funderSchema, user, initialData));
  const [loading, setLoading]  = useState(false);

  useEffect(() => {
    setFlatData(buildInitialFlat(funderSchema, user, initialData));
  }, [funderSchema]);

  const handleChange = e => setFlatData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user) throw new Error('No user signed in');

      const payload = {};
      funderSchema.forEach(f => {
        const raw = flatData[f.key] ?? '';
        if (f.storeAsArray) {
          payload[f.key] = raw.split(',').map(s => s.trim()).filter(Boolean);
        } else if (f.type === 'number') {
          payload[f.key] = Number(raw) || 0;
        } else {
          payload[f.key] = raw;
        }
      });

      payload.type      = 'funder';
      payload.createdAt = new Date().toISOString();

      await setDoc(doc(db, 'funders', user.uid), payload);
      onComplete();
    } catch (err) {
      console.error(err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-white border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-900 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all';
  const labelClass = 'block text-xs font-semibold text-warm-700 mb-1';

  if (schemasLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 text-amber-500 animate-spin" />
      </div>
    );
  }

  const sorted   = [...funderSchema].sort((a, b) => a.order - b.order);
  const sections = sorted.reduce((acc, f) => {
    if (!acc[f.section]) acc[f.section] = [];
    acc[f.section].push(f);
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-warm-900"><T>Funder Profile</T></h2>
        <p className="text-warm-500 text-sm mt-1"><T>Tell ventures about what you look for</T></p>
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
                  onChange={handleChange}
                  inputClass={inputClass}
                  labelClass={labelClass}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mt-4"
      >
        {loading ? <T>Saving Profile…</T> : <T>Complete Profile</T>}
      </button>
    </form>
  );
}
