import Papa from 'papaparse';

export function calculateAgencyScore(params) {
  const { pricingControl, supplierNegotiation, profitControl, operationsManagement, digitalSkills } = params;
  const total = pricingControl + supplierNegotiation + profitControl + operationsManagement + digitalSkills;
  const percentage = Math.round((total / 25) * 100);
  let tier;
  if (percentage >= 76) tier = 'High Agency';
  else if (percentage >= 48) tier = 'Moderate Agency';
  else tier = 'Low Agency';
  return { total, percentage, tier };
}

export function getScoreTierColor(percentage) {
  if (percentage >= 76) return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
  if (percentage >= 48) return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' };
  return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
}

export function getScoreTier(percentage) {
  if (percentage >= 76) return 'High Agency';
  if (percentage >= 48) return 'Moderate Agency';
  return 'Low Agency';
}

export function getBarColor(score) {
  if (score >= 4) return 'bg-green-500';
  if (score === 3) return 'bg-amber-400';
  return 'bg-red-400';
}

export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseCSVToEntrepreneurs(csvString) {
  const result = Papa.parse(csvString, { header: true, skipEmptyLines: true });
  const valid = [];
  const errors = [];

  result.data.forEach((row, index) => {
    try {
      if (!row.name || !row.sector) {
        errors.push({ row: index + 1, message: 'Missing required fields: name, sector' });
        return;
      }
      const entrepreneur = {
        id: `uc-upload-${Date.now()}-${index}`,
        name: row.name?.trim() || '',
        age: parseInt(row.age) || 0,
        location: row.location?.trim() || '',
        state: row.state?.trim() || '',
        sector: row.sector?.trim() || '',
        businessName: row.businessName?.trim() || row.business_name?.trim() || '',
        businessType: row.businessType?.trim() || row.business_type?.trim() || '',
        yearsInBusiness: parseInt(row.yearsInBusiness || row.years_in_business) || 0,
        registrationType: row.registrationType?.trim() || row.registration_type?.trim() || 'Informal',
        agencyScore: {
          pricingControl: Math.min(5, Math.max(1, parseInt(row.pricingControl || row.pricing_control) || 1)),
          supplierNegotiation: Math.min(5, Math.max(1, parseInt(row.supplierNegotiation || row.supplier_negotiation) || 1)),
          profitControl: Math.min(5, Math.max(1, parseInt(row.profitControl || row.profit_control) || 1)),
          operationsManagement: Math.min(5, Math.max(1, parseInt(row.operationsManagement || row.operations_management) || 1)),
          digitalSkills: Math.min(5, Math.max(1, parseInt(row.digitalSkills || row.digital_skills) || 1)),
        },
        monthlyRevenue: parseInt(row.monthlyRevenue || row.monthly_revenue) || 0,
        monthlyCosts: parseInt(row.monthlyCosts || row.monthly_costs) || 0,
        monthlyProfit: parseInt(row.monthlyProfit || row.monthly_profit) || 0,
        fundingNeeded: parseInt(row.fundingNeeded || row.funding_needed) || 100000,
        fundingPurpose: row.fundingPurpose?.trim() || row.funding_purpose?.trim() || '',
        currentFundingSources: (row.currentFundingSources || row.funding_sources || '').split(',').map(s => s.trim()).filter(Boolean),
        unitEconomics: {
          productName: row.productName?.trim() || row.product_name?.trim() || '',
          unitPrice: parseInt(row.unitPrice || row.unit_price) || 0,
          unitCost: parseInt(row.unitCost || row.unit_cost) || 0,
          dailyUnits: parseInt(row.dailyUnits || row.daily_units) || 0,
          marginPerUnit: 0,
        },
        growthPlan: {
          shortTerm: row.shortTermPlan?.trim() || row.short_term?.trim() || '',
          mediumTerm: row.mediumTermPlan?.trim() || row.medium_term?.trim() || '',
          longTerm: row.longTermPlan?.trim() || row.long_term?.trim() || '',
        },
        interviewNotes: row.interviewNotes?.trim() || row.interview_notes?.trim() || '',
        challenges: (row.challenges || '').split(',').map(s => s.trim()).filter(Boolean),
        interviewDate: row.interviewDate?.trim() || row.interview_date?.trim() || new Date().toISOString().split('T')[0],
        interviewedBy: row.interviewedBy?.trim() || row.interviewed_by?.trim() || '',
        isShortlisted: false,
        avatarColor: '#E97451',
      };
      entrepreneur.unitEconomics.marginPerUnit = entrepreneur.unitEconomics.unitPrice - entrepreneur.unitEconomics.unitCost;
      const score = calculateAgencyScore(entrepreneur.agencyScore);
      entrepreneur.agencyScore.total = score.total;
      entrepreneur.agencyScore.percentage = score.percentage;
      valid.push(entrepreneur);
    } catch (e) {
      errors.push({ row: index + 1, message: e.message });
    }
  });

  return { valid, errors };
}

export function generateTemplateCSV() {
  const headers = [
    'name', 'age', 'location', 'state', 'sector', 'businessName', 'businessType',
    'yearsInBusiness', 'registrationType', 'pricingControl', 'supplierNegotiation',
    'profitControl', 'operationsManagement', 'digitalSkills', 'monthlyRevenue',
    'monthlyCosts', 'monthlyProfit', 'fundingNeeded', 'fundingPurpose',
    'currentFundingSources', 'productName', 'unitPrice', 'unitCost', 'dailyUnits',
    'shortTermPlan', 'mediumTermPlan', 'longTermPlan', 'interviewNotes',
    'challenges', 'interviewDate', 'interviewedBy',
  ];
  return headers.join(',') + '\n';
}
