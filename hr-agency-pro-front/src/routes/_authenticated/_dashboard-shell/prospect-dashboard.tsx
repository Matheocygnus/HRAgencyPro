import { createFileRoute } from '@tanstack/react-router'
import { usePermissions } from '../../../features/auth/use-permissions'
import { AccessDenied } from '../../../components/AccessDenied'
import { TabScrollShadow } from '../../../components/TabScrollShadow'
import { useQuery } from '@tanstack/react-query'
import { KPI } from '@heroui-pro/react'
import { Tabs, Table, Chip, Skeleton, Card } from '@heroui/react'
import { api } from '../../../lib/api'
import { useAuthContext } from '../../../features/auth/auth-context'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/prospect-dashboard')({
  component: ProspectDashboard,
})

interface Prospect {
  id: number
  name: string
  targetCompany: string
  status: string
}

interface Interview {
  id: number
  date: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

const interviewStatusColor: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  scheduled: 'primary',
  completed: 'success',
  cancelled: 'danger',
}

export function ProspectDashboard() {
  const { can } = usePermissions()
  if (!can('prospect_dashboard')) return <AccessDenied />
  const { user } = useAuthContext()
  const prospectId = user?.prospectId

  const prospectQuery = useQuery<Prospect>({
    queryKey: ['prospects', prospectId],
    queryFn: () => api.get<Prospect>(`/prospects/${prospectId}`).then(r => r.data),
    enabled: prospectId != null,
  })

  const interviewsQuery = useQuery<Interview[]>({
    queryKey: ['interviews', { prospectId }],
    queryFn: () =>
      api.get<Interview[]>('/interviews', { params: { prospectId } }).then(r => r.data),
    enabled: prospectId != null,
  })

  const prospect = prospectQuery.data
  const interviews = interviewsQuery.data ?? []
  const upcomingInterviews = interviews.filter(i => i.status === 'scheduled').length
  const completedInterviews = interviews.filter(i => i.status === 'completed').length
  const isLoadingStats = prospectQuery.isLoading || interviewsQuery.isLoading

  return (
    <div data-testid="prospect-dashboard" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">

      {/* Page header */}
      <div>
        {prospectQuery.isLoading ? (
          <>
            <Skeleton className="mb-1 h-6 w-48 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-lg" />
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              {prospect?.name ?? 'My Dashboard'}
            </h1>
            <p className="text-xs text-muted md:text-sm">Status: {prospect?.status ?? '—'}</p>
          </>
        )}
      </div>

      {/* KPI grid — 2 cols mobile, 3 cols desktop */}
      {isLoadingStats ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <KPI>
            <KPI.Header><KPI.Title>Upcoming</KPI.Title></KPI.Header>
            <KPI.Content>
              <span data-testid="stat-upcoming-interviews">
                <KPI.Value value={upcomingInterviews} maximumFractionDigits={0} />
              </span>
            </KPI.Content>
          </KPI>
          <KPI>
            <KPI.Header><KPI.Title>Completed</KPI.Title></KPI.Header>
            <KPI.Content>
              <span data-testid="stat-completed-interviews">
                <KPI.Value value={completedInterviews} maximumFractionDigits={0} />
              </span>
            </KPI.Content>
          </KPI>
          <KPI className="col-span-2 md:col-span-1">
            <KPI.Header><KPI.Title>Target Company</KPI.Title></KPI.Header>
            <KPI.Content>
              <span data-testid="stat-target-company" className="text-xl font-bold md:text-2xl">
                {prospect?.targetCompany ?? '—'}
              </span>
            </KPI.Content>
          </KPI>
        </div>
      )}

      {/* Activity section */}
      <Card>
        <Card.Header>
          <Card.Title>Activity</Card.Title>
          <Card.Description>Your application status and interviews</Card.Description>
        </Card.Header>
        <Card.Content>
          <Tabs defaultSelectedKey="overview">
            <TabScrollShadow>
              <Tabs.ListContainer className="!overflow-x-visible">
                <Tabs.List aria-label="Prospect dashboard tabs">
                  <Tabs.Tab id="overview">Overview<Tabs.Indicator /></Tabs.Tab>
                  <Tabs.Tab id="interviews">
                    Interviews
                    {interviews.length > 0 && (
                      <Chip size="sm" variant="flat" color="primary" className="ml-1.5 h-4 min-w-4 px-1 text-[10px]">
                        {interviews.length}
                      </Chip>
                    )}
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="documents">Documents<Tabs.Indicator /></Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
            </TabScrollShadow>

            <Tabs.Panel id="overview" className="pt-3">
              {prospect ? (
                <div className="flex items-center gap-2 py-1">
                  <Chip
                    color={
                      prospect.status === 'hired'
                        ? 'success'
                        : prospect.status === 'rejected'
                          ? 'danger'
                          : 'primary'
                    }
                    variant="flat"
                  >
                    {prospect.status}
                  </Chip>
                  <span className="text-sm text-muted">at {prospect.targetCompany}</span>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted">No application data available.</p>
              )}
            </Tabs.Panel>

            <Tabs.Panel id="interviews" className="pt-3">
              <div className="overflow-x-auto">
                <Table>
                  <Table.Content aria-label="Interviews table">
                    <Table.Header>
                      <Table.Column isRowHeader>DATE</Table.Column>
                      <Table.Column>STATUS</Table.Column>
                    </Table.Header>
                    <Table.Body
                      items={interviews}
                      renderEmptyState={() => (
                        <div className="py-8 text-center text-sm text-muted">No interviews scheduled.</div>
                      )}
                    >
                      {interview => (
                        <Table.Row key={interview.id}>
                          <Table.Cell>{new Date(interview.date).toLocaleDateString()}</Table.Cell>
                          <Table.Cell>
                            <Chip
                              color={interviewStatusColor[interview.status] ?? 'default'}
                              size="sm"
                              variant="flat"
                            >
                              {interview.status}
                            </Chip>
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table.Content>
                </Table>
              </div>
            </Tabs.Panel>

            <Tabs.Panel id="documents" className="pt-3">
              <p className="py-8 text-center text-sm text-muted">Documents coming soon.</p>
            </Tabs.Panel>
          </Tabs>
        </Card.Content>
      </Card>
    </div>
  )
}
