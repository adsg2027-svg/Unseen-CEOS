import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

const FormSchemaContext = createContext(null);

export const DEFAULT_VENTURE_FIELDS = [
  { id: 'v1',  key: 'name',                 label: 'Full Name',                   type: 'text',     required: true,  placeholder: 'e.g. Lakshmi Devi',              section: 'Personal Info',    order: 1,  storeAsArray: false },
  { id: 'v2',  key: 'age',                  label: 'Age',                          type: 'number',   required: false, placeholder: '',                               section: 'Personal Info',    order: 2,  storeAsArray: false },
  { id: 'v3',  key: 'location',             label: 'City / Location',              type: 'text',     required: true,  placeholder: 'e.g. Dharavi, Mumbai',           section: 'Personal Info',    order: 3,  storeAsArray: false },
  { id: 'v4',  key: 'state',                label: 'State',                        type: 'text',     required: true,  placeholder: 'e.g. Maharashtra',               section: 'Personal Info',    order: 4,  storeAsArray: false },
  { id: 'v5',  key: 'businessName',         label: 'Business Name',                type: 'text',     required: true,  placeholder: '',                               section: 'Business Details', order: 5,  storeAsArray: false },
  { id: 'v6',  key: 'sector',               label: 'Sector',                       type: 'text',     required: true,  placeholder: 'e.g. Food & Catering',           section: 'Business Details', order: 6,  storeAsArray: false },
  { id: 'v7',  key: 'businessType',         label: 'Business Type',                type: 'text',     required: true,  placeholder: 'e.g. Home-based catering',       section: 'Business Details', order: 7,  storeAsArray: false },
  { id: 'v8',  key: 'yearsInBusiness',      label: 'Years in Business',            type: 'number',   required: true,  placeholder: '',                               section: 'Business Details', order: 8,  storeAsArray: false },
  { id: 'v9',  key: 'registrationType',     label: 'Registration Type',            type: 'select',   required: true,  placeholder: '',   options: ['Informal', 'Udyam', 'MSME', 'Private Limited'], section: 'Business Details', order: 9, storeAsArray: false },
  { id: 'v10', key: 'monthlyRevenue',       label: 'Monthly Revenue (₹)',          type: 'number',   required: true,  placeholder: '',                               section: 'Financials',       order: 10, storeAsArray: false },
  { id: 'v11', key: 'monthlyCosts',         label: 'Monthly Costs (₹)',            type: 'number',   required: true,  placeholder: '',                               section: 'Financials',       order: 11, storeAsArray: false },
  { id: 'v12', key: 'fundingNeeded',        label: 'Funding Needed (₹)',           type: 'number',   required: true,  placeholder: '',                               section: 'Financials',       order: 12, storeAsArray: false },
  { id: 'v13', key: 'fundingPurpose',       label: 'Purpose of Funding',           type: 'text',     required: true,  placeholder: 'e.g. Buy new equipment',         section: 'Financials',       order: 13, storeAsArray: false },
  { id: 'v14', key: 'currentFundingSources',label: 'Current Funding Sources',      type: 'text',     required: false, placeholder: 'Comma-separated, e.g. SHG loan, Savings', section: 'Financials', order: 14, storeAsArray: true },
  { id: 'v15', key: 'challenges',           label: 'Key Challenges',               type: 'text',     required: false, placeholder: 'Comma-separated',                section: 'Additional Info',  order: 15, storeAsArray: true },
  { id: 'v16', key: 'interviewNotes',       label: 'Additional Notes',             type: 'textarea', required: false, placeholder: 'Any other relevant details',     section: 'Additional Info',  order: 16, storeAsArray: false },
];

export const DEFAULT_FUNDER_FIELDS = [
  { id: 'fu1', key: 'name',             label: 'Full Name',               type: 'text',     required: true,  placeholder: '',                                    section: 'Basic Info',      order: 1,  storeAsArray: false },
  { id: 'fu2', key: 'organization',     label: 'Organization',            type: 'text',     required: true,  placeholder: '',                                    section: 'Basic Info',      order: 2,  storeAsArray: false },
  { id: 'fu3', key: 'about',            label: 'About / Description',     type: 'textarea', required: true,  placeholder: 'Describe your organization and mission', section: 'Basic Info',   order: 3,  storeAsArray: false },
  { id: 'fu4', key: 'location',         label: 'City / Location',         type: 'text',     required: false, placeholder: '',                                    section: 'Contact',         order: 4,  storeAsArray: false },
  { id: 'fu5', key: 'website',          label: 'Website / LinkedIn',      type: 'text',     required: false, placeholder: 'https://',                            section: 'Contact',         order: 5,  storeAsArray: false },
  { id: 'fu6', key: 'fundingType',      label: 'Primary Funding Type',    type: 'select',   required: true,  placeholder: '', options: ['Grant', 'Equity', 'Debt / Loan', 'Capacity Building'], section: 'Funding Details', order: 6, storeAsArray: false },
  { id: 'fu7', key: 'preferredSectors', label: 'Sectors of Interest',     type: 'text',     required: true,  placeholder: 'Comma-separated, e.g. Healthcare, Tech', section: 'Funding Details', order: 7, storeAsArray: true },
  { id: 'fu8', key: 'investmentRange',  label: 'Typical Ticket Size / Range', type: 'text', required: true,  placeholder: 'e.g. ₹50k – ₹5L',                   section: 'Funding Details', order: 8,  storeAsArray: false },
  { id: 'fu9', key: 'pastInvestments',  label: 'Notable Past Investments', type: 'textarea', required: false, placeholder: "List startups or projects you've supported", section: 'Additional Info', order: 9, storeAsArray: false },
];

export function FormSchemaProvider({ children }) {
  const [ventureSchema, setVentureSchema] = useState(DEFAULT_VENTURE_FIELDS);
  const [funderSchema, setFunderSchema]   = useState(DEFAULT_FUNDER_FIELDS);
  const [schemasLoading, setSchemasLoading] = useState(true);

  useEffect(() => {
    let resolved = 0;
    const tryDone = () => { resolved++; if (resolved === 2) setSchemasLoading(false); };

    const unsub1 = onSnapshot(
      doc(db, 'formSchemas', 'venture'),
      (snap) => { setVentureSchema(snap.exists() ? (snap.data().fields ?? DEFAULT_VENTURE_FIELDS) : DEFAULT_VENTURE_FIELDS); tryDone(); },
      () => tryDone()
    );
    const unsub2 = onSnapshot(
      doc(db, 'formSchemas', 'funder'),
      (snap) => { setFunderSchema(snap.exists() ? (snap.data().fields ?? DEFAULT_FUNDER_FIELDS) : DEFAULT_FUNDER_FIELDS); tryDone(); },
      () => tryDone()
    );

    return () => { unsub1(); unsub2(); };
  }, []);

  async function saveSchema(role, fields) {
    await setDoc(doc(db, 'formSchemas', role), { fields });
  }

  async function resetSchema(role) {
    const defaults = role === 'venture' ? DEFAULT_VENTURE_FIELDS : DEFAULT_FUNDER_FIELDS;
    await setDoc(doc(db, 'formSchemas', role), { fields: defaults });
  }

  return (
    <FormSchemaContext.Provider value={{ ventureSchema, funderSchema, schemasLoading, saveSchema, resetSchema }}>
      {children}
    </FormSchemaContext.Provider>
  );
}

export function useFormSchema() {
  const ctx = useContext(FormSchemaContext);
  if (!ctx) throw new Error('useFormSchema must be used inside FormSchemaProvider');
  return ctx;
}
