import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatINR } from '../../utils/agencyScore';
import Card from '../common/Card';
import { TrendingUp, IndianRupee } from 'lucide-react';
import T from '../common/T';

export default function BusinessMetrics({ entrepreneur }) {
  const profitMargin = Math.round((entrepreneur.monthlyProfit / entrepreneur.monthlyRevenue) * 100);

  const chartData = [
    { name: 'Revenue', value: entrepreneur.monthlyRevenue, fill: '#E97451' },
    { name: 'Costs', value: entrepreneur.monthlyCosts, fill: '#A8A29E' },
    { name: 'Profit', value: entrepreneur.monthlyProfit, fill: '#10B981' },
  ];

  const metrics = [
    { labelKey: 'Monthly Revenue', value: formatINR(entrepreneur.monthlyRevenue), color: 'text-primary-600' },
    { labelKey: 'Monthly Costs',   value: formatINR(entrepreneur.monthlyCosts),   color: 'text-warm-600'    },
    { labelKey: 'Monthly Profit',  value: formatINR(entrepreneur.monthlyProfit),  color: 'text-green-600'   },
    { labelKey: 'Profit Margin',   value: `${profitMargin}%`,                     color: profitMargin >= 30 ? 'text-green-600' : 'text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <Card title={<T>Financial Overview</T>} icon={IndianRupee}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {metrics.map((m, i) => (
            <div key={i} className="bg-warm-50 rounded-lg p-3">
              <p className="text-xs text-warm-500"><T>{m.labelKey}</T></p>
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
        <Card title={<T>Unit Economics</T>} icon={TrendingUp}>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-warm-100">
              <span className="text-sm text-warm-600"><T>Product/Service</T></span>
              <span className="text-sm font-semibold text-warm-900">{entrepreneur.unitEconomics.productName}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-warm-100">
              <span className="text-sm text-warm-600"><T>Unit Price</T></span>
              <span className="text-sm font-semibold text-warm-900">{formatINR(entrepreneur.unitEconomics.unitPrice)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-warm-100">
              <span className="text-sm text-warm-600"><T>Unit Cost</T></span>
              <span className="text-sm font-semibold text-warm-900">{formatINR(entrepreneur.unitEconomics.unitCost)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-warm-100">
              <span className="text-sm text-warm-600"><T>Daily Units</T></span>
              <span className="text-sm font-semibold text-warm-900">{entrepreneur.unitEconomics.dailyUnits}</span>
            </div>
            <div className="flex items-center justify-between py-2 bg-green-50 rounded-lg px-3 -mx-1">
              <span className="text-sm font-medium text-green-700"><T>Margin per Unit</T></span>
              <span className="text-sm font-bold text-green-700">{formatINR(entrepreneur.unitEconomics.marginPerUnit)}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
