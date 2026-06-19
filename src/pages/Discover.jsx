import { useState } from 'react';
import { Users, Target, Handshake } from 'lucide-react';
import Profiles from './Profiles';
import AgencyScore from './AgencyScore';
import Matching from './Matching';
import T from '../components/common/T';

const TABS = [
  { key: 'profiles',  labelKey: 'Profiles',     icon: Users     },
  { key: 'agency',    labelKey: 'Agency Score',  icon: Target    },
  { key: 'matching',  labelKey: 'Matching',      icon: Handshake },
];

export default function Discover() {
  const [activeTab, setActiveTab] = useState('profiles');

  return (
    <div className="space-y-0">
      {/* Tab bar */}
      <div className="flex gap-1 bg-warm-50 border border-warm-200 rounded-xl p-1 mb-6">
        {TABS.map(({ key, labelKey, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === key
                ? 'bg-white shadow-sm text-primary-600 border border-warm-200'
                : 'text-warm-500 hover:text-warm-700 hover:bg-warm-100'
              }`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline"><T>{labelKey}</T></span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={activeTab === 'profiles' ? '' : 'hidden'}>
        <Profiles />
      </div>
      <div className={activeTab === 'agency' ? '' : 'hidden'}>
        <AgencyScore />
      </div>
      <div className={activeTab === 'matching' ? '' : 'hidden'}>
        <Matching />
      </div>
    </div>
  );
}
