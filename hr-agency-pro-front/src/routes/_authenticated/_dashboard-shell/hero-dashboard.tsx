import { createFileRoute } from '@tanstack/react-router'
import { usePermissions } from '../../../features/auth/use-permissions'
import { AccessDenied } from '../../../components/AccessDenied'
import { useQuery } from '@tanstack/react-query'
import { KPI } from '@heroui-pro/react'
import { Tabs, Chip, Separator, ProgressBar, Skeleton, Card } from '@heroui/react'
import { api } from '../../../lib/api'
import { useAuthContext } from '../../../features/auth/auth-context'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/hero-dashboard')({
  component: HeroDashboard,
})

interface Hero {
  id: number
  name: string
  title: string
}

interface Contract {
  id: number
  title: string
  lengthMonths: number
  status: string
  startDate?: string
  clientName?: string
}

function contractProgress(contract: Contract): number {
  if (!contract.startDate) return 0
  const start = new Date(contract.startDate).getTime()
  const now = Date.now()
  const totalMs = contract.lengthMonths * 30 * 24 * 60 * 60 * 1000
  return Math.min(100, Math.round(((now - start) / totalMs) * 100))
}

export function HeroDashboard() {
  const { can } = usePermissions()
  if (!can('hero_dashboard')) return <AccessDenied />
  const { user } = useAuthContext()
  const heroId = user?.heroId

  const heroQuery = useQuery<Hero>({
    queryKey: ['heroes', heroId],
    queryFn: () => api.get<Hero>(`/heroes/${heroId}`).then(r => r.data),
    enabled: heroId != null,
  })

  const contractsQuery = useQuery<Contract[]>({
    queryKey: ['contracts', { heroId }],
    queryFn: () => api.get<Contract[]>('/contracts', { params: { heroId } }).then(r => r.data),
    enabled: heroId != null,
  })

  const hero = heroQuery.data
  const contracts = contractsQuery.data ?? []
  const activeContract = contracts.find(c => c.status === 'active') ?? contracts[0]
  const progress = activeContract ? contractProgress(activeContract) : 0

  return (
    <div data-testid="hero-dashboard" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          {heroQuery.isLoading ? (
            <>
              <Skeleton className="mb-1 h-6 w-48 rounded-lg" />
              <Skeleton className="h-4 w-32 rounded-lg" />
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                {hero?.name ?? 'Hero Dashboard'}
              </h1>
              <p className="text-xs text-muted md:text-sm">{hero?.title ?? ''}</p>
            </>
          )}
        </div>
        {activeContract && (
          <Chip color="success" variant="flat" size="sm">Active Contract</Chip>
        )}
      </div>

      {/* KPI grid — 2 cols mobile, 2 cols desktop */}
      {contractsQuery.isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <KPI>
            <KPI.Header><KPI.Title>Contract Length</KPI.Title></KPI.Header>
            <KPI.Content>
              <span data-testid="stat-contract-length">
                <KPI.Value value={activeContract?.lengthMonths ?? 0} maximumFractionDigits={0} />
              </span>
              <span className="ml-1 text-xs text-muted">mo</span>
            </KPI.Content>
          </KPI>
          <KPI>
            <KPI.Header><KPI.Title>Total Contracts</KPI.Title></KPI.Header>
            <KPI.Content>
              <KPI.Value value={contracts.length} maximumFractionDigits={0} />
            </KPI.Content>
          </KPI>
        </div>
      )}

      {/* Contract detail section */}
      <Card>
        <Card.Header>
          <Card.Title>Contract Details</Card.Title>
          <Card.Description>
            {activeContract ? activeContract.title : 'No active contract'}
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Tabs defaultSelectedKey="overview">
            <Tabs.ListContainer>
              <Tabs.List aria-label="Hero dashboard tabs">
                <Tabs.Tab id="overview">Overview<Tabs.Indicator /></Tabs.Tab>
                <Tabs.Tab id="contract">Contract<Tabs.Indicator /></Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>

            <Tabs.Panel id="overview" className="pt-3">
              <div className="flex flex-col gap-4">
                {activeContract ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Client</span>
                      <span className="text-sm text-muted">{activeContract.clientName ?? '—'}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Contract</span>
                      <span className="text-sm text-muted">{activeContract.title}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Duration</span>
                      <span className="text-sm text-muted">{activeContract.lengthMonths} months</span>
                    </div>
                  </>
                ) : (
                  <p className="py-8 text-center text-sm text-muted">No active contract.</p>
                )}
              </div>
            </Tabs.Panel>

            <Tabs.Panel id="contract" className="pt-3">
              {activeContract ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <ProgressBar aria-label="Contract progress" value={progress} minValue={0} maxValue={100}>
                      <ProgressBar.Track>
                        <ProgressBar.Fill />
                      </ProgressBar.Track>
                    </ProgressBar>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted">Duration</p>
                      <p className="font-medium">{activeContract.lengthMonths} months</p>
                    </div>
                    <div>
                      <p className="text-muted">Status</p>
                      <Chip
                        color={activeContract.status === 'active' ? 'success' : 'default'}
                        size="sm"
                        variant="flat"
                        className="mt-0.5"
                      >
                        {activeContract.status}
                      </Chip>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted">No contract details available.</p>
              )}
            </Tabs.Panel>
          </Tabs>
        </Card.Content>
      </Card>
    </div>
  )
}
