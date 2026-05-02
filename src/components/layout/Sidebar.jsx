import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Target, Users, Lightbulb, Handshake, Info, X, Send, Bell, Building2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const funderNav = [
  { to: '/',                icon: Home,            label: 'Home'         },
  { to: '/dashboard',       icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/profiles',        icon: Users,           label: 'Profiles'     },
  { to: '/agency',          icon: Target,          label: 'Agency Score' },
  { to: '/matching',        icon: Handshake,       label: 'Matching'     },
  { to: '/funder-requests', icon: Bell,            label: 'Requests'     },
  { to: '/about',           icon: Info,            label: 'About'        },
];

const ventureNav = [
  { to: '/',            icon: Home,      label: 'Home'         },
  { to: '/funders',     icon: Building2, label: 'Find Funders' },
  { to: '/my-requests', icon: Send,      label: 'My Requests'  },
  { to: '/builder',     icon: Lightbulb, label: 'Biz Builder'  },
  { to: '/about',       icon: Info,      label: 'About'        },
];

export default function Sidebar() {
  const { sidebarOpen, dispatch } = useData();
  const { userType, userProfile } = useAuth();

  const navItems = userType === 'venture' ? ventureNav : funderNav;
  const roleLabel = userType === 'venture' ? 'Venture' : userType === 'funder' ? 'Funder' : 'User';
  const roleBadgeColor = userType === 'venture'
    ? 'bg-primary-500/20 text-primary-300'
    : 'bg-amber-500/20 text-amber-300';

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-warm-900 text-warm-100 flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:top-16 lg:z-30 lg:h-[calc(100vh-4rem)]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 pt-6 pb-4 lg:hidden shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UC</span>
            </div>
            <span className="font-bold">The Unseen CEOs</span>
          </div>
          <button
            onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
            className="p-1 rounded hover:bg-warm-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        {userProfile && (
          <div className="px-4 pt-4 pb-2 lg:pt-6 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-500/30 flex items-center justify-center shrink-0">
                <span className="text-primary-300 text-xs font-bold uppercase">
                  {userProfile.displayName?.[0] ?? '?'}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-warm-200 truncate">{userProfile.displayName}</p>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${roleBadgeColor}`}>
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pt-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                ${isActive
                  ? 'bg-primary-500/20 text-primary-300 border-l-3 border-primary-400'
                  : 'text-warm-300 hover:bg-warm-800 hover:text-warm-100'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom card */}
        <div className="shrink-0 px-4 py-4 border-t border-warm-800">
          <div className="bg-warm-800 rounded-lg p-3">
            <p className="text-xs text-warm-400 mb-0.5">Platform by</p>
            <p className="text-sm font-medium text-warm-200">Student Researchers</p>
            <p className="text-xs text-warm-500 mt-0.5">Empowering real women-led growth</p>
          </div>
        </div>
      </aside>
    </>
  );
}
