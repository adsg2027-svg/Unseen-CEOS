  import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Search, LogOut, ChevronDown, User as UserIcon } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { dispatch, filters } = useData();
  const { user, userProfile, userType, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate('/login');
  }

  const initials = userProfile?.displayName
    ? userProfile.displayName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  const roleLabel = userType === 'venture' ? 'Venture' : userType === 'funder' ? 'Funder' : '';
  const roleBadgeColor = userType === 'venture'
    ? 'bg-primary-100 text-primary-700'
    : 'bg-amber-100 text-amber-700';

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-warm-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="lg:hidden p-2 rounded-lg hover:bg-warm-100 transition-colors"
        >
          <Menu size={20} className="text-warm-700" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">UC</span>
          </div>
          <h1 className="text-lg font-bold text-warm-900 hidden sm:block">
            The Unseen <span className="text-primary-500">CEOs</span>
          </h1>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 bg-warm-50 border border-warm-200 rounded-lg px-3 py-2 w-72">
        <Search size={16} className="text-warm-400" />
        <input
          type="text"
          placeholder="Search entrepreneurs..."
          value={filters.searchQuery}
          onChange={(e) => dispatch({ type: 'UPDATE_FILTERS', payload: { searchQuery: e.target.value } })}
          className="bg-transparent text-sm text-warm-900 placeholder-warm-400 outline-none w-full"
        />
      </div>

      {/* User menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 hover:bg-warm-50 rounded-lg px-2 py-1.5 transition-colors"
        >
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 text-xs font-semibold">{initials}</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-warm-800 leading-tight">
              {userProfile?.displayName ?? user?.email}
            </p>
            {roleLabel && (
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${roleBadgeColor}`}>
                {roleLabel}
              </span>
            )}
          </div>
          <ChevronDown size={14} className="text-warm-400 hidden sm:block" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-warm-200 rounded-xl shadow-lg py-1 z-50">
            <div className="px-4 py-2.5 border-b border-warm-100">
              <p className="text-xs font-semibold text-warm-800 truncate">
                {userProfile?.displayName}
              </p>
              <p className="text-xs text-warm-400 truncate">{user?.email}</p>
            </div>
            
            <Link
              to="/my-profile"
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-warm-600 hover:bg-warm-50 transition-colors border-b border-warm-100"
            >
              <UserIcon size={15} />
              My Profile
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
