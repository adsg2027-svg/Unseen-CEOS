import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

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
    case 'TOGGLE_SHORTLIST': {
      const entrepreneurs = state.entrepreneurs.map(e =>
        e.id === action.payload ? { ...e, isShortlisted: !e.isShortlisted } : e
      );
      return { ...state, entrepreneurs };
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
  const [state, dispatch] = useReducer(reducer, null, getInitialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'entrepreneurs'), (snapshot) => {
      const ents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      dispatch({ type: 'SET_ENTREPRENEURS', payload: ents });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredEntrepreneurs = state.entrepreneurs.filter(e => {
    if (!e || !e.id || !e.agencyScore || !e.name) return false; // guard against corrupted localStorage entries
    const { sector, minAgencyScore, maxFundingNeeded, shortlistedOnly, searchQuery } = state.filters;
    if (sector !== 'all' && e.sector !== sector) return false;
    if (e.agencyScore.percentage < minAgencyScore) return false;
    if (maxFundingNeeded !== Infinity && e.fundingNeeded > maxFundingNeeded) return false;
    if (shortlistedOnly && !e.isShortlisted) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!e.name.toLowerCase().includes(q) && !e.businessName.toLowerCase().includes(q) && !e.location.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const validEntrepreneurs = state.entrepreneurs.filter(e => e?.agencyScore?.percentage != null);
  const summaryStats = {
    total: state.entrepreneurs.length,
    avgAgencyScore: validEntrepreneurs.length
      ? Math.round(validEntrepreneurs.reduce((sum, e) => sum + e.agencyScore.percentage, 0) / validEntrepreneurs.length)
      : 0,
    totalFunding: validEntrepreneurs.reduce((sum, e) => sum + (e.fundingNeeded ?? 0), 0),
    shortlisted: state.entrepreneurs.filter(e => e?.isShortlisted).length,
    highAgency: validEntrepreneurs.filter(e => e.agencyScore.percentage >= 76).length,
    moderateAgency: validEntrepreneurs.filter(e => e.agencyScore.percentage >= 48 && e.agencyScore.percentage < 76).length,
    lowAgency: validEntrepreneurs.filter(e => e.agencyScore.percentage < 48).length,
  };

  const value = {
    ...state,
    dispatch,
    filteredEntrepreneurs,
    summaryStats,
    getEntrepreneurById: (id) => state.entrepreneurs.find(e => e && e.id === id),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
