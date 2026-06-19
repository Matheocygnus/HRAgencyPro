import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { KPI } from '@heroui-pro/react'
import { Tabs, Table, Chip, Skeleton, Card } from '@heroui/react'
import { CalendarDays, UserCheck, Building2, FileText } from 'lucide-react'
import { api } from '../../../lib/api'
import { clientsApi } from '../../../api/clients.api'
import { useAuthContext } from '../../../features/auth/auth-context'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/dashboard')({
  component: Dashboard,
})

interface DashboardStats {
  upcomingInterviews: number
  matchedProspects: number
  activeClients: number
  pendingInvoices: number
}

interface JobRequest {
  id: number
  clientId: number
  title: string
  clientName?: string
  companyName?: string
  location?: string
  status: string
  createdAt?: string
}

interface JobApplication {
  id: number
  firstName: string
  lastName: string
  email?: string
  status: string
  createdAt?: string
}

const statusColor: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  active: 'success',
  hired: 'success',
  rejected: 'danger',
  reviewed: 'primary',
  open: 'secondary',
  published: 'success',
  closed: 'default',
}

const kpiConfig = [
  {
    key: 'upcomingInterviews' as const,
    label: 'Upcoming Interviews',
    status: 'danger' as const,
    Icon: CalendarDays,
  },
  {
    key: 'matchedProspects' as const,
    label: 'Matched Prospects',
    status: 'success' as const,
    Icon: UserCheck,
  },
  {
    key: 'activeClients' as const,
    label: 'Active Clients',
    status: 'success' as const,
    Icon: Building2,
  },
  {
    key: 'pendingInvoices' as const,
    label: 'Pending Invoices',
    status: 'warning' as const,
    Icon: FileText,
  },
]

export function Dashboard() {
  const { user } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && user.clientId) {
      navigate({ to: '/client-dashboard' })
    }
  }, [user, navigate])

  const statsQuery = useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => api.get<DashboardStats>('/dashboard/stats').then(r => r.data),
  })

  const jobRequestsQuery = useQuery<JobRequest[]>({
    queryKey: ['job-requests'],
    queryFn: () => api.get<JobRequest[]>('/job-requests').then(r => r.data),
  })

  const jobApplicationsQuery = useQuery<JobApplication[]>({
    queryKey: ['job-applications'],
    queryFn: () => api.get<JobApplication[]>('/job-applications').then(r => r.data),
  })

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.list(),
  })

  const clientMap = useMemo(() =>
    Object.fromEntries(clients.map((c: any) => [c.id, c.name])),
    [clients]
  )

  const stats = statsQuery.data
  const jobRequests = jobRequestsQuery.data ?? []
  const jobApplications = jobApplicationsQuery.data ?? []

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div data-testid="dashboard" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">

      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">Dashboard</h1>
        <p className="text-xs text-muted md:text-sm">{today}</p>
      </div>

      {/* KPI grid — 2 cols mobile, 4 cols desktop */}
      {statsQuery.isLoading ? (
        <div data-testid="dashboard-loading" className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : statsQuery.isError ? (
        <Card>
          <Card.Content>
            <p className="text-sm text-danger">Could not load stats. Please refresh.</p>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpiConfig.map(({ key, label, status, Icon }) => (
            <KPI key={key}>
              <KPI.Header>
                <KPI.Icon status={status}>
                  <Icon className="size-4" />
                </KPI.Icon>
                <KPI.Title>{label}</KPI.Title>
              </KPI.Header>
              <KPI.Content>
                <span data-testid={`stat-${key}`}>
                  <KPI.Value value={stats?.[key] ?? 0} maximumFractionDigits={0} />
                </span>
              </KPI.Content>
            </KPI>
          ))}
        </div>
      )}

      {/* Activity card */}
      <Card>
        <Card.Header>
          <Card.Title>Activity</Card.Title>
          <Card.Description>Recent job requests and applications</Card.Description>
        </Card.Header>
        <Card.Content>
          <Tabs defaultSelectedKey="job-requests">
            <Tabs.ListContainer>
              <Tabs.List aria-label="Dashboard activity tabs">
                <Tabs.Tab id="job-requests">
                  Job Requests
                  {jobRequests.length > 0 && (
                    <Chip size="sm" variant="flat" color="primary" className="ml-1.5 h-4 min-w-4 px-1 text-[10px]">
                      {jobRequests.length}
                    </Chip>
                  )}
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="job-applications">
                  Applications
                  {jobApplications.length > 0 && (
                    <Chip size="sm" variant="flat" color="primary" className="ml-1.5 h-4 min-w-4 px-1 text-[10px]">
                      {jobApplications.length}
                    </Chip>
                  )}
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>

            <Tabs.Panel id="job-requests" className="pt-3">
              {jobRequestsQuery.isLoading ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <Table.Content aria-label="Job requests table">
                      <Table.Header>
                        <Table.Column isRowHeader>TITLE</Table.Column>
                        <Table.Column>CLIENT</Table.Column>
                        <Table.Column>LOCATION</Table.Column>
                        <Table.Column>STATUS</Table.Column>
                        <Table.Column>DATE</Table.Column>
                      </Table.Header>
                      <Table.Body
                        items={jobRequests}
                        renderEmptyState={() => (
                          <div className="py-8 text-center text-sm text-muted">No job requests yet</div>
                        )}
                      >
                        {req => (
                          <Table.Row key={req.id}>
                            <Table.Cell><span className="font-medium">{req.title}</span></Table.Cell>
                            <Table.Cell>{req.clientName ?? clientMap[req.clientId] ?? '—'}</Table.Cell>
                            <Table.Cell>{req.location ?? '—'}</Table.Cell>
                            <Table.Cell>
                              <Chip color={statusColor[req.status] ?? 'default'} size="sm" variant="flat">
                                {req.status}
                              </Chip>
                            </Table.Cell>
                            <Table.Cell>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '—'}</Table.Cell>
                          </Table.Row>
                        )}
                      </Table.Body>
                    </Table.Content>
                  </Table>
                </div>
              )}
            </Tabs.Panel>

            <Tabs.Panel id="job-applications" className="pt-3">
              {jobApplicationsQuery.isLoading ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <Table.Content aria-label="Job applications table">
                      <Table.Header>
                        <Table.Column isRowHeader>CANDIDATE</Table.Column>
                        <Table.Column>EMAIL</Table.Column>
                        <Table.Column>STATUS</Table.Column>
                        <Table.Column>DATE</Table.Column>
                      </Table.Header>
                      <Table.Body
                        items={jobApplications}
                        renderEmptyState={() => (
                          <div className="py-8 text-center text-sm text-muted">No applications yet</div>
                        )}
                      >
                        {app => (
                          <Table.Row key={app.id}>
                            <Table.Cell><span className="font-medium">{app.firstName} {app.lastName}</span></Table.Cell>
                            <Table.Cell>{app.email ?? '—'}</Table.Cell>
                            <Table.Cell>
                              <Chip color={statusColor[app.status] ?? 'default'} size="sm" variant="flat">
                                {app.status}
                              </Chip>
                            </Table.Cell>
                            <Table.Cell>{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}</Table.Cell>
                          </Table.Row>
                        )}
                      </Table.Body>
                    </Table.Content>
                  </Table>
                </div>
              )}
            </Tabs.Panel>
          </Tabs>
        </Card.Content>
      </Card>
    </div>
  )
}
