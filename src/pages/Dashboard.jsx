import { RotateCcw, BarChart3 } from 'lucide-react';
import { useData } from '../context/DataContext';
import StatsCards from '../components/dashboard/StatsCards';
import EntrepreneurTable from '../components/dashboard/EntrepreneurTable';

export default function Dashboard() {
  const { dispatch } = useData();

  return (
    <div>
      {/* Gradient page header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-28 h-20 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="anim-fade-in-up">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 size={16} className="text-white/75" />
              <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest">Operations Hub</p>
            </div>
            <h1 className="text-2xl font-bold text-white">Data Collection Dashboard</h1>
            <p className="text-white/70 text-sm mt-1">Upload interview data and manage entrepreneur profiles</p>
          </div>
          <div className="anim-fade-in-up delay-300 shrink-0">
            <button
              onClick={() => {
                localStorage.removeItem('unseenceo_data');
                dispatch({ type: 'RESET_DATA' });
              }}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <RotateCcw size={13} />
              Reset to Demo Data
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="anim-fade-in-up delay-100">
        <StatsCards />
      </div>

      {/* Main content */}
      <div className="mt-6 anim-fade-in-up delay-200">
        <EntrepreneurTable />
      </div>
    </div>
  );
}
