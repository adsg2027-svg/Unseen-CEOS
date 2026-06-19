import { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore';

const DataContext = createContext(null);

const initialFilters = {
  sector: 'all',
  minAgencyScore: 0,
  maxFundingNeeded: Infinity,
  shortlistedOnly: false,
  searchQuery: '',
};

function getInitialState() {
  return {
    entrepreneurs: [],
    shortlistIds: [],
    filters: initialFilters,
    selectedEntrepreneurId: null,
    comparisonIds: [],
    sidebarOpen: false,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ENTREPRENEURS':
      return { ...state, entrepreneurs: action.payload };
    case 'ADD_UPLOADED_DATA':
      return { ...state, entrepreneurs: [...state.entrepreneurs, ...action.payload] };
    case 'SET_SHORTLIST_IDS':
      return { ...state, shortlistIds: action.payload };
    case 'TOGGLE_SHORTLIST': {
      const id = action.payload;
      const shortlistIds = state.shortlistIds.includes(id)
        ? state.shortlistIds.filter(i => i !== id)
        : [...state.shortlistIds, id];
      return { ...state, shortlistIds };
    }
    case 'UPDATE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS':
      return { ...state, filters: initialFilters };
    case 'SELECT_ENTREPRENEUR':
      return { ...state, selectedEntrepreneurId: action.payload };
    case 'TOGGLE_COMPARISON': {
      const id = action.payload;
      const ids = state.comparisonIds.includes(id)
        ? state.comparisonIds.filter(i => i !== id)
        : state.comparisonIds.length < 2
          ? [...state.comparisonIds, id]
          : [state.comparisonIds[1], id];
      return { ...state, comparisonIds: ids };
    }
    case 'UPDATE_ENTREPRENEUR': {
      const entrepreneurs = state.entrepreneurs.map(e =>
        e.id === action.payload.id ? { ...e, ...action.payload } : e
      );
      return { ...state, entrepreneurs };
    }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'CLOSE_SIDEBAR':
      return { ...state, sidebarOpen: false };
    case 'RESET_DATA':
      return { ...state, entrepreneurs: [] };
    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const { user, userType } = useAuth();
  const [state, dispatch] = useReducer(reducer, null, getInitialState);
  const [loading, setLoading] = useState(true);

  // Live entrepreneur data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'entrepreneurs'), (snapshot) => {
      const ents = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      dispatch({ type: 'SET_ENTREPRENEURS', payload: ents });
      setLoading(false);
    }, () => setLoading(false));
    return () => unsubscribe();
  }, []);

  // Load per-funder shortlist from Firestore
  useEffect(() => {
    if (!user?.uid || userType !== 'funder') return;
    const unsub = onSnapshot(doc(db, 'funderShortlists', user.uid), (snap) => {
      dispatch({ type: 'SET_SHORTLIST_IDS', payload: snap.exists() ? (snap.data().ids ?? []) : [] });
    });
    return () => unsub();
  }, [user?.uid, userType]);

  // Persist shortlist toggle to Firestore
  const toggleShortlist = useCallback(async (entrepreneurId) => {
    dispatch({ type: 'TOGGLE_SHORTLIST', payload: entrepreneurId });
    if (!user?.uid) return;
    const ref = doc(db, 'funderShortlists', user.uid);
    const isShortlisted = state.shortlistIds.includes(entrepreneurId);
    try {
      if (isShortlisted) {
        await updateDoc(ref, { ids: arrayRemove(entrepreneurId) });
      } else {
        await setDoc(ref, { ids: arrayUnion(entrepreneurId) }, { merge: true });
      }
    } catch {
      // Firestore write failed — local state still updated
    }
  }, [user?.uid, state.shortlistIds]);

  const sectors = [...new Set(state.entrepreneurs.filter(e => e.sector).map(e => e.sector))].sort();

  const filteredEntrepreneurs = state.entrepreneurs
    .filter(e => {
      if (!e?.id || !e?.agencyScore || !e?.name) return false;
      const { sector, minAgencyScore, maxFundingNeeded, shortlistedOnly, searchQuery } = state.filters;
      if (sector !== 'all' && e.sector !== sector) return false;
      if (e.agencyScore.percentage < minAgencyScore) return false;
      if (maxFundingNeeded !== Infinity && e.fundingNeeded > maxFundingNeeded) return false;
      if (shortlistedOnly && !state.shortlistIds.includes(e.id)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!e.name.toLowerCase().includes(q) && !e.businessName?.toLowerCase().includes(q) && !e.location?.toLowerCase().includes(q)) return false;
      }
      return true;
    })
    .map(e => ({ ...e, isShortlisted: state.shortlistIds.includes(e.id) }));

  const validEntrepreneurs = state.entrepreneurs.filter(e => e?.agencyScore?.percentage != null);
  const summaryStats = {
    total: state.entrepreneurs.length,
    avgAgencyScore: validEntrepreneurs.length
      ? Math.round(validEntrepreneurs.reduce((s, e) => s + e.agencyScore.percentage, 0) / validEntrepreneurs.length)
      : 0,
    totalFunding: validEntrepreneurs.reduce((s, e) => s + (e.fundingNeeded ?? 0), 0),
    shortlisted: state.shortlistIds.length,
    highAgency: validEntrepreneurs.filter(e => e.agencyScore.percentage >= 76).length,
    moderateAgency: validEntrepreneurs.filter(e => e.agencyScore.percentage >= 48 && e.agencyScore.percentage < 76).length,
    lowAgency: validEntrepreneurs.filter(e => e.agencyScore.percentage < 48).length,
  };

  const value = {
    ...state,
    dispatch,
    loading,
    sectors,
    toggleShortlist,
    filteredEntrepreneurs,
    summaryStats,
    getEntrepreneurById: (id) => state.entrepreneurs.find(e => e?.id === id),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
