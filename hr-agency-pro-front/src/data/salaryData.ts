export type RoleEntry = {
  role: string
  category: string
  us: number
  rh: number
}

export const salaryData: RoleEntry[] = [
  // Human Resources
  { role: 'Human Resources Manager', category: 'Human Resources', us: 95000, rh: 36000 },
  { role: 'HR Coordinator', category: 'Human Resources', us: 65000, rh: 26400 },
  { role: 'Recruiter', category: 'Human Resources', us: 72000, rh: 28800 },
  { role: 'Human Resource Specialist', category: 'Human Resources', us: 68000, rh: 26400 },
  { role: 'Talent Acquisition Specialist', category: 'Human Resources', us: 75000, rh: 30000 },
  { role: 'HR Business Partner', category: 'Human Resources', us: 105000, rh: 39600 },
  { role: 'Compensation & Benefits Analyst', category: 'Human Resources', us: 82000, rh: 32400 },
  { role: 'Training & Development Specialist', category: 'Human Resources', us: 68000, rh: 27600 },

  // Finance
  { role: 'Bookkeeper', category: 'Finance', us: 58000, rh: 24000 },
  { role: 'Finance Manager', category: 'Finance', us: 115000, rh: 42000 },
  { role: 'Financial Analyst', category: 'Finance', us: 78000, rh: 30000 },
  { role: 'Staff Accountant', category: 'Finance', us: 58000, rh: 25200 },
  { role: 'Accounting Manager', category: 'Finance', us: 88000, rh: 36000 },
  { role: 'Tax Specialist', category: 'Finance', us: 72000, rh: 28800 },
  { role: 'Payroll Specialist', category: 'Finance', us: 55000, rh: 22800 },
  { role: 'Accounts Receivable Specialist', category: 'Finance', us: 48000, rh: 21600 },
  { role: 'Accounts Payable Specialist', category: 'Finance', us: 46000, rh: 21600 },
  { role: 'FP&A Analyst', category: 'Finance', us: 90000, rh: 38000 },
  { role: 'Investor Relations Analyst', category: 'Finance', us: 87000, rh: 37000 },
  { role: 'Professional Services Analyst', category: 'Finance', us: 83000, rh: 35000 },
  { role: 'Accountant', category: 'Finance', us: 75000, rh: 32000 },

  // Marketing
  { role: 'Digital Marketing Manager', category: 'Marketing', us: 85000, rh: 36000 },
  { role: 'Digital Marketing Specialist', category: 'Marketing', us: 70000, rh: 28800 },
  { role: 'Marketing Coordinator', category: 'Marketing', us: 52000, rh: 21600 },
  { role: 'Content Marketing Specialist', category: 'Marketing', us: 65000, rh: 26400 },
  { role: 'Content Creator', category: 'Marketing', us: 55000, rh: 24000 },
  { role: 'Marketing Manager', category: 'Marketing', us: 95000, rh: 38400 },
  { role: 'Growth Marketing Manager', category: 'Marketing', us: 110000, rh: 42000 },
  { role: 'Performance Marketing Specialist', category: 'Marketing', us: 78000, rh: 30000 },
  { role: 'SEO Specialist', category: 'Marketing', us: 72000, rh: 32000 },
  { role: 'Paid Media Specialist', category: 'Marketing', us: 75000, rh: 33500 },
  { role: 'Email Marketing Specialist', category: 'Marketing', us: 68000, rh: 30500 },
  { role: 'Social Media Specialist', category: 'Marketing', us: 65000, rh: 29000 },
  { role: 'Brand Strategist', category: 'Marketing', us: 80000, rh: 36000 },

  // Technology
  { role: 'Software Engineer', category: 'Technology', us: 120000, rh: 43200 },
  { role: 'Developer', category: 'Technology', us: 118000, rh: 42000 },
  { role: 'Data Scientist', category: 'Technology', us: 155000, rh: 48000 },
  { role: 'DevOps Engineer', category: 'Technology', us: 130000, rh: 45600 },
  { role: 'Product Manager', category: 'Technology', us: 140000, rh: 48000 },
  { role: 'Security Specialist', category: 'Technology', us: 125000, rh: 45600 },
  { role: 'Database Administrator', category: 'Technology', us: 105000, rh: 39600 },
  { role: 'Back-end Developer', category: 'Technology', us: 120000, rh: 50000 },
  { role: 'Front-end Developer', category: 'Technology', us: 115000, rh: 48000 },
  { role: 'Mobile Developer', category: 'Technology', us: 125000, rh: 52000 },
  { role: 'Full-stack Developer', category: 'Technology', us: 130000, rh: 55000 },
  { role: 'Web Developer', category: 'Technology', us: 110000, rh: 46000 },
  { role: 'Data Analyst', category: 'Technology', us: 95000, rh: 40000 },
  { role: 'Data Engineer', category: 'Technology', us: 135000, rh: 56000 },
  { role: 'UI/UX Developer', category: 'Technology', us: 105000, rh: 45000 },
  { role: 'QA Tester', category: 'Technology', us: 85000, rh: 36000 },
  { role: 'Automation Specialist', category: 'Technology', us: 110000, rh: 47000 },
  { role: 'IT Support Specialist', category: 'Technology', us: 75000, rh: 32000 },
  { role: 'IT Administrator', category: 'Technology', us: 90000, rh: 38000 },
  { role: 'IT Security Specialist', category: 'Technology', us: 115000, rh: 48000 },

  // Creative
  { role: 'Graphic Designer', category: 'Creative', us: 68000, rh: 27600 },
  { role: 'UI/UX Designer', category: 'Creative', us: 95000, rh: 36000 },
  { role: 'Content Writer', category: 'Creative', us: 58000, rh: 24000 },
  { role: 'Copywriter', category: 'Creative', us: 62000, rh: 26400 },
  { role: 'Video Editor', category: 'Creative', us: 65000, rh: 28800 },
  { role: 'Motion Graphics Designer', category: 'Creative', us: 75000, rh: 32400 },
  { role: 'Web Designer', category: 'Creative', us: 72000, rh: 30000 },
  { role: 'Brand Designer', category: 'Creative', us: 78000, rh: 33600 },
  { role: 'Translator', category: 'Creative', us: 55000, rh: 22800 },

  // Customer Support
  { role: 'Customer Success Manager', category: 'Customer Support', us: 78000, rh: 32400 },
  { role: 'Customer Support Representative', category: 'Customer Support', us: 47500, rh: 21600 },
  { role: 'Customer Support Manager', category: 'Customer Support', us: 68000, rh: 30000 },
  { role: 'Technical Support Specialist', category: 'Customer Support', us: 62000, rh: 27000 },
  { role: 'Live Chat Agent', category: 'Customer Support', us: 42000, rh: 21600 },
  { role: 'Help Desk Specialist', category: 'Customer Support', us: 52000, rh: 24000 },
  { role: 'Booking Support Specialist', category: 'Customer Support', us: 52000, rh: 22800 },

  // Administrative
  { role: 'Administrative Assistant', category: 'Administrative', us: 52000, rh: 21600 },
  { role: 'Executive Assistant', category: 'Administrative', us: 72000, rh: 27000 },
  { role: 'Virtual Assistant', category: 'Administrative', us: 48000, rh: 21600 },
  { role: 'Data Entry Specialist', category: 'Administrative', us: 45000, rh: 21600 },
  { role: 'Office Manager', category: 'Administrative', us: 65000, rh: 28800 },
  { role: 'Personal Assistant', category: 'Administrative', us: 55000, rh: 25200 },
  { role: 'Operations Assistant', category: 'Administrative', us: 50000, rh: 23400 },

  // Operations
  { role: 'Project Manager', category: 'Operations', us: 108000, rh: 39600 },
  { role: 'Operations Manager', category: 'Operations', us: 95000, rh: 36000 },
  { role: 'Operations Coordinator', category: 'Operations', us: 62000, rh: 25200 },
  { role: 'Business Operations Analyst', category: 'Operations', us: 78000, rh: 30000 },
  { role: 'Program Manager', category: 'Operations', us: 115000, rh: 42000 },
  { role: 'Process Improvement Specialist', category: 'Operations', us: 85000, rh: 33600 },
  { role: 'Appointment Setter', category: 'Operations', us: 45000, rh: 21600 },

  // Sales
  { role: 'Sales Development Representative', category: 'Sales', us: 65000, rh: 26400 },
  { role: 'Account Executive', category: 'Sales', us: 95000, rh: 36000 },
  { role: 'Sales Manager', category: 'Sales', us: 125000, rh: 45600 },
  { role: 'Inside Sales Representative', category: 'Sales', us: 58000, rh: 24000 },
  { role: 'Business Development Representative', category: 'Sales', us: 68000, rh: 27600 },
  { role: 'Lead Generation Specialist', category: 'Sales', us: 52000, rh: 21600 },
  { role: 'Sales Coordinator', category: 'Sales', us: 48000, rh: 21600 },
  { role: 'Regional Sales Manager', category: 'Sales', us: 135000, rh: 48000 },

  // Research
  { role: 'Market Researcher', category: 'Research', us: 72000, rh: 28800 },
  { role: 'Research Analyst', category: 'Research', us: 78000, rh: 30000 },
  { role: 'Data Research Specialist', category: 'Research', us: 65000, rh: 26400 },
  { role: 'Business Intelligence Analyst', category: 'Research', us: 85000, rh: 33600 },
  { role: 'Competitive Intelligence Analyst', category: 'Research', us: 88000, rh: 34800 },
  { role: 'User Research Specialist', category: 'Research', us: 95000, rh: 36000 },
]

export const CATEGORIES = Array.from(new Set(salaryData.map((r) => r.category)))

export const CATEGORY_DATA: Record<string, Record<string, { us: number; rh: number }>> =
  salaryData.reduce(
    (acc, entry) => {
      if (!acc[entry.category]) acc[entry.category] = {}
      acc[entry.category][entry.role] = { us: entry.us, rh: entry.rh }
      return acc
    },
    {} as Record<string, Record<string, { us: number; rh: number }>>,
  )
