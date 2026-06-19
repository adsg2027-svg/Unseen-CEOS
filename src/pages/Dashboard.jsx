import { BarChart3 } from 'lucide-react';
import { useData } from '../context/DataContext';
import StatsCards from '../components/dashboard/StatsCards';
import EntrepreneurTable from '../components/dashboard/EntrepreneurTable';
import T from '../components/common/T';

export default function Dashboard() {
  const { dispatch, loading } = useData();

  return (
    <div>
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-28 h-20 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="anim-fade-in-up">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 size={16} className="text-white/75" />
              <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest">
                <T>Operations Hub</T>
              </p>
              <span className="flex items-center gap-1 ml-2 bg-white/10 rounded-full px-2 py-0.5 text-[10px] text-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <T>Live</T>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white"><T>Data Collection Dashboard</T></h1>
            <p className="text-white/70 text-sm mt-1">
              <T>Upload interview data and manage entrepreneur profiles</T>
            </p>
          </div>
        </div>
      </div>

      <div className="anim-fade-in-up delay-100">
        <StatsCards />
      </div>

      <div className="mt-6 anim-fade-in-up delay-200">
        <EntrepreneurTable />
      </div>
    </div>
  );
}
