import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatINR } from '../../utils/agencyScore';
import Card from '../common/Card';
import { TrendingUp, IndianRupee } from 'lucide-react';

export default function BusinessMetrics({ entrepreneur }) {
  const profitMargin = Math.round((entrepreneur.monthlyProfit / entrepreneur.monthlyRevenue) * 100);

  const chartData = [
    { name: 'Revenue', value: entrepreneur.monthlyRevenue, fill: '#E97451' },
    { name: 'Costs', value: entrepreneur.monthlyCosts, fill: '#A8A29E' },
    { name: 'Profit', value: entrepreneur.monthlyProfit, fill: '#10B981' },
  ];

  const metrics = [
    { label: 'Monthly Revenue', value: formatINR(entrepreneur.monthlyRevenue), color: 'text-primary-600' },
    { label: 'Monthly Costs', value: formatINR(entrepreneur.monthlyCosts), color: 'text-warm-600' },
    { label: 'Monthly Profit', value: formatINR(entrepreneur.monthlyProfit), color: 'text-green-600' },
    { label: 'Profit Margin', value: `${profitMargin}%`, color: profitMargin >= 30 ? 'text-green-600' : 'text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <Card title="Financial Overview" icon={IndianRupee}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {metrics.map((m, i) => (
            <div key={i} className="bg-warm-50 rounded-lg p-3">
              <p className="text-xs text-warm-500">{m.label}</p>
              <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#57534E' }} />
            <YAxis tick={{ fontSize: 10, fill: '#A8A29E' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => formatINR(value)} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {entrepreneur.unitEconomics?.productName && (
        <Card title="Unit Economics" icon={TrendingUp}>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-warm-100">
              <span className="text-sm text-warm-600">Product/Service</span>
              <span className="text-sm font-semibold text-warm-900">{entrepreneur.unitEconomics.productName}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-warm-100">
              <span className="text-sm text-warm-600">Unit Price</span>
              <span className="text-sm font-semibold text-warm-900">{formatINR(entrepreneur.unitEconomics.unitPrice)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-warm-100">
              <span className="text-sm text-warm-600">Unit Cost</span>
              <span className="text-sm font-semibold text-warm-900">{formatINR(entrepreneur.unitEconomics.unitCost)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-warm-100">
              <span className="text-sm text-warm-600">Daily Units</span>
              <span className="text-sm font-semibold text-warm-900">{entrepreneur.unitEconomics.dailyUnits}</span>
            </div>
            <div className="flex items-center justify-between py-2 bg-green-50 rounded-lg px-3 -mx-1">
              <span className="text-sm font-medium text-green-700">Margin per Unit</span>
              <span className="text-sm font-bold text-green-700">{formatINR(entrepreneur.unitEconomics.marginPerUnit)}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
