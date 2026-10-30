export const AGENCY_PARAMETERS = [
  { key: 'pricingControl', label: 'Pricing Control', description: 'Sets her own prices independently' },
  { key: 'supplierNegotiation', label: 'Supplier Negotiation', description: 'Chooses and negotiates with suppliers' },
  { key: 'profitControl', label: 'Profit Control', description: 'Decides how profits are spent/reinvested' },
  { key: 'operationsManagement', label: 'Operations', description: 'Manages daily business operations' },
  { key: 'digitalSkills', label: 'Digital Skills', description: 'Uses UPI, digital bookkeeping, phones for business' },
];

export const entrepreneurs = [
  {
    "id": "uc-001",
    "name": "Sarita Devi",
    "age": 36,
    "location": "Deoria, UP",
    "state": "Uttar Pradesh",
    "sector": "Dairy & Agri Processing",
    "businessName": "Sarita Dairy",
    "businessType": "Milk collection and paneer making",
    "yearsInBusiness": 7,
    "registrationType": "Udyam",
    "agencyScore": {
      "pricingControl": 5,
      "supplierNegotiation": 4,
      "profitControl": 5,
      "operationsManagement": 5,
      "digitalSkills": 3,
      "total": 22,
      "percentage": 88
    },
    "monthlyRevenue": 62000,
    "monthlyCosts": 38000,
    "monthlyProfit": 24000,
    "fundingNeeded": 120000,
    "fundingPurpose": "Chilling unit and stainless steel vats",
    "currentFundingSources": [
      "SHG loan",
      "Personal savings"
    ],
    "unitEconomics": {
      "productName": "Paneer (1 kg)",
      "unitPrice": 320,
      "unitCost": 240,
      "dailyUnits": 10,
      "marginPerUnit": 80
    },
    "growthPlan": {
      "shortTerm": "Add 20 more household milk suppliers",
      "mediumTerm": "Sell paneer to 5 sweet shops in Deoria town",
      "longTerm": "Set up small packaged-dairy brand"
    },
    "interviewNotes": "Sarita collects milk from 35 households herself, fixes the rate each week and keeps the daily ledger. Her husband works at a brick kiln and is not involved.",
    "challenges": [
      "No cold storage",
      "Delayed payments from sweet shops"
    ],
    "interviewDate": "2026-01-01",
    "interviewedBy": "Ananya Mishra",
    "isShortlisted": true,
    "avatarColor": "#E97451"
  },
  {
    "id": "uc-002",
    "name": "Rukmini Kushwaha",
    "age": 42,
    "location": "Kushinagar, UP",
    "state": "Uttar Pradesh",
    "sector": "Grocery & Kirana",
    "businessName": "Kushwaha General Store",
    "businessType": "Village kirana and grain store",
    "yearsInBusiness": 9,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 2,
      "supplierNegotiation": 2,
      "profitControl": 2,
      "operationsManagement": 3,
      "digitalSkills": 1,
      "total": 10,
      "percentage": 40
    },
    "monthlyRevenue": 38000,
    "monthlyCosts": 31000,
    "monthlyProfit": 7000,
    "fundingNeeded": 150000,
    "fundingPurpose": "Stock expansion and a refrigerator",
    "currentFundingSources": [
      "Husband's savings"
    ],
    "unitEconomics": {
      "productName": "Daily grocery basket",
      "unitPrice": 180,
      "unitCost": 150,
      "dailyUnits": 45,
      "marginPerUnit": 30
    },
    "growthPlan": {
      "shortTerm": "Maintain stock register",
      "mediumTerm": "Learn supplier rates",
      "longTerm": "Open a wholesale counter"
    },
    "interviewNotes": "Rukmini sits at the counter all day, but her husband and elder son pick suppliers, set prices and hold the cash box. The shop is in her name for the loan.",
    "challenges": [
      "Husband controls supplier choice",
      "No digital payments"
    ],
    "interviewDate": "2025-06-08",
    "interviewedBy": "Kavya Tripathi",
    "isShortlisted": false,
    "avatarColor": "#9A3412"
  },
  {
    "id": "uc-003",
    "name": "Asha Maurya",
    "age": 31,
    "location": "Gorakhpur, UP",
    "state": "Uttar Pradesh",
    "sector": "Tailoring & Garments",
    "businessName": "Asha Fashion Point",
    "businessType": "Women's blouse and suit stitching",
    "yearsInBusiness": 6,
    "registrationType": "Udyam",
    "agencyScore": {
      "pricingControl": 5,
      "supplierNegotiation": 4,
      "profitControl": 4,
      "operationsManagement": 5,
      "digitalSkills": 4,
      "total": 22,
      "percentage": 88
    },
    "monthlyRevenue": 54000,
    "monthlyCosts": 26000,
    "monthlyProfit": 28000,
    "fundingNeeded": 90000,
    "fundingPurpose": "Two Usha automatic machines and display mannequin",
    "currentFundingSources": [
      "MUDRA Shishu loan",
      "Personal savings"
    ],
    "unitEconomics": {
      "productName": "Designer blouse",
      "unitPrice": 650,
      "unitCost": 300,
      "dailyUnits": 3,
      "marginPerUnit": 350
    },
    "growthPlan": {
      "shortTerm": "Train two apprentices",
      "mediumTerm": "Start school-uniform orders",
      "longTerm": "Open a boutique near Golghar"
    },
    "interviewNotes": "Asha cuts, stitches and prices every order herself, buys fabric from Gorakhpur wholesale market and takes UPI payments.",
    "challenges": [
      "Festival-season rush",
      "Fabric price swings"
    ],
    "interviewDate": "2025-11-15",
    "interviewedBy": "Riya Pandey",
    "isShortlisted": true,
    "avatarColor": "#F59E0B"
  },
  {
    "id": "uc-004",
    "name": "Kamla Bai",
    "age": 47,
    "location": "Maharajganj, UP",
    "state": "Uttar Pradesh",
    "sector": "Handicrafts & Artisanal",
    "businessName": "Kamla Moonj Crafts",
    "businessType": "Moonj grass basket weaving",
    "yearsInBusiness": 15,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 3,
      "profitControl": 4,
      "operationsManagement": 5,
      "digitalSkills": 1,
      "total": 17,
      "percentage": 68
    },
    "monthlyRevenue": 22000,
    "monthlyCosts": 9000,
    "monthlyProfit": 13000,
    "fundingNeeded": 60000,
    "fundingPurpose": "Dyes, raw grass stock and a stitching machine",
    "currentFundingSources": [
      "SHG savings"
    ],
    "unitEconomics": {
      "productName": "Moonj basket",
      "unitPrice": 280,
      "unitCost": 110,
      "dailyUnits": 4,
      "marginPerUnit": 170
    },
    "growthPlan": {
      "shortTerm": "Form a 6-woman weaving group",
      "mediumTerm": "Sell through two craft fairs a year",
      "longTerm": "Get GI-tag linked buyers"
    },
    "interviewNotes": "Kamla supplies a group of five weavers and negotiates directly with the trader who comes every month. Has never used a smartphone for business.",
    "challenges": [
      "Middleman sets the rate",
      "No digital presence"
    ],
    "interviewDate": "2026-07-22",
    "interviewedBy": "Shreya Upadhyay",
    "isShortlisted": false,
    "avatarColor": "#FB923C"
  },
  {
    "id": "uc-005",
    "name": "Poonam Singh",
    "age": 29,
    "location": "Ballia, UP",
    "state": "Uttar Pradesh",
    "sector": "Beauty & Wellness",
    "businessName": "Poonam Glow Parlour",
    "businessType": "Beauty parlour and bridal makeup",
    "yearsInBusiness": 5,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 4,
      "profitControl": 4,
      "operationsManagement": 5,
      "digitalSkills": 4,
      "total": 21,
      "percentage": 84
    },
    "monthlyRevenue": 33000,
    "monthlyCosts": 15000,
    "monthlyProfit": 18000,
    "fundingNeeded": 70000,
    "fundingPurpose": "Facial chair, steamer and AC",
    "currentFundingSources": [
      "Personal savings",
      "SHG loan"
    ],
    "unitEconomics": {
      "productName": "Bridal package",
      "unitPrice": 3500,
      "unitCost": 900,
      "dailyUnits": 0.5,
      "marginPerUnit": 2600
    },
    "growthPlan": {
      "shortTerm": "Add hair-spa services",
      "mediumTerm": "Hire one assistant",
      "longTerm": "Open a training corner for girls"
    },
    "interviewNotes": "Poonam books through WhatsApp, buys products from a Ballia distributor and reinvests profit into equipment.",
    "challenges": [
      "Limited space",
      "Irregular wedding-season income"
    ],
    "interviewDate": "2025-09-02",
    "interviewedBy": "Neha Gupta",
    "isShortlisted": true,
    "avatarColor": "#C2410C"
  },
  {
    "id": "uc-006",
    "name": "Geeta Rani",
    "age": 38,
    "location": "Sant Kabir Nagar, UP",
    "state": "Uttar Pradesh",
    "sector": "Food & Catering",
    "businessName": "Geeta Sweets and Namkeen",
    "businessType": "Homemade sweets and snacks",
    "yearsInBusiness": 8,
    "registrationType": "Udyam",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 3,
      "profitControl": 4,
      "operationsManagement": 4,
      "digitalSkills": 2,
      "total": 17,
      "percentage": 68
    },
    "monthlyRevenue": 41000,
    "monthlyCosts": 25000,
    "monthlyProfit": 16000,
    "fundingNeeded": 100000,
    "fundingPurpose": "Fryer, packing machine and FSSAI licence",
    "currentFundingSources": [
      "SHG loan"
    ],
    "unitEconomics": {
      "productName": "Namkeen pack (500 g)",
      "unitPrice": 120,
      "unitCost": 75,
      "dailyUnits": 40,
      "marginPerUnit": 45
    },
    "growthPlan": {
      "shortTerm": "Get FSSAI certification",
      "mediumTerm": "Supply 10 village shops",
      "longTerm": "Packaged snack brand for district markets"
    },
    "interviewNotes": "Geeta runs production with two hired women, sets rates after checking Khalilabad market prices and keeps handwritten accounts.",
    "challenges": [
      "Seasonal sales",
      "No packaging unit"
    ],
    "interviewDate": "2025-02-09",
    "interviewedBy": "Pooja Yadav",
    "isShortlisted": false,
    "avatarColor": "#D97706"
  },
  {
    "id": "uc-007",
    "name": "Munni Devi",
    "age": 44,
    "location": "Deoria, UP",
    "state": "Uttar Pradesh",
    "sector": "Grocery & Kirana",
    "businessName": "Munni Provision Store",
    "businessType": "Provision and general store",
    "yearsInBusiness": 6,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 3,
      "supplierNegotiation": 2,
      "profitControl": 3,
      "operationsManagement": 4,
      "digitalSkills": 1,
      "total": 13,
      "percentage": 52
    },
    "monthlyRevenue": 36000,
    "monthlyCosts": 28000,
    "monthlyProfit": 8000,
    "fundingNeeded": 80000,
    "fundingPurpose": "Display racks and inventory",
    "currentFundingSources": [
      "Family loan"
    ],
    "unitEconomics": {
      "productName": "Daily essentials basket",
      "unitPrice": 160,
      "unitCost": 130,
      "dailyUnits": 40,
      "marginPerUnit": 30
    },
    "growthPlan": {
      "shortTerm": "Track daily sales",
      "mediumTerm": "Explore a second supplier",
      "longTerm": "Add a stationery counter"
    },
    "interviewNotes": "Munni opens and runs the shop, but her brother-in-law supplies most stock and decides what to keep. Prices follow the supplier's suggestion.",
    "challenges": [
      "Dependent on one supplier",
      "Credit sales go unpaid"
    ],
    "interviewDate": "2026-04-16",
    "interviewedBy": "Isha Srivastava",
    "isShortlisted": false,
    "avatarColor": "#B45309"
  },
  {
    "id": "uc-008",
    "name": "Sushila Verma",
    "age": 33,
    "location": "Jhansi, UP",
    "state": "Uttar Pradesh",
    "sector": "Tailoring & Garments",
    "businessName": "Sushila Stitch Studio",
    "businessType": "Boutique and alteration services",
    "yearsInBusiness": 5,
    "registrationType": "MSME",
    "agencyScore": {
      "pricingControl": 5,
      "supplierNegotiation": 5,
      "profitControl": 4,
      "operationsManagement": 5,
      "digitalSkills": 5,
      "total": 24,
      "percentage": 96
    },
    "monthlyRevenue": 68000,
    "monthlyCosts": 32000,
    "monthlyProfit": 36000,
    "fundingNeeded": 120000,
    "fundingPurpose": "Overlock and embroidery machines",
    "currentFundingSources": [
      "Bank loan",
      "Personal savings"
    ],
    "unitEconomics": {
      "productName": "Salwar suit",
      "unitPrice": 900,
      "unitCost": 420,
      "dailyUnits": 3,
      "marginPerUnit": 480
    },
    "growthPlan": {
      "shortTerm": "Hire two tailors",
      "mediumTerm": "Tie up with a local boutique",
      "longTerm": "Launch Instagram-led brand"
    },
    "interviewNotes": "Sushila handles design, buying, billing and customer chats, and has a digital ledger on her phone.",
    "challenges": [
      "Skilled labour is hard to retain",
      "Cash-flow gaps"
    ],
    "interviewDate": "2025-12-23",
    "interviewedBy": "Aarti Chauhan",
    "isShortlisted": true,
    "avatarColor": "#EA580C"
  },
  {
    "id": "uc-009",
    "name": "Rajkumari Patel",
    "age": 40,
    "location": "Satna, MP",
    "state": "Madhya Pradesh",
    "sector": "Poultry & Livestock",
    "businessName": "Rajkumari Poultry Farm",
    "businessType": "Backyard layer poultry farm",
    "yearsInBusiness": 4,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 4,
      "profitControl": 4,
      "operationsManagement": 4,
      "digitalSkills": 2,
      "total": 18,
      "percentage": 72
    },
    "monthlyRevenue": 46000,
    "monthlyCosts": 29000,
    "monthlyProfit": 17000,
    "fundingNeeded": 130000,
    "fundingPurpose": "Second shed and feed storage",
    "currentFundingSources": [
      "SHG loan"
    ],
    "unitEconomics": {
      "productName": "Egg tray (30 eggs)",
      "unitPrice": 180,
      "unitCost": 135,
      "dailyUnits": 35,
      "marginPerUnit": 45
    },
    "growthPlan": {
      "shortTerm": "Add 200 more birds",
      "mediumTerm": "Sell directly to hotels",
      "longTerm": "Open an egg-grading stall"
    },
    "interviewNotes": "Rajkumari manages feeding, vaccination and sales and bargains with the feed trader herself.",
    "challenges": [
      "Disease risk",
      "Rising feed costs"
    ],
    "interviewDate": "2025-05-03",
    "interviewedBy": "Simran Kaur",
    "isShortlisted": false,
    "avatarColor": "#E97451"
  },
  {
    "id": "uc-010",
    "name": "Bhuri Bai",
    "age": 52,
    "location": "Mandla, MP",
    "state": "Madhya Pradesh",
    "sector": "Handicrafts & Artisanal",
    "businessName": "Bhuri Gond Art",
    "businessType": "Gond painting and souvenirs",
    "yearsInBusiness": 20,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 3,
      "profitControl": 5,
      "operationsManagement": 5,
      "digitalSkills": 2,
      "total": 19,
      "percentage": 76
    },
    "monthlyRevenue": 28000,
    "monthlyCosts": 10000,
    "monthlyProfit": 18000,
    "fundingNeeded": 50000,
    "fundingPurpose": "Canvas, acrylic colours and a framing kit",
    "currentFundingSources": [
      "Personal savings"
    ],
    "unitEconomics": {
      "productName": "Gond painting (A3)",
      "unitPrice": 1800,
      "unitCost": 450,
      "dailyUnits": 0.7,
      "marginPerUnit": 1350
    },
    "growthPlan": {
      "shortTerm": "Teach 5 young women",
      "mediumTerm": "Sell through emporium",
      "longTerm": "Start online catalogue"
    },
    "interviewNotes": "Bhuri paints every piece, sells at melas and keeps all earnings. Her daughter helps with phone orders.",
    "challenges": [
      "Few buyers outside melas",
      "Limited marketing skills"
    ],
    "interviewDate": "2026-01-10",
    "interviewedBy": "Divya Rathore",
    "isShortlisted": true,
    "avatarColor": "#9A3412"
  },
  {
    "id": "uc-011",
    "name": "Anjana Dubey",
    "age": 27,
    "location": "Rewa, MP",
    "state": "Madhya Pradesh",
    "sector": "Tutoring & Education",
    "businessName": "Anjana Learning Centre",
    "businessType": "After-school coaching centre",
    "yearsInBusiness": 3,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 5,
      "supplierNegotiation": 4,
      "profitControl": 5,
      "operationsManagement": 5,
      "digitalSkills": 5,
      "total": 24,
      "percentage": 96
    },
    "monthlyRevenue": 30000,
    "monthlyCosts": 9000,
    "monthlyProfit": 21000,
    "fundingNeeded": 60000,
    "fundingPurpose": "Smart board and benches",
    "currentFundingSources": [
      "Personal savings"
    ],
    "unitEconomics": {
      "productName": "Monthly tuition seat",
      "unitPrice": 700,
      "unitCost": 150,
      "dailyUnits": 40,
      "marginPerUnit": 550
    },
    "growthPlan": {
      "shortTerm": "Reach 60 students",
      "mediumTerm": "Add spoken English batch",
      "longTerm": "Open second centre"
    },
    "interviewNotes": "Anjana sets fees, schedules and handles parents herself, using WhatsApp groups and UPI.",
    "challenges": [
      "Rented room is small",
      "Competition from coaching chains"
    ],
    "interviewDate": "2025-03-17",
    "interviewedBy": "Meera Nair",
    "isShortlisted": true,
    "avatarColor": "#F59E0B"
  },
  {
    "id": "uc-012",
    "name": "Lalita Sahu",
    "age": 39,
    "location": "Bilaspur, CG",
    "state": "Chhattisgarh",
    "sector": "Food & Catering",
    "businessName": "Lalita Mess",
    "businessType": "Tiffin and mess service",
    "yearsInBusiness": 6,
    "registrationType": "Udyam",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 4,
      "profitControl": 4,
      "operationsManagement": 4,
      "digitalSkills": 3,
      "total": 19,
      "percentage": 76
    },
    "monthlyRevenue": 52000,
    "monthlyCosts": 32000,
    "monthlyProfit": 20000,
    "fundingNeeded": 110000,
    "fundingPurpose": "Gas range and cold storage",
    "currentFundingSources": [
      "SHG loan",
      "Personal savings"
    ],
    "unitEconomics": {
      "productName": "Meal plate",
      "unitPrice": 70,
      "unitCost": 45,
      "dailyUnits": 30,
      "marginPerUnit": 25
    },
    "growthPlan": {
      "shortTerm": "Add 20 tiffins",
      "mediumTerm": "Serve a hostel contract",
      "longTerm": "Open a small dine-in counter"
    },
    "interviewNotes": "Lalita plans menus, buys vegetables and manages two workers herself.",
    "challenges": [
      "Rising LPG cost",
      "Staff turnover"
    ],
    "interviewDate": "2025-08-24",
    "interviewedBy": "Tanvi Joshi",
    "isShortlisted": true,
    "avatarColor": "#FB923C"
  },
  {
    "id": "uc-013",
    "name": "Dulari Netam",
    "age": 35,
    "location": "Kanker, CG",
    "state": "Chhattisgarh",
    "sector": "Dairy & Agri Processing",
    "businessName": "Dulari Agro Products",
    "businessType": "Mahua and forest produce processing",
    "yearsInBusiness": 5,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 3,
      "supplierNegotiation": 3,
      "profitControl": 4,
      "operationsManagement": 4,
      "digitalSkills": 1,
      "total": 15,
      "percentage": 60
    },
    "monthlyRevenue": 26000,
    "monthlyCosts": 12000,
    "monthlyProfit": 14000,
    "fundingNeeded": 90000,
    "fundingPurpose": "Drying racks and grinder",
    "currentFundingSources": [
      "SHG loan"
    ],
    "unitEconomics": {
      "productName": "Processed mahua (1 kg)",
      "unitPrice": 150,
      "unitCost": 95,
      "dailyUnits": 6,
      "marginPerUnit": 55
    },
    "growthPlan": {
      "shortTerm": "Improve drying quality",
      "mediumTerm": "Sell to a cooperative",
      "longTerm": "Get FPO registration"
    },
    "interviewNotes": "Dulari collects and processes produce with her SHG group and agrees rates with the cooperative buyer.",
    "challenges": [
      "Price controlled by buyer",
      "No storage space"
    ],
    "interviewDate": "2026-07-04",
    "interviewedBy": "Rohan Verma",
    "isShortlisted": false,
    "avatarColor": "#C2410C"
  },
  {
    "id": "uc-014",
    "name": "Pushpa Thakur",
    "age": 45,
    "location": "Sagar, MP",
    "state": "Madhya Pradesh",
    "sector": "Grocery & Kirana",
    "businessName": "Pushpa General Store",
    "businessType": "General store near bus stand",
    "yearsInBusiness": 10,
    "registrationType": "MSME",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 4,
      "profitControl": 4,
      "operationsManagement": 5,
      "digitalSkills": 3,
      "total": 20,
      "percentage": 80
    },
    "monthlyRevenue": 64000,
    "monthlyCosts": 48000,
    "monthlyProfit": 16000,
    "fundingNeeded": 140000,
    "fundingPurpose": "Cold drinks fridge and billing software",
    "currentFundingSources": [
      "Bank loan"
    ],
    "unitEconomics": {
      "productName": "Daily grocery basket",
      "unitPrice": 200,
      "unitCost": 165,
      "dailyUnits": 60,
      "marginPerUnit": 35
    },
    "growthPlan": {
      "shortTerm": "Introduce UPI billing",
      "mediumTerm": "Add dairy section",
      "longTerm": "Open second shop"
    },
    "interviewNotes": "Pushpa runs the store and chooses wholesalers herself while her husband works in a government office.",
    "challenges": [
      "Thin margins",
      "Local competition"
    ],
    "interviewDate": "2025-06-11",
    "interviewedBy": "Karan Tiwari",
    "isShortlisted": true,
    "avatarColor": "#D97706"
  },
  {
    "id": "uc-015",
    "name": "Roshni Khan",
    "age": 30,
    "location": "Bhopal, MP",
    "state": "Madhya Pradesh",
    "sector": "Tailoring & Garments",
    "businessName": "Roshni Boutique",
    "businessType": "Ladies boutique and zari work",
    "yearsInBusiness": 7,
    "registrationType": "Udyam",
    "agencyScore": {
      "pricingControl": 5,
      "supplierNegotiation": 4,
      "profitControl": 5,
      "operationsManagement": 5,
      "digitalSkills": 4,
      "total": 23,
      "percentage": 92
    },
    "monthlyRevenue": 59000,
    "monthlyCosts": 28000,
    "monthlyProfit": 31000,
    "fundingNeeded": 100000,
    "fundingPurpose": "Zari work frames and sewing machines",
    "currentFundingSources": [
      "MUDRA loan",
      "Savings"
    ],
    "unitEconomics": {
      "productName": "Bridal lehenga alteration",
      "unitPrice": 1500,
      "unitCost": 500,
      "dailyUnits": 2,
      "marginPerUnit": 1000
    },
    "growthPlan": {
      "shortTerm": "Add two zari artisans",
      "mediumTerm": "Sell through Instagram",
      "longTerm": "Start a bridal line"
    },
    "interviewNotes": "Roshni controls designs, pricing and suppliers and takes advance payments by UPI.",
    "challenges": [
      "Wedding-season peaks",
      "Space for storage"
    ],
    "interviewDate": "2025-11-18",
    "interviewedBy": "Aman Dubey",
    "isShortlisted": true,
    "avatarColor": "#B45309"
  },
  {
    "id": "uc-016",
    "name": "Kiran Lodhi",
    "age": 37,
    "location": "Damoh, MP",
    "state": "Madhya Pradesh",
    "sector": "Beauty & Wellness",
    "businessName": "Kiran Beauty Care",
    "businessType": "Salon and mehendi services",
    "yearsInBusiness": 6,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 3,
      "profitControl": 4,
      "operationsManagement": 4,
      "digitalSkills": 3,
      "total": 18,
      "percentage": 72
    },
    "monthlyRevenue": 29000,
    "monthlyCosts": 13000,
    "monthlyProfit": 16000,
    "fundingNeeded": 60000,
    "fundingPurpose": "Salon chair and hair dryers",
    "currentFundingSources": [
      "Personal savings"
    ],
    "unitEconomics": {
      "productName": "Mehendi (bridal)",
      "unitPrice": 1200,
      "unitCost": 200,
      "dailyUnits": 1,
      "marginPerUnit": 1000
    },
    "growthPlan": {
      "shortTerm": "Add hair services",
      "mediumTerm": "Hire an assistant",
      "longTerm": "Open a training batch"
    },
    "interviewNotes": "Kiran sets rates, buys products from Damoh market, and her sister helps at the shop.",
    "challenges": [
      "Rented premises",
      "No formal certificate"
    ],
    "interviewDate": "2026-04-25",
    "interviewedBy": "Harsh Vardhan",
    "isShortlisted": false,
    "avatarColor": "#EA580C"
  },
  {
    "id": "uc-017",
    "name": "Savita Nishad",
    "age": 32,
    "location": "Gorakhpur, UP",
    "state": "Uttar Pradesh",
    "sector": "Food & Catering",
    "businessName": "Savita Pickles",
    "businessType": "Homemade achaar and papad",
    "yearsInBusiness": 5,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 4,
      "profitControl": 4,
      "operationsManagement": 4,
      "digitalSkills": 2,
      "total": 18,
      "percentage": 72
    },
    "monthlyRevenue": 24000,
    "monthlyCosts": 13000,
    "monthlyProfit": 11000,
    "fundingNeeded": 70000,
    "fundingPurpose": "Jars, labels and FSSAI licence",
    "currentFundingSources": [
      "SHG loan"
    ],
    "unitEconomics": {
      "productName": "Pickle jar (500 g)",
      "unitPrice": 180,
      "unitCost": 100,
      "dailyUnits": 12,
      "marginPerUnit": 80
    },
    "growthPlan": {
      "shortTerm": "Register under FSSAI",
      "mediumTerm": "List on a marketplace",
      "longTerm": "Supply to city stores"
    },
    "interviewNotes": "Savita buys raw mango and oil herself and sells through a WhatsApp customer list.",
    "challenges": [
      "Packaging cost",
      "Shelf-life concerns"
    ],
    "interviewDate": "2025-09-05",
    "interviewedBy": "Sneha Patel",
    "isShortlisted": false,
    "avatarColor": "#E97451"
  },
  {
    "id": "uc-018",
    "name": "Mamta Pal",
    "age": 40,
    "location": "Deoria, UP",
    "state": "Uttar Pradesh",
    "sector": "Mobile Repair & Electronics",
    "businessName": "Mamta Mobile Care",
    "businessType": "Mobile accessories and repair",
    "yearsInBusiness": 3,
    "registrationType": "Udyam",
    "agencyScore": {
      "pricingControl": 3,
      "supplierNegotiation": 3,
      "profitControl": 3,
      "operationsManagement": 3,
      "digitalSkills": 4,
      "total": 16,
      "percentage": 64
    },
    "monthlyRevenue": 42000,
    "monthlyCosts": 30000,
    "monthlyProfit": 12000,
    "fundingNeeded": 90000,
    "fundingPurpose": "Repair tools and accessories stock",
    "currentFundingSources": [
      "Son's savings",
      "Personal savings"
    ],
    "unitEconomics": {
      "productName": "Screen replacement",
      "unitPrice": 700,
      "unitCost": 380,
      "dailyUnits": 2,
      "marginPerUnit": 320
    },
    "growthPlan": {
      "shortTerm": "Learn repair skills herself",
      "mediumTerm": "Reduce dependence on technician",
      "longTerm": "Add laptop servicing"
    },
    "interviewNotes": "Mamta handles the counter and billing, while a male technician and her son decide parts purchases.",
    "challenges": [
      "Relies on a hired technician",
      "Fast-changing models"
    ],
    "interviewDate": "2025-02-12",
    "interviewedBy": "Nisha Kumari",
    "isShortlisted": false,
    "avatarColor": "#9A3412"
  },
  {
    "id": "uc-019",
    "name": "Sunaina Rawat",
    "age": 26,
    "location": "Doiwala, Dehradun",
    "state": "Uttarakhand",
    "sector": "Handicrafts & Artisanal",
    "businessName": "Sunaina Ringal Crafts",
    "businessType": "Ringal bamboo craft",
    "yearsInBusiness": 4,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 4,
      "profitControl": 4,
      "operationsManagement": 4,
      "digitalSkills": 4,
      "total": 20,
      "percentage": 80
    },
    "monthlyRevenue": 27000,
    "monthlyCosts": 11000,
    "monthlyProfit": 16000,
    "fundingNeeded": 65000,
    "fundingPurpose": "Bamboo stock and finishing tools",
    "currentFundingSources": [
      "Personal savings",
      "SHG loan"
    ],
    "unitEconomics": {
      "productName": "Ringal basket",
      "unitPrice": 350,
      "unitCost": 140,
      "dailyUnits": 4,
      "marginPerUnit": 210
    },
    "growthPlan": {
      "shortTerm": "Train 3 women",
      "mediumTerm": "Sell to tourist shops",
      "longTerm": "Create an online store"
    },
    "interviewNotes": "Sunaina designs products, quotes prices and sells through Instagram and local shops.",
    "challenges": [
      "Seasonal tourism",
      "Raw material access"
    ],
    "interviewDate": "2026-01-19",
    "interviewedBy": "Vikram Singh",
    "isShortlisted": true,
    "avatarColor": "#F59E0B"
  },
  {
    "id": "uc-020",
    "name": "Chandni Bhatt",
    "age": 34,
    "location": "Haldwani, Uttarakhand",
    "state": "Uttarakhand",
    "sector": "Food & Catering",
    "businessName": "Chandni Kitchen",
    "businessType": "Cloud kitchen and tiffin",
    "yearsInBusiness": 4,
    "registrationType": "Udyam",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 4,
      "profitControl": 5,
      "operationsManagement": 4,
      "digitalSkills": 4,
      "total": 21,
      "percentage": 84
    },
    "monthlyRevenue": 55000,
    "monthlyCosts": 33000,
    "monthlyProfit": 22000,
    "fundingNeeded": 120000,
    "fundingPurpose": "Commercial oven and refrigerator",
    "currentFundingSources": [
      "Personal savings",
      "Bank loan"
    ],
    "unitEconomics": {
      "productName": "Meal box",
      "unitPrice": 90,
      "unitCost": 55,
      "dailyUnits": 25,
      "marginPerUnit": 35
    },
    "growthPlan": {
      "shortTerm": "Add 20 daily orders",
      "mediumTerm": "Tie up with 2 offices",
      "longTerm": "Open a pickup counter"
    },
    "interviewNotes": "Chandni runs menu, purchases and pricing, and uses delivery apps along with her own customer list.",
    "challenges": [
      "Delivery costs",
      "Single-person production"
    ],
    "interviewDate": "2025-12-26",
    "interviewedBy": "Aditi Sharma",
    "isShortlisted": true,
    "avatarColor": "#FB923C"
  },
  {
    "id": "uc-021",
    "name": "Phoolmati Devi",
    "age": 48,
    "location": "Gaya, Bihar",
    "state": "Bihar",
    "sector": "Handicrafts & Artisanal",
    "businessName": "Phoolmati Sujni Art",
    "businessType": "Sujni embroidery",
    "yearsInBusiness": 18,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 3,
      "supplierNegotiation": 3,
      "profitControl": 4,
      "operationsManagement": 4,
      "digitalSkills": 1,
      "total": 15,
      "percentage": 60
    },
    "monthlyRevenue": 19000,
    "monthlyCosts": 8000,
    "monthlyProfit": 11000,
    "fundingNeeded": 45000,
    "fundingPurpose": "Cloth stock and design frames",
    "currentFundingSources": [
      "SHG savings"
    ],
    "unitEconomics": {
      "productName": "Sujni wall hanging",
      "unitPrice": 900,
      "unitCost": 380,
      "dailyUnits": 1,
      "marginPerUnit": 520
    },
    "growthPlan": {
      "shortTerm": "Teach 4 women",
      "mediumTerm": "Link with a craft cooperative",
      "longTerm": "Sell online"
    },
    "interviewNotes": "Phoolmati embroiders with four women but her son handles customers and cash from city buyers.",
    "challenges": [
      "Son controls sales",
      "Limited market access"
    ],
    "interviewDate": "2025-05-06",
    "interviewedBy": "Prerna Agarwal",
    "isShortlisted": false,
    "avatarColor": "#C2410C"
  },
  {
    "id": "uc-022",
    "name": "Ranju Kumari",
    "age": 29,
    "location": "Muzaffarpur, Bihar",
    "state": "Bihar",
    "sector": "Beauty & Wellness",
    "businessName": "Ranju Beauty Studio",
    "businessType": "Salon and skin care",
    "yearsInBusiness": 4,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 4,
      "profitControl": 4,
      "operationsManagement": 4,
      "digitalSkills": 4,
      "total": 20,
      "percentage": 80
    },
    "monthlyRevenue": 31000,
    "monthlyCosts": 14000,
    "monthlyProfit": 17000,
    "fundingNeeded": 65000,
    "fundingPurpose": "Salon chair and skin analyser",
    "currentFundingSources": [
      "SHG loan"
    ],
    "unitEconomics": {
      "productName": "Facial",
      "unitPrice": 500,
      "unitCost": 120,
      "dailyUnits": 5,
      "marginPerUnit": 380
    },
    "growthPlan": {
      "shortTerm": "Add skincare packs",
      "mediumTerm": "Hire an assistant",
      "longTerm": "Open a training batch"
    },
    "interviewNotes": "Ranju decides rates, buys products from a Muzaffarpur distributor and uses UPI.",
    "challenges": [
      "Power cuts",
      "Rented premises"
    ],
    "interviewDate": "2026-07-13",
    "interviewedBy": "Yash Mehta",
    "isShortlisted": true,
    "avatarColor": "#D97706"
  },
  {
    "id": "uc-023",
    "name": "Laxmi Mahto",
    "age": 41,
    "location": "Hazaribagh, Jharkhand",
    "state": "Jharkhand",
    "sector": "Dairy & Agri Processing",
    "businessName": "Laxmi Dairy Farm",
    "businessType": "Cow dairy and ghee",
    "yearsInBusiness": 8,
    "registrationType": "Udyam",
    "agencyScore": {
      "pricingControl": 5,
      "supplierNegotiation": 4,
      "profitControl": 4,
      "operationsManagement": 5,
      "digitalSkills": 3,
      "total": 21,
      "percentage": 84
    },
    "monthlyRevenue": 58000,
    "monthlyCosts": 34000,
    "monthlyProfit": 24000,
    "fundingNeeded": 110000,
    "fundingPurpose": "Milking machine and ghee unit",
    "currentFundingSources": [
      "SHG loan",
      "Personal savings"
    ],
    "unitEconomics": {
      "productName": "Ghee (1 kg)",
      "unitPrice": 650,
      "unitCost": 470,
      "dailyUnits": 6,
      "marginPerUnit": 180
    },
    "growthPlan": {
      "shortTerm": "Add four cows",
      "mediumTerm": "Sell ghee under own label",
      "longTerm": "Open a retail counter"
    },
    "interviewNotes": "Laxmi manages cattle, milk sales and accounts and negotiates directly with the dairy collection centre.",
    "challenges": [
      "Fodder cost",
      "Cattle health"
    ],
    "interviewDate": "2025-03-20",
    "interviewedBy": "Saloni Jain",
    "isShortlisted": true,
    "avatarColor": "#B45309"
  },
  {
    "id": "uc-024",
    "name": "Savitri Munda",
    "age": 44,
    "location": "Khunti, Jharkhand",
    "state": "Jharkhand",
    "sector": "Handicrafts & Artisanal",
    "businessName": "Savitri Tussar Weaves",
    "businessType": "Tussar silk weaving",
    "yearsInBusiness": 14,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 3,
      "profitControl": 4,
      "operationsManagement": 5,
      "digitalSkills": 2,
      "total": 18,
      "percentage": 72
    },
    "monthlyRevenue": 34000,
    "monthlyCosts": 15000,
    "monthlyProfit": 19000,
    "fundingNeeded": 75000,
    "fundingPurpose": "Handloom and yarn stock",
    "currentFundingSources": [
      "SHG loan"
    ],
    "unitEconomics": {
      "productName": "Tussar saree",
      "unitPrice": 3200,
      "unitCost": 1900,
      "dailyUnits": 0.4,
      "marginPerUnit": 1300
    },
    "growthPlan": {
      "shortTerm": "Add one loom",
      "mediumTerm": "Sell at exhibitions",
      "longTerm": "Create website"
    },
    "interviewNotes": "Savitri weaves and buys yarn from the cluster. Her daughter helps with phone sales.",
    "challenges": [
      "Yarn price",
      "Slow exhibition payments"
    ],
    "interviewDate": "2025-08-27",
    "interviewedBy": "Ananya Mishra",
    "isShortlisted": false,
    "avatarColor": "#EA580C"
  },
  {
    "id": "uc-025",
    "name": "Madhuri Joshi",
    "age": 31,
    "location": "Raipur, CG",
    "state": "Chhattisgarh",
    "sector": "Tutoring & Education",
    "businessName": "Madhuri Study Hub",
    "businessType": "Coaching for classes 6-10",
    "yearsInBusiness": 4,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 5,
      "supplierNegotiation": 4,
      "profitControl": 5,
      "operationsManagement": 5,
      "digitalSkills": 5,
      "total": 24,
      "percentage": 96
    },
    "monthlyRevenue": 36000,
    "monthlyCosts": 11000,
    "monthlyProfit": 25000,
    "fundingNeeded": 80000,
    "fundingPurpose": "Projector and furniture",
    "currentFundingSources": [
      "Personal savings"
    ],
    "unitEconomics": {
      "productName": "Monthly seat",
      "unitPrice": 800,
      "unitCost": 160,
      "dailyUnits": 45,
      "marginPerUnit": 640
    },
    "growthPlan": {
      "shortTerm": "Add more batches",
      "mediumTerm": "Online doubt-solving",
      "longTerm": "Open another centre"
    },
    "interviewNotes": "Madhuri sets fees and timetable, manages parent communication and collects payments by UPI.",
    "challenges": [
      "Rent",
      "Competition"
    ],
    "interviewDate": "2026-04-07",
    "interviewedBy": "Kavya Tripathi",
    "isShortlisted": true,
    "avatarColor": "#E97451"
  },
  {
    "id": "uc-026",
    "name": "Kavita Sahu",
    "age": 36,
    "location": "Korba, CG",
    "state": "Chhattisgarh",
    "sector": "Grocery & Kirana",
    "businessName": "Kavita Super Mart",
    "businessType": "Neighbourhood grocery store",
    "yearsInBusiness": 7,
    "registrationType": "MSME",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 4,
      "profitControl": 4,
      "operationsManagement": 4,
      "digitalSkills": 3,
      "total": 19,
      "percentage": 76
    },
    "monthlyRevenue": 72000,
    "monthlyCosts": 55000,
    "monthlyProfit": 17000,
    "fundingNeeded": 150000,
    "fundingPurpose": "Chiller and inventory",
    "currentFundingSources": [
      "Bank loan"
    ],
    "unitEconomics": {
      "productName": "Grocery basket",
      "unitPrice": 210,
      "unitCost": 170,
      "dailyUnits": 70,
      "marginPerUnit": 40
    },
    "growthPlan": {
      "shortTerm": "Add self-service shelves",
      "mediumTerm": "Introduce home delivery",
      "longTerm": "Open second outlet"
    },
    "interviewNotes": "Kavita buys from wholesalers on her own and manages one employee.",
    "challenges": [
      "Thin margins",
      "Supermarket competition"
    ],
    "interviewDate": "2025-06-14",
    "interviewedBy": "Riya Pandey",
    "isShortlisted": true,
    "avatarColor": "#9A3412"
  },
  {
    "id": "uc-027",
    "name": "Neelam Shukla",
    "age": 35,
    "location": "Kanpur Dehat, UP",
    "state": "Uttar Pradesh",
    "sector": "Tailoring & Garments",
    "businessName": "Neelam Tailors",
    "businessType": "School uniform stitching",
    "yearsInBusiness": 9,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 2,
      "supplierNegotiation": 3,
      "profitControl": 2,
      "operationsManagement": 4,
      "digitalSkills": 2,
      "total": 13,
      "percentage": 52
    },
    "monthlyRevenue": 34000,
    "monthlyCosts": 24000,
    "monthlyProfit": 10000,
    "fundingNeeded": 70000,
    "fundingPurpose": "Machines and fabric stock",
    "currentFundingSources": [
      "Husband's savings"
    ],
    "unitEconomics": {
      "productName": "School uniform set",
      "unitPrice": 550,
      "unitCost": 380,
      "dailyUnits": 3,
      "marginPerUnit": 170
    },
    "growthPlan": {
      "shortTerm": "Learn pricing",
      "mediumTerm": "Hire two workers",
      "longTerm": "Register as MSME"
    },
    "interviewNotes": "Neelam stitches all orders, but her husband negotiates with schools and keeps the revenue.",
    "challenges": [
      "Husband controls contracts",
      "No bank account of her own"
    ],
    "interviewDate": "2025-11-21",
    "interviewedBy": "Shreya Upadhyay",
    "isShortlisted": false,
    "avatarColor": "#F59E0B"
  },
  {
    "id": "uc-028",
    "name": "Rita Mahato",
    "age": 33,
    "location": "Dhanbad, Jharkhand",
    "state": "Jharkhand",
    "sector": "Food & Catering",
    "businessName": "Rita Tiffin Service",
    "businessType": "Tiffin for workers",
    "yearsInBusiness": 5,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 4,
      "profitControl": 4,
      "operationsManagement": 4,
      "digitalSkills": 2,
      "total": 18,
      "percentage": 72
    },
    "monthlyRevenue": 43000,
    "monthlyCosts": 27000,
    "monthlyProfit": 16000,
    "fundingNeeded": 85000,
    "fundingPurpose": "Larger cooking vessels and delivery bike",
    "currentFundingSources": [
      "SHG loan"
    ],
    "unitEconomics": {
      "productName": "Tiffin",
      "unitPrice": 60,
      "unitCost": 38,
      "dailyUnits": 45,
      "marginPerUnit": 22
    },
    "growthPlan": {
      "shortTerm": "Add 20 tiffins",
      "mediumTerm": "Serve a PG hostel",
      "longTerm": "Open a mess"
    },
    "interviewNotes": "Rita decides menus, buys vegetables and manages pricing; her husband delivers occasionally.",
    "challenges": [
      "Delivery time",
      "Cooking space"
    ],
    "interviewDate": "2026-01-01",
    "interviewedBy": "Neha Gupta",
    "isShortlisted": false,
    "avatarColor": "#FB923C"
  },
  {
    "id": "uc-029",
    "name": "Seema Chauhan",
    "age": 28,
    "location": "Bareilly, UP",
    "state": "Uttar Pradesh",
    "sector": "Mobile Repair & Electronics",
    "businessName": "Seema Digital Point",
    "businessType": "CSC centre and mobile accessories",
    "yearsInBusiness": 3,
    "registrationType": "Udyam",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 4,
      "profitControl": 4,
      "operationsManagement": 4,
      "digitalSkills": 5,
      "total": 21,
      "percentage": 84
    },
    "monthlyRevenue": 47000,
    "monthlyCosts": 24000,
    "monthlyProfit": 23000,
    "fundingNeeded": 100000,
    "fundingPurpose": "Printer, laptop and counter fittings",
    "currentFundingSources": [
      "Personal savings",
      "MUDRA loan"
    ],
    "unitEconomics": {
      "productName": "Document service",
      "unitPrice": 90,
      "unitCost": 25,
      "dailyUnits": 30,
      "marginPerUnit": 65
    },
    "growthPlan": {
      "shortTerm": "Add banking services",
      "mediumTerm": "Offer app training",
      "longTerm": "Open second CSC"
    },
    "interviewNotes": "Seema runs services, buys accessories and handles customers on her own.",
    "challenges": [
      "Server downtime",
      "Competition"
    ],
    "interviewDate": "2025-09-08",
    "interviewedBy": "Pooja Yadav",
    "isShortlisted": true,
    "avatarColor": "#C2410C"
  },
  {
    "id": "uc-030",
    "name": "Usha Gond",
    "age": 46,
    "location": "Balaghat, MP",
    "state": "Madhya Pradesh",
    "sector": "Dairy & Agri Processing",
    "businessName": "Usha Agro Foods",
    "businessType": "Millet flour and papad making",
    "yearsInBusiness": 6,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 3,
      "profitControl": 4,
      "operationsManagement": 4,
      "digitalSkills": 1,
      "total": 16,
      "percentage": 64
    },
    "monthlyRevenue": 23000,
    "monthlyCosts": 11000,
    "monthlyProfit": 12000,
    "fundingNeeded": 60000,
    "fundingPurpose": "Flour mill and packing sealer",
    "currentFundingSources": [
      "SHG loan"
    ],
    "unitEconomics": {
      "productName": "Millet flour (1 kg)",
      "unitPrice": 60,
      "unitCost": 38,
      "dailyUnits": 40,
      "marginPerUnit": 22
    },
    "growthPlan": {
      "shortTerm": "Introduce packing",
      "mediumTerm": "Sell in weekly haats",
      "longTerm": "Get FSSAI licence"
    },
    "interviewNotes": "Usha makes products with five SHG members and negotiates directly with haat buyers.",
    "challenges": [
      "No packaging",
      "Limited reach"
    ],
    "interviewDate": "2025-02-15",
    "interviewedBy": "Isha Srivastava",
    "isShortlisted": false,
    "avatarColor": "#D97706"
  },
  {
    "id": "uc-031",
    "name": "Babita Rajput",
    "age": 38,
    "location": "Chhatarpur, MP",
    "state": "Madhya Pradesh",
    "sector": "Beauty & Wellness",
    "businessName": "Babita Beauty Zone",
    "businessType": "Beauty salon",
    "yearsInBusiness": 7,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 3,
      "supplierNegotiation": 3,
      "profitControl": 3,
      "operationsManagement": 4,
      "digitalSkills": 2,
      "total": 15,
      "percentage": 60
    },
    "monthlyRevenue": 28000,
    "monthlyCosts": 15000,
    "monthlyProfit": 13000,
    "fundingNeeded": 60000,
    "fundingPurpose": "AC and reclining chair",
    "currentFundingSources": [
      "Husband's savings"
    ],
    "unitEconomics": {
      "productName": "Bridal makeup",
      "unitPrice": 2800,
      "unitCost": 800,
      "dailyUnits": 0.5,
      "marginPerUnit": 2000
    },
    "growthPlan": {
      "shortTerm": "Learn digital payments",
      "mediumTerm": "Hire a trainee",
      "longTerm": "Open second branch"
    },
    "interviewNotes": "Babita works at the salon daily but her husband buys the products and keeps the earnings.",
    "challenges": [
      "Husband controls cash",
      "No separate account"
    ],
    "interviewDate": "2026-07-22",
    "interviewedBy": "Aarti Chauhan",
    "isShortlisted": false,
    "avatarColor": "#B45309"
  },
  {
    "id": "uc-032",
    "name": "Anita Pandey",
    "age": 33,
    "location": "Varanasi, UP",
    "state": "Uttar Pradesh",
    "sector": "Handicrafts & Artisanal",
    "businessName": "Anita Banarasi Weaves",
    "businessType": "Banarasi silk accessories",
    "yearsInBusiness": 6,
    "registrationType": "MSME",
    "agencyScore": {
      "pricingControl": 4,
      "supplierNegotiation": 4,
      "profitControl": 4,
      "operationsManagement": 5,
      "digitalSkills": 4,
      "total": 21,
      "percentage": 84
    },
    "monthlyRevenue": 49000,
    "monthlyCosts": 25000,
    "monthlyProfit": 24000,
    "fundingNeeded": 100000,
    "fundingPurpose": "Handloom and design software",
    "currentFundingSources": [
      "MUDRA loan",
      "Personal savings"
    ],
    "unitEconomics": {
      "productName": "Silk dupatta",
      "unitPrice": 1400,
      "unitCost": 700,
      "dailyUnits": 1.5,
      "marginPerUnit": 700
    },
    "growthPlan": {
      "shortTerm": "Add two weavers",
      "mediumTerm": "List on e-commerce platform",
      "longTerm": "Launch own label"
    },
    "interviewNotes": "Anita designs, buys silk from the cluster and handles online orders.",
    "challenges": [
      "Silk price rise",
      "Digital marketing skills"
    ],
    "interviewDate": "2025-12-02",
    "interviewedBy": "Simran Kaur",
    "isShortlisted": true,
    "avatarColor": "#EA580C"
  },
  {
    "id": "uc-033",
    "name": "Parvati Meena",
    "age": 43,
    "location": "Kota, Rajasthan",
    "state": "Rajasthan",
    "sector": "Food & Catering",
    "businessName": "Parvati Home Foods",
    "businessType": "Home-made snacks and sweets",
    "yearsInBusiness": 8,
    "registrationType": "Udyam",
    "agencyScore": {
      "pricingControl": 5,
      "supplierNegotiation": 4,
      "profitControl": 5,
      "operationsManagement": 4,
      "digitalSkills": 3,
      "total": 21,
      "percentage": 84
    },
    "monthlyRevenue": 57000,
    "monthlyCosts": 34000,
    "monthlyProfit": 23000,
    "fundingNeeded": 110000,
    "fundingPurpose": "Automatic fryer and packing machine",
    "currentFundingSources": [
      "Bank loan",
      "SHG loan"
    ],
    "unitEconomics": {
      "productName": "Snack pack",
      "unitPrice": 100,
      "unitCost": 62,
      "dailyUnits": 50,
      "marginPerUnit": 38
    },
    "growthPlan": {
      "shortTerm": "Reach 60 packs a day",
      "mediumTerm": "Sell via local stores",
      "longTerm": "Set up retail outlet"
    },
    "interviewNotes": "Parvati manages production, vendor negotiations and pricing and her husband works away from the business.",
    "challenges": [
      "Seasonal demand",
      "Packaging cost"
    ],
    "interviewDate": "2025-05-09",
    "interviewedBy": "Divya Rathore",
    "isShortlisted": true,
    "avatarColor": "#E97451"
  },
  {
    "id": "uc-034",
    "name": "Reena Prajapati",
    "age": 30,
    "location": "Jabalpur, MP",
    "state": "Madhya Pradesh",
    "sector": "Poultry & Livestock",
    "businessName": "Reena Goat Farm",
    "businessType": "Goat rearing and sales",
    "yearsInBusiness": 3,
    "registrationType": "Informal",
    "agencyScore": {
      "pricingControl": 3,
      "supplierNegotiation": 3,
      "profitControl": 3,
      "operationsManagement": 4,
      "digitalSkills": 2,
      "total": 15,
      "percentage": 60
    },
    "monthlyRevenue": 31000,
    "monthlyCosts": 18000,
    "monthlyProfit": 13000,
    "fundingNeeded": 90000,
    "fundingPurpose": "Shed expansion and 10 goats",
    "currentFundingSources": [
      "SHG loan"
    ],
    "unitEconomics": {
      "productName": "Goat (live)",
      "unitPrice": 9000,
      "unitCost": 6500,
      "dailyUnits": 0.4,
      "marginPerUnit": 2500
    },
    "growthPlan": {
      "shortTerm": "Add 10 goats",
      "mediumTerm": "Sell during Eid season",
      "longTerm": "Start breeding unit"
    },
    "interviewNotes": "Reena manages feed and care, but her father-in-law negotiates with buyers.",
    "challenges": [
      "Buyer dependence",
      "Veterinary access"
    ],
    "interviewDate": "2026-04-16",
    "interviewedBy": "Meera Nair",
    "isShortlisted": false,
    "avatarColor": "#9A3412"
  }
];

export const SECTORS = [...new Set(entrepreneurs.map(e => e.sector))];
