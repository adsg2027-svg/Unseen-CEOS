import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useData } from '../../context/DataContext';
import { formatINR } from '../../utils/agencyScore';
import { generateBusinessPlanSection, isApiKeyConfigured } from '../../utils/gemini';
import { Sparkles, Loader2 } from 'lucide-react';
import Button from '../common/Button';
import MarkdownRenderer from '../common/MarkdownRenderer';

// Defined at module level so React never treats it as a new component type on re-render
function InputField({ label, value, onChange, prefix }) {
  return (
    <div>
      <label className="text-sm font-medium text-warm-700 block mb-1">{label}</label>
      <div className="flex items-center bg-warm-50 border border-warm-200 rounded-lg overflow-hidden focus-within:border-primary-300">
        {prefix && <span className="px-2 text-sm text-warm-400">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-warm-900 outline-none"
        />
      </div>
    </div>
  );
}

const TABS = [
  { key: 'revenue', label: 'Revenue Model' },
  { key: 'unit', label: 'Unit Economics' },
  { key: 'capital', label: 'Working Capital' },
];

export default function TemplateForm({ selectedEntrepreneur, onSelectEntrepreneur }) {
  const { entrepreneurs } = useData();
  const [activeTab, setActiveTab] = useState('revenue');
  const [aiOutput, setAiOutput] = useState({});
  const [loading, setLoading] = useState('');

  // Revenue model fields
  const [product, setProduct] = useState(selectedEntrepreneur?.unitEconomics?.productName || '');
  const [unitPrice, setUnitPrice] = useState(selectedEntrepreneur?.unitEconomics?.unitPrice || 0);
  const [dailyUnits, setDailyUnits] = useState(selectedEntrepreneur?.unitEconomics?.dailyUnits || 0);
  const [operatingDays, setOperatingDays] = useState(26);

  // Unit economics fields
  const [materialCost, setMaterialCost] = useState(selectedEntrepreneur?.unitEconomics?.unitCost || 0);
  const [laborCost, setLaborCost] = useState(0);
  const [overhead, setOverhead] = useState(0);

  // Working capital fields
  const [monthlyRawMaterial, setMonthlyRawMaterial] = useState(selectedEntrepreneur?.monthlyCosts ? Math.round(selectedEntrepreneur.monthlyCosts * 0.6) : 0);
  const [rent, setRent] = useState(0);
  const [utilities, setUtilities] = useState(0);
  const [laborMonthly, setLaborMonthly] = useState(0);

  // Sync form fields when a different entrepreneur is selected
  useEffect(() => {
    if (selectedEntrepreneur) {
      setProduct(selectedEntrepreneur.unitEconomics?.productName || '');
      setUnitPrice(selectedEntrepreneur.unitEconomics?.unitPrice || 0);
      setDailyUnits(selectedEntrepreneur.unitEconomics?.dailyUnits || 0);
      setMaterialCost(selectedEntrepreneur.unitEconomics?.unitCost || 0);
      setMonthlyRawMaterial(Math.round((selectedEntrepreneur.monthlyCosts || 0) * 0.6));
    }
  }, [selectedEntrepreneur?.id]);

  const monthlyRevenue = unitPrice * dailyUnits * operatingDays;
  const annualRevenue = monthlyRevenue * 12;
  const totalUnitCost = materialCost + laborCost + overhead;
  const grossMargin = unitPrice - totalUnitCost;
  const grossMarginPercent = unitPrice > 0 ? Math.round((grossMargin / unitPrice) * 100) : 0;
  const breakEvenUnits = grossMargin > 0 ? Math.ceil((rent + utilities + laborMonthly) / grossMargin) : 0;
  const totalMonthlyExpenses = monthlyRawMaterial + rent + utilities + laborMonthly;
  const workingCapital = Math.round(totalMonthlyExpenses * 1.5);

  const pieData = totalUnitCost > 0 ? [
    { name: 'Material', value: materialCost, color: '#E97451' },
    { name: 'Labor', value: laborCost || 0, color: '#F59E0B' },
    { name: 'Overhead', value: overhead || 0, color: '#78716C' },
    { name: 'Margin', value: Math.max(0, grossMargin), color: '#10B981' },
  ].filter(d => d.value > 0) : [];

  async function handleGenerate(section) {
    if (!selectedEntrepreneur || !isApiKeyConfigured()) return;
    setLoading(section);
    const result = await generateBusinessPlanSection(selectedEntrepreneur, section);
    if (result.success) {
      setAiOutput(prev => ({ ...prev, [section]: result.data }));
    } else {
      setAiOutput(prev => ({ ...prev, [section]: `Error: ${result.error}` }));
    }
    setLoading('');
  }

  const InputField = ({ label, value, onChange, prefix }) => (
    <div>
      <label className="text-sm font-medium text-warm-700 block mb-1">{label}</label>
      <div className="flex items-center bg-warm-50 border border-warm-200 rounded-lg overflow-hidden focus-within:border-primary-300">
        {prefix && <span className="px-2 text-sm text-warm-400">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-warm-900 outline-none"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-warm-200 shadow-sm">
      {/* Entrepreneur selector */}
      <div className="p-4 border-b border-warm-100">
        <label className="text-sm font-medium text-warm-700 block mb-2">Select Entrepreneur</label>
        <select
          value={selectedEntrepreneur?.id || ''}
          onChange={(e) => onSelectEntrepreneur(e.target.value)}
          className="w-full text-sm border border-warm-200 rounded-lg px-3 py-2 bg-white text-warm-700 outline-none focus:border-primary-300"
        >
          <option value="">Choose an entrepreneur...</option>
          {entrepreneurs.map(e => (
            <option key={e.id} value={e.id}>{e.name} — {e.businessName}</option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-warm-100">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-sm font-medium transition-colors
              ${activeTab === tab.key
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-warm-500 hover:text-warm-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Revenue Model Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-warm-700 block mb-1">Product/Service</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full bg-warm-50 border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-900 outline-none focus:border-primary-300"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <InputField label="Unit Price" value={unitPrice} onChange={setUnitPrice} prefix="₹" />
              <InputField label="Daily Units" value={dailyUnits} onChange={setDailyUnits} />
              <InputField label="Days/Month" value={operatingDays} onChange={setOperatingDays} />
            </div>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-primary-600">Monthly Revenue</p>
                  <p className="text-xl font-bold text-primary-700">{formatINR(monthlyRevenue)}</p>
                </div>
                <div>
                  <p className="text-xs text-primary-600">Annual Projection</p>
                  <p className="text-xl font-bold text-primary-700">{formatINR(annualRevenue)}</p>
                </div>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={loading === 'revenue_model' ? Loader2 : Sparkles}
              onClick={() => handleGenerate('revenue_model')}
              disabled={!selectedEntrepreneur || !isApiKeyConfigured() || loading === 'revenue_model'}
            >
              {loading === 'revenue_model' ? 'Generating...' : 'Generate with AI'}
            </Button>
          </div>
        )}

        {/* Unit Economics Tab */}
        {activeTab === 'unit' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <InputField label="Material Cost" value={materialCost} onChange={setMaterialCost} prefix="₹" />
              <InputField label="Labor/Unit" value={laborCost} onChange={setLaborCost} prefix="₹" />
              <InputField label="Overhead/Unit" value={overhead} onChange={setOverhead} prefix="₹" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-warm-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-600">Selling Price</span>
                  <span className="font-semibold">{formatINR(unitPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-600">Total Unit Cost</span>
                  <span className="font-semibold">{formatINR(totalUnitCost)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-warm-200 pt-2">
                  <span className="text-green-700 font-medium">Gross Margin</span>
                  <span className="font-bold text-green-700">{formatINR(grossMargin)} ({grossMarginPercent}%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-600">Break-even Units/mo</span>
                  <span className="font-semibold">{breakEvenUnits}</span>
                </div>
              </div>
              {pieData.length > 0 && (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={70} label={({ name }) => name}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatINR(v)} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={loading === 'unit_economics' ? Loader2 : Sparkles}
              onClick={() => handleGenerate('unit_economics')}
              disabled={!selectedEntrepreneur || !isApiKeyConfigured() || loading === 'unit_economics'}
            >
              {loading === 'unit_economics' ? 'Generating...' : 'Generate with AI'}
            </Button>
          </div>
        )}

        {/* Working Capital Tab */}
        {activeTab === 'capital' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Raw Materials/mo" value={monthlyRawMaterial} onChange={setMonthlyRawMaterial} prefix="₹" />
              <InputField label="Rent/mo" value={rent} onChange={setRent} prefix="₹" />
              <InputField label="Utilities/mo" value={utilities} onChange={setUtilities} prefix="₹" />
              <InputField label="Labor/mo" value={laborMonthly} onChange={setLaborMonthly} prefix="₹" />
            </div>

            <div className="bg-warm-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-warm-600">Total Monthly Expenses</span>
                <span className="font-semibold">{formatINR(totalMonthlyExpenses)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-warm-200 pt-2">
                <span className="text-primary-700 font-medium">Recommended Working Capital (1.5x)</span>
                <span className="font-bold text-primary-700">{formatINR(workingCapital)}</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-amber-800 mb-1">Why ~₹1 Lakh is Optimal</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                For most micro-enterprises with monthly revenues of ₹20,000–₹80,000, approximately ₹1 lakh of working capital
                provides 1.5–2 months of operating runway. This covers seasonal demand fluctuations,
                allows bulk raw material purchasing at better rates, and provides a buffer for delayed payments
                from customers — without creating excessive debt burden.
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={loading === 'working_capital' ? Loader2 : Sparkles}
              onClick={() => handleGenerate('working_capital')}
              disabled={!selectedEntrepreneur || !isApiKeyConfigured() || loading === 'working_capital'}
            >
              {loading === 'working_capital' ? 'Generating...' : 'Generate with AI'}
            </Button>
          </div>
        )}

        {/* AI Output */}
        {aiOutput[activeTab === 'revenue' ? 'revenue_model' : activeTab === 'unit' ? 'unit_economics' : 'working_capital'] && (
          <div className="mt-4 bg-warm-50 border border-warm-200 rounded-lg p-4">
            <p className="text-xs font-medium text-primary-600 mb-3 flex items-center gap-1">
              <Sparkles size={12} /> AI Generated
            </p>
            <MarkdownRenderer>
              {aiOutput[activeTab === 'revenue' ? 'revenue_model' : activeTab === 'unit' ? 'unit_economics' : 'working_capital']}
            </MarkdownRenderer>
          </div>
        )}

        {!isApiKeyConfigured() && (
          <div className="mt-4 bg-warm-100 border border-warm-200 rounded-lg p-3 text-xs text-warm-500">
            AI features require a Gemini API key. Add <code className="bg-warm-200 px-1 rounded">VITE_GEMINI_API_KEY</code> to your <code className="bg-warm-200 px-1 rounded">.env</code> file and restart the dev server.
          </div>
        )}
      </div>
    </div>
  );
}
