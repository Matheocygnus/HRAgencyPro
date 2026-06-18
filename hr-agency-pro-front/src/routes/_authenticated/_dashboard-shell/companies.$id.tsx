import { createFileRoute, Link } from '@tanstack/react-router'
import { usePermissions } from '../../../features/auth/use-permissions'
import { AccessDenied } from '../../../components/AccessDenied'
import { useQuery } from '@tanstack/react-query'
import { Card, Table, Chip, Skeleton, Button } from '@heroui/react'
import { ArrowLeft, Building } from 'lucide-react'
import { companiesApi } from '../../../api/companies.api'
import { heroesApi } from '../../../api/heroes.api'
import { contractsApi } from '../../../api/contracts.api'
import type { Company } from '../../../types/company.types'
import type { Hero } from '../../../types/hero.types'
import type { Contract } from '../../../types/contract.types'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/companies/$id')({
  component: CompanyDetail,
})

const statusColor: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  active: 'success', signed: 'primary', draft: 'default',
  completed: 'success', terminated: 'danger',
}

export function CompanyDetail() {
  const { can } = usePermissions()
  if (!can('companies')) return <AccessDenied />
  const { id } = Route.useParams()
  const companyId = Number(id)

  const { data: company, isLoading } = useQuery<Company>({
    queryKey: ['companies', companyId],
    queryFn: () => companiesApi.get(companyId),
  })

  const { data: heroes = [] } = useQuery<Hero[]>({
    queryKey: ['heroes', { clientId: company?.clientId }],
    queryFn: () => heroesApi.list({ clientId: company?.clientId }),
    enabled: !!company?.clientId,
  })

  const { data: contracts = [] } = useQuery<Contract[]>({
    queryKey: ['contracts', { clientId: company?.clientId }],
    queryFn: () => contractsApi.list({ clientId: company?.clientId }),
    enabled: !!company?.clientId,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
        <Skeleton className="h-8 w-40 rounded-lg" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-6" data-testid="company-detail-not-found">
        <p className="text-sm text-muted">Company not found.</p>
        <Button as={Link} to="/clients" variant="flat" size="sm" startContent={<ArrowLeft className="size-4" />}>
          Back to Clients
        </Button>
      </div>
    )
  }

  return (
    <div data-testid="company-detail" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <Button as={Link} to="/clients" variant="flat" size="sm" isIconOnly aria-label="Back">
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">{company.name}</h1>
          <p className="text-xs text-muted md:text-sm">Company profile</p>
        </div>
      </div>

      {/* Info card */}
      <Card>
        <Card.Content className="flex items-center gap-4 p-4 md:p-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building className="size-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{company.name}</p>
            {company.clientId && (
              <p className="text-xs text-muted">Client ID: {company.clientId}</p>
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Heroes */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground">Heroes</h2>
        <Card>
          <Card.Content className="p-0">
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label="Company heroes" data-testid="company-heroes-table">
                  <Table.Header>
                    <Table.Column isRowHeader>Name</Table.Column>
                    <Table.Column>Email</Table.Column>
                  </Table.Header>
                  <Table.Body
                    items={heroes}
                    renderEmptyState={() => (
                      <div className="py-10 text-center text-sm text-muted">No heroes assigned.</div>
                    )}
                  >
                    {hero => (
                      <Table.Row key={hero.id} id={hero.id}>
                        <Table.Cell>
                          <span className="font-medium">{hero.firstName} {hero.lastName}</span>
                        </Table.Cell>
                        <Table.Cell>{hero.email}</Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </Card.Content>
        </Card>
      </div>

      {/* Contracts */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground">Contracts</h2>
        <Card>
          <Card.Content className="p-0">
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label="Company contracts" data-testid="company-contracts-table">
                  <Table.Header>
                    <Table.Column isRowHeader>ID</Table.Column>
                    <Table.Column>Status</Table.Column>
                    <Table.Column>Start</Table.Column>
                    <Table.Column>End</Table.Column>
                  </Table.Header>
                  <Table.Body
                    items={contracts}
                    renderEmptyState={() => (
                      <div className="py-10 text-center text-sm text-muted">No contracts found.</div>
                    )}
                  >
                    {contract => (
                      <Table.Row key={contract.id} id={contract.id}>
                        <Table.Cell><span className="font-medium">{contract.id}</span></Table.Cell>
                        <Table.Cell>
                          <Chip size="sm" variant="flat" color={statusColor[contract.status] ?? 'default'}>
                            {contract.status}
                          </Chip>
                        </Table.Cell>
                        <Table.Cell>{contract.startDate}</Table.Cell>
                        <Table.Cell>{contract.endDate ?? '—'}</Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}
