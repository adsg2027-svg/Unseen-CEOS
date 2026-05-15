import { useState } from 'react';
import { useFormSchema, DEFAULT_VENTURE_FIELDS, DEFAULT_FUNDER_FIELDS } from '../../context/FormSchemaContext';
import Button from '../common/Button';
import {
  Plus, Trash2, Edit3, ChevronUp, ChevronDown, Save,
  RotateCcw, X, Check, ToggleLeft, ToggleRight,
} from 'lucide-react';

const FIELD_TYPES = [
  { value: 'text',     label: 'Text' },
  { value: 'number',   label: 'Number' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'select',   label: 'Dropdown' },
];

function uid() {
  return `f${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function FieldRow({ field, onEdit, onDelete, onMove, isFirst, isLast }) {
  const typeLabel = FIELD_TYPES.find(t => t.value === field.type)?.label ?? field.type;
  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-warm-200 rounded-xl hover:border-primary-200 transition-colors group">
      <div className="flex flex-col gap-0.5 shrink-0">
        <button onClick={() => onMove(-1)} disabled={isFirst} className="p-0.5 text-warm-400 hover:text-warm-700 disabled:opacity-30">
          <ChevronUp size={14} />
        </button>
        <button onClick={() => onMove(1)} disabled={isLast} className="p-0.5 text-warm-400 hover:text-warm-700 disabled:opacity-30">
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-warm-900">{field.label}</span>
          {field.required && (
            <span className="text-[10px] bg-red-50 text-red-500 border border-red-200 font-semibold px-1.5 py-0.5 rounded-full">Required</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[11px] text-warm-400 font-mono">{field.key}</span>
          <span className="text-[10px] bg-warm-100 text-warm-500 px-1.5 py-0.5 rounded font-medium">{typeLabel}</span>
          <span className="text-[10px] text-warm-400">{field.section}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(field)}
          className="p-1.5 text-warm-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={() => onDelete(field.id)}
          className="p-1.5 text-warm-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function FieldModal({ field, onSave, onClose }) {
  const [form, setForm] = useState(field ?? {
    id: uid(), key: '', label: '', type: 'text', required: false,
    placeholder: '', options: [], section: 'Custom', order: 999, storeAsArray: false,
  });
  const [optionsText, setOptionsText] = useState((field?.options ?? []).join('\n'));

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function handleSave() {
    if (!form.key.trim() || !form.label.trim()) return;
    const cleaned = {
      ...form,
      key: form.key.trim().replace(/\s+/g, '_'),
      options: form.type === 'select'
        ? optionsText.split('\n').map(s => s.trim()).filter(Boolean)
        : [],
    };
    onSave(cleaned);
  }

  const inputClass = 'w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all';

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-warm-200">
          <h3 className="font-semibold text-warm-900">{field ? 'Edit Field' : 'Add New Field'}</h3>
          <button onClick={onClose} className="p-1.5 text-warm-400 hover:text-warm-700 hover:bg-warm-100 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-warm-600 mb-1">Field Key <span className="text-warm-400 font-normal">(no spaces)</span></label>
              <input
                value={form.key}
                onChange={e => set('key', e.target.value)}
                placeholder="e.g. instagramHandle"
                disabled={!!field}
                className={`${inputClass} ${field ? 'bg-warm-50 text-warm-400 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-600 mb-1">Display Label</label>
              <input value={form.label} onChange={e => set('label', e.target.value)} placeholder="e.g. Instagram Handle" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-warm-600 mb-1">Input Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className={inputClass}>
                {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-warm-600 mb-1">Section / Group</label>
              <input value={form.section} onChange={e => set('section', e.target.value)} placeholder="e.g. Business Details" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-warm-600 mb-1">Placeholder Text</label>
            <input value={form.placeholder} onChange={e => set('placeholder', e.target.value)} placeholder="Hint shown inside the input" className={inputClass} />
          </div>

          {form.type === 'select' && (
            <div>
              <label className="block text-xs font-semibold text-warm-600 mb-1">Options <span className="text-warm-400 font-normal">(one per line)</span></label>
              <textarea
                rows={4}
                value={optionsText}
                onChange={e => setOptionsText(e.target.value)}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                className={inputClass}
              />
            </div>
          )}

          <div className="flex items-center justify-between p-3 bg-warm-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-warm-800">Required field</p>
              <p className="text-xs text-warm-500">User must fill this before submitting</p>
            </div>
            <button onClick={() => set('required', !form.required)} className="transition-colors">
              {form.required
                ? <ToggleRight size={28} className="text-primary-500" />
                : <ToggleLeft  size={28} className="text-warm-300" />}
            </button>
          </div>

          {form.type === 'text' && (
            <div className="flex items-center justify-between p-3 bg-warm-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-warm-800">Store as list</p>
                <p className="text-xs text-warm-500">Split comma-separated text into an array</p>
              </div>
              <button onClick={() => set('storeAsArray', !form.storeAsArray)} className="transition-colors">
                {form.storeAsArray
                  ? <ToggleRight size={28} className="text-primary-500" />
                  : <ToggleLeft  size={28} className="text-warm-300" />}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-warm-200 bg-warm-50 rounded-b-2xl">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={Check} onClick={handleSave} disabled={!form.key.trim() || !form.label.trim()}>
            {field ? 'Update Field' : 'Add Field'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function FormBuilder() {
  const { ventureSchema, funderSchema, saveSchema, resetSchema } = useFormSchema();
  const [role, setRole] = useState('venture');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [addingField, setAddingField] = useState(false);

  const fields = role === 'venture' ? [...ventureSchema] : [...funderSchema];

  // Local editable copy
  const [localFields, setLocalFields] = useState(null);
  const activeFields = localFields ?? fields;

  function setFields(newFields) {
    setLocalFields(newFields.map((f, i) => ({ ...f, order: i + 1 })));
    setSaved(false);
  }

  function handleMove(id, dir) {
    const idx = activeFields.findIndex(f => f.id === id);
    if (idx < 0) return;
    const next = [...activeFields];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setFields(next);
  }

  function handleDelete(id) {
    setFields(activeFields.filter(f => f.id !== id));
  }

  function handleEditSave(updated) {
    setFields(activeFields.map(f => f.id === updated.id ? updated : f));
    setEditingField(null);
  }

  function handleAddSave(newField) {
    setFields([...activeFields, newField]);
    setAddingField(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveSchema(role, activeFields);
      setSaved(true);
      setLocalFields(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (!window.confirm(`Reset the ${role} form to default fields? All custom changes will be lost.`)) return;
    await resetSchema(role);
    setLocalFields(null);
    setSaved(false);
  }

  // Group fields by section
  const sections = activeFields.reduce((acc, f) => {
    if (!acc[f.section]) acc[f.section] = [];
    acc[f.section].push(f);
    return acc;
  }, {});

  const isDirty = localFields !== null;

  return (
    <div>
      {/* Role tabs */}
      <div className="flex items-center gap-2 mb-5">
        {['venture', 'funder'].map(r => (
          <button
            key={r}
            onClick={() => { setRole(r); setLocalFields(null); setSaved(false); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
              ${role === r
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-warm-100 text-warm-600 hover:bg-warm-200'}`}
          >
            {r === 'venture' ? 'Venture Form' : 'Funder Form'}
          </button>
        ))}
        <div className="flex-1" />
        <Button variant="ghost" size="sm" icon={RotateCcw} onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button
          variant={saved ? 'secondary' : 'primary'}
          size="sm"
          icon={saved ? Check : Save}
          onClick={handleSave}
          disabled={saving || !isDirty}
        >
          {saving ? 'Saving…' : saved ? 'Saved' : 'Save Changes'}
        </Button>
      </div>

      {isDirty && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 font-medium">
          <Save size={12} />
          You have unsaved changes — click Save Changes to publish to all users.
        </div>
      )}

      {/* Fields grouped by section */}
      <div className="space-y-5">
        {Object.entries(sections).map(([section, sectionFields]) => (
          <div key={section}>
            <p className="text-xs font-bold text-warm-500 uppercase tracking-wider mb-2">{section}</p>
            <div className="space-y-2">
              {sectionFields.map((f, i) => {
                const globalIdx = activeFields.findIndex(af => af.id === f.id);
                return (
                  <FieldRow
                    key={f.id}
                    field={f}
                    onEdit={setEditingField}
                    onDelete={handleDelete}
                    onMove={dir => handleMove(f.id, dir)}
                    isFirst={globalIdx === 0}
                    isLast={globalIdx === activeFields.length - 1}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setAddingField(true)}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-warm-300 hover:border-primary-400 hover:bg-primary-50 text-warm-500 hover:text-primary-600 rounded-xl text-sm font-medium transition-all"
      >
        <Plus size={16} />
        Add New Field
      </button>

      {editingField && (
        <FieldModal field={editingField} onSave={handleEditSave} onClose={() => setEditingField(null)} />
      )}
      {addingField && (
        <FieldModal field={null} onSave={handleAddSave} onClose={() => setAddingField(false)} />
      )}
    </div>
  );
}
