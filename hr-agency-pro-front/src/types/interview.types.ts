export interface Interview {
  id: number
  prospectId: number
  title: string
  scheduledDate: string
  duration: number
  meetingLink?: string
  interviewerIds?: number[]
  notes?: string
  status: 'scheduled' | 'completed' | 'cancelled'
  createdAt?: string
}
