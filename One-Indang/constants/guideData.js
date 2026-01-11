// Guide Data Constants
// This file contains all data sets used in the guide page

export const GUIDE_DATA = {
  // 1. HEALTH
  'health': {
    title: 'Health & Nutrition',
    offices: [
      {
        name: 'Municipal Health Office (RHU)',
        items: [
          'Medical Consultation / Check-up',
          'Immunization Services (EPI)',
          'Maternal Care & Pre-natal',
          'Sanitary Permit for Businesses',
          'Medical Certificate Issuance',
          'TB-DOTS Program',
          'Family Planning Services'
        ]
      },
      { name: 'M.V. Santiago Medical Center', items: ['Emergency Room', 'Outpatient Services', 'Laboratory Services'] }
    ]
  },

  // 2. SOCIAL SERVICES
  'social': {
    title: 'Social Services',
    offices: [
      {
        name: 'Municipal Social Welfare (MSWDO)',
        items: [
          'AICS (Financial Assistance)',
          'Solo Parent ID Application',
          'PWD ID Application',
          'Senior Citizen ID Application',
          'Certificate of Indigency',
          'Pre-Marriage Counseling'
        ]
      },
      { name: 'OSCA (Senior Citizens)', items: ['Social Pension', 'Senior Citizen Booklet', 'Birthday Cash Gift'] }
    ]
  },

  // 3. HOUSING (Missing Fixed)
  'housing': {
    title: 'Housing & Zoning',
    offices: [
      {
        name: 'Municipal Planning (MPDO)',
        items: [
          'Zoning Clearance',
          'Locational Clearance',
          'Development Permit',
          'Land Use Assistance'
        ]
      },
      { name: 'National Housing Authority (Region IV)', items: ['Housing Loan Inquiry', 'Relocation Assistance'] }
    ]
  },

  // 4. EDUCATION (Missing Fixed)
  'education': {
    title: 'Education & Sports',
    offices: [
      {
        name: 'Municipal Scholarship Office',
        items: [
          'College Scholarship Application',
          'Financial Assistance for Students',
          'ALS (Alternative Learning System)'
        ]
      },
      { name: 'Sports Development Office', items: ['Sports Equipment Request', 'Gymnasium Reservation'] }
    ]
  },

  // 5. LEGAL (Missing Fixed)
  'legal': {
    title: 'Legal Assistance',
    offices: [
      { name: 'Municipal Legal Officer', items: ['Legal Counseling', 'Notary Services (Indigent)', 'Drafting of Affidavits'] },
      { name: 'Public Attorney\'s Office (PAO)', items: ['Free Legal Representation', 'Mediation Services'] }
    ]
  },

  // 6. LIVELIHOOD (Merged Agri + Employment)
  'livelihood': {
    title: 'Livelihood & Agriculture',
    offices: [
      {
        name: 'Municipal Agriculture Office',
        items: [
          'Seed & Fertilizer Distribution',
          'Tractor / Farm Equipment Lending',
          'Technical Assistance on Farming',
          'Anti-Rabies Vaccination',
          'Crop Insurance'
        ]
      },
      { name: 'Indang PESO', items: ['Job Fair Registration', 'SPES (Student Employment)', 'OFW Assistance', 'Livelihood Training'] }
    ]
  },

  // 7. TRANSPARENCY (Renamed from 'treasury')
  'transparency': {
    title: 'Transparency & Taxes',
    offices: [
      { name: 'Municipal Treasurer\'s Office', items: ['Real Property Tax Payment', 'Community Tax Certificate (Cedula)', 'Business Tax Payment'] },
      { name: 'Municipal Assessor\'s Office', items: ['Tax Declaration Issuance', 'Property Assessment', 'Transfer of Tax Dec'] },
      { name: 'Business Permit & Licensing (BPLO)', items: ['New Business Permit', 'Renewal of Business Permit', 'Retirement of Business'] }
    ]
  },

  // 8. ENGINEERING (Renamed from 'eng')
  'engineering': {
    title: 'Engineering & Works',
    offices: [
      {
        name: 'Municipal Engineering Office',
        items: [
          'Building Permit Application',
          'Occupancy Permit',
          'Electrical Permit',
          'Fencing Permit',
          'Excavation Permit'
        ]
      },
      { name: 'General Services Office', items: ['Streetlight Repair Request', 'Facility Maintenance'] }
    ]
  },

  // 9. ENVIRONMENT (Missing Fixed)
  'environment': {
    title: 'Environment (MENRO)',
    offices: [
      {
        name: 'Municipal Environment Office (MENRO)',
        items: [
          'Tree Cutting Permit',
          'Solid Waste Management',
          'Environmental Compliance Certificate (ECC) Assist',
          'Garbage Collection Schedule'
        ]
      },
      { name: 'Tourism Office', items: ['Resort Inspection', 'River Clean-up Drives'] }
    ]
  },

  // 10. PEACE AND ORDER
  'peace': {
    title: 'Peace & Order',
    offices: [
      { name: 'Indang Municipal Police', items: ['Police Clearance', 'Blotter Report', 'Peace & Order Assistance'] },
      { name: 'MDRRMO', items: ['Disaster Rescue', 'Emergency Response Training', 'Ambulance Request'] },
      { name: 'BFP Indang', items: ['Fire Safety Inspection', 'Fire Drill Request'] }
    ]
  },

  // 11. IT (Missing Fixed)
  'it': {
    title: 'IT & Investment',
    offices: [
      { name: 'Local Econ. & Investment (LEIPO)', items: ['Investment Incentives', 'Business Matching', 'DTI Registration Assist'] },
      { name: 'Admin - MIS Section', items: ['GovNet Connectivity', 'LGU Website Concerns'] }
    ]
  }
};