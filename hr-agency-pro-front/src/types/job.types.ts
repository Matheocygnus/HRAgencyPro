export interface JobOpening {
  id: number
  title: string
  description?: string
  requirements?: string
  location?: string
  jobType?: string
  salaryRange?: string
  salary?: string
  isActive?: boolean
  status: 'active' | 'closed'
  createdAt: string
}

export type ApplicationStatus =
  | 'new'
  | 'screened'
  | 'cv_sent'
  | 'interview_scheduled'
  | 'offer_agreed'
  | 'hired'
  | 'rejected'

export interface JobApplication {
  id: number
  jobOpeningId: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  country?: string
  callNumber?: string
  pronoun?: string
  role?: string
  otherPositions?: string
  heardAbout?: string
  salaryAgreement?: boolean
  voiceRecordingUrl?: string
  englishLevel?: string
  seniority?: string
  portfolio?: string
  tools?: string
  otherTools?: string
  references?: string
  resumeUrl?: string
  notes?: string
  status: ApplicationStatus
  createdAt?: string
}

export interface JobRequest {
  id: number
  clientId: number
  companyId: number
  clientName?: string
  companyName?: string
  title: string
  openPositions?: number
  startDate?: string
  description?: string
  requirements?: string
  niceToHaveSkills?: string
  tools?: string
  jobType?: string
  workingHours?: string
  timezone?: string
  reportsTo?: string
  languages?: string[]
  seniority?: string
  requiresProficiencyTest?: boolean
  interviewQuestions?: string
  testingRequirements?: string
  status: 'pending' | 'approved' | 'rejected' | 'converted'
  notes?: string
  createdAt: string
}
