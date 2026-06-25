import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { usePermissions } from '../../../features/auth/use-permissions'
import { useAuthContext } from '../../../features/auth/auth-context'
import { AccessDenied } from '../../../components/AccessDenied'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { Card, Tabs, Table, Chip, Skeleton, Button, Avatar, Modal, Label, TextField } from '@heroui/react'
import { ArrowLeft, Mail, Phone, Pencil } from 'lucide-react'
import { heroesApi } from '../../../api/heroes.api'
import { contractsApi } from '../../../api/contracts.api'
import { prospectsApi } from '../../../api/prospects.api'
import type { Hero } from '../../../types/hero.types'
import type { Contract } from '../../../types/contract.types'

import { guardHeroProfile } from '../../../lib/route-guard'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/heroes/$id')({
  beforeLoad: guardHeroProfile(),
  component: HeroDetail,
})

type ActiveTab = 'overview' | 'contract' | 'performance'

const statusColor: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  active: 'success', signed: 'primary', draft: 'default',
  completed: 'success', terminated: 'danger',
}

const contractStatusColor: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  active: 'success', signed: 'primary', draft: 'default', completed: 'success', terminated: 'danger',
}

function HeroPerformance({ contracts, startDate }: { contracts: Contract[]; startDate?: string }) {
  const totalContracts = contracts.length
  const activeContracts = contracts.filter(c => c.status === 'active' || c.status === 'signed')
  const completedContracts = contracts.filter(c => c.status === 'completed')
  const monthlyCompensation = activeContracts.reduce((sum, c) => sum + (c.compensation ?? 0), 0)

  const heroSince = startDate
    ? (() => {
        const ms = Date.now() - new Date(startDate).getTime()
        const days = Math.floor(ms / 86400000)
        if (days < 0) return '—'
        if (days < 30) return `${days}d`
        if (days < 365) return `${Math.floor(days / 30)}mo`
        const yrs = Math.floor(days / 365)
        const mos = Math.floor((days % 365) / 30)
        return mos > 0 ? `${yrs}y ${mos}mo` : `${yrs}y`
      })()
    : '—'

  const stats = [
    { label: 'Total Contracts', value: totalContracts },
    { label: 'Active / Signed', value: activeContracts.length },
    { label: 'Completed', value: completedContracts.length },
    { label: 'Monthly Compensation', value: monthlyCompensation > 0 ? `$${monthlyCompensation.toLocaleString()}` : '—' },
    { label: 'Hero Since', value: heroSince },
  ]

  return (
    <div className="flex flex-col gap-4" data-testid="hero-performance">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map(s => (
          <Card key={s.label}>
            <Card.Content className="p-3 md:p-4">
              <p className="text-xs text-muted">{s.label}</p>
              <p className="mt-1 text-xl font-bold text-foreground">{s.value}</p>
            </Card.Content>
          </Card>
        ))}
      </div>

      {contracts.length > 0 && (
        <Card>
          <Card.Header>
            <Card.Title>Contract History</Card.Title>
          </Card.Header>
          <Card.Content className="p-0">
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label="Contract history">
                  <Table.Header>
                    <Table.Column isRowHeader className="whitespace-nowrap">Title</Table.Column>
                    <Table.Column className="whitespace-nowrap">Client</Table.Column>
                    <Table.Column className="whitespace-nowrap">Status</Table.Column>
                    <Table.Column className="whitespace-nowrap">Compensation / mo</Table.Column>
                    <Table.Column className="whitespace-nowrap">Start</Table.Column>
                    <Table.Column className="whitespace-nowrap">End</Table.Column>
                  </Table.Header>
                  <Table.Body items={contracts}>
                    {contract => (
                      <Table.Row key={contract.id} id={contract.id}>
                        <Table.Cell className="whitespace-nowrap"><span className="font-medium">{contract.title ?? `#${contract.id}`}</span></Table.Cell>
                        <Table.Cell className="whitespace-nowrap">{contract.company?.name ?? '—'}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap">
                          <Chip size="sm" variant="flat" color={contractStatusColor[contract.status] ?? 'default'}>
                            {contract.status}
                          </Chip>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap">
                          {contract.compensation != null ? `$${contract.compensation.toLocaleString()}` : '—'}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap">{contract.startDate ?? '—'}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap">{contract.endDate ?? '—'}</Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </Card.Content>
        </Card>
      )}

      {contracts.length === 0 && (
        <Card>
          <Card.Content className="p-8 text-center">
            <p className="text-sm text-muted">No contracts found for this hero.</p>
          </Card.Content>
        </Card>
      )}
    </div>
  )
}

export function HeroDetail() {
  // ALL hooks FIRST — no early returns before them
  const { can } = usePermissions()
  const { user } = useAuthContext()
  const { id } = Route.useParams()
  const heroId = Number(id)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview')
  const [editSkillsOpen, setEditSkillsOpen] = useState(false)
  const [skillsInput, setSkillsInput] = useState('')
  const queryClient = useQueryClient()

  const isRecruiter = can('contracts')
  const isHero = can('hero_dashboard')

  const skillsMutation = useMutation({
    mutationFn: ({ prospectId, skills }: { prospectId: number; skills: string }) =>
      prospectsApi.update(prospectId, { skills }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroes', heroId] })
      setEditSkillsOpen(false)
    },
  })

  const { data: hero, isLoading } = useQuery<Hero>({
    queryKey: ['heroes', heroId],
    queryFn: () => heroesApi.get(heroId),
  })

  const canSeeContracts = isRecruiter || can('contracts:read')

  const { data: allContracts = [] } = useQuery<Contract[]>({
    queryKey: ['contracts', { heroId }],
    queryFn: () => contractsApi.list({ heroId }),
    enabled: canSeeContracts && (activeTab === 'contract' || activeTab === 'performance'),
  })

  // Hero: backend already scopes by heroId. Client: filter by clientId.
  const contracts = isRecruiter || isHero
    ? allContracts
    : allContracts.filter(c => c.clientId === user?.clientId)

  // Access check AFTER all hooks
  if (!can('heroes') && !can('heroes:read')) return <AccessDenied />

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
        <Skeleton className="h-8 w-40 rounded-lg" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (!hero) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-6" data-testid="hero-detail-not-found">
        <p className="text-sm text-muted">Hero not found.</p>
        <Button variant="flat" size="sm" startContent={<ArrowLeft className="size-4" />}
          onPress={() => navigate({ to: isHero ? '/hero-dashboard' : '/heroes' })}>
          Back
        </Button>
      </div>
    )
  }

  // Use optional chaining to prevent crash when firstName/lastName is undefined
  const initials = `${hero.firstName?.[0] ?? ''}${hero.lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <div data-testid="hero-detail" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <Button variant="flat" size="sm" isIconOnly aria-label="Back"
          onPress={() => navigate({ to: isHero ? '/hero-dashboard' : '/heroes' })}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
            {hero.firstName} {hero.lastName}
          </h1>
          <p className="text-xs text-muted md:text-sm">Hero profile</p>
        </div>
      </div>

      {/* Profile card */}
      <Card>
        <Card.Content className="flex flex-wrap items-center gap-4 p-4 md:p-6">
          <Avatar size="lg">
            <Avatar.Fallback>{initials}</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-foreground">{hero.firstName} {hero.lastName}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Mail className="size-3" />
              <span>{hero.email}</span>
            </div>
            {hero.phone && (
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Phone className="size-3" />
                <span>{hero.phone}</span>
              </div>
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Tabs */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={k => setActiveTab(k as ActiveTab)}
        size="sm"
      >
        <Tabs.ListContainer>
          <Tabs.List aria-label="Hero detail tabs">
            <Tabs.Tab id="overview">Overview<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="contract">Contracts<Tabs.Indicator /></Tabs.Tab>
            {(isRecruiter || isHero) && <Tabs.Tab id="performance">Performance<Tabs.Indicator /></Tabs.Tab>}
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="overview" className="pt-3">
          <Card data-testid="hero-overview">
            <Card.Content className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-foreground">Skills</p>
                {can('prospects') && (
                  <Button
                    size="sm"
                    variant="flat"
                    startContent={<Pencil className="size-3" />}
                    onPress={() => {
                      setSkillsInput((hero.skills ?? []).join(', '))
                      setEditSkillsOpen(true)
                    }}
                  >
                    Edit Skills
                  </Button>
                )}
              </div>
              {hero.skills && hero.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {hero.skills.map(skill => (
                    <Chip key={skill} size="sm" variant="flat" color="primary">{skill}</Chip>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">No skills listed.</p>
              )}
            </Card.Content>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel id="contract" className="pt-3">
          <Card data-testid="hero-contracts">
            <Card.Content className="p-0">
              <Table>
                <Table.ScrollContainer>
                  <Table.Content aria-label="Hero contracts">
                    <Table.Header>
                      <Table.Column isRowHeader className="whitespace-nowrap">Title</Table.Column>
                      {isRecruiter && <Table.Column className="whitespace-nowrap">Client</Table.Column>}
                      <Table.Column className="whitespace-nowrap">Status</Table.Column>
                      <Table.Column className="whitespace-nowrap">Compensation / mo</Table.Column>
                      <Table.Column className="whitespace-nowrap">Start</Table.Column>
                      <Table.Column className="whitespace-nowrap">End</Table.Column>
                    </Table.Header>
                    <Table.Body
                      items={contracts}
                      renderEmptyState={() => (
                        <div className="py-12 text-center text-sm text-muted">No contracts found.</div>
                      )}
                    >
                      {contract => (
                        <Table.Row key={contract.id} id={contract.id}>
                          <Table.Cell className="whitespace-nowrap"><span className="font-medium">{contract.title ?? `#${contract.id}`}</span></Table.Cell>
                          {isRecruiter && <Table.Cell className="whitespace-nowrap">{contract.company?.name ?? '—'}</Table.Cell>}
                          <Table.Cell className="whitespace-nowrap">
                            <Chip size="sm" variant="flat" color={statusColor[contract.status] ?? 'default'}>
                              {contract.status}
                            </Chip>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap">
                            {contract.compensation != null ? `$${contract.compensation.toLocaleString()}` : '—'}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap">{contract.startDate ?? '—'}</Table.Cell>
                          <Table.Cell className="whitespace-nowrap">{contract.endDate ?? '—'}</Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </Card.Content>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel id="performance" className="pt-3">
          <HeroPerformance contracts={contracts} startDate={hero.startDate} />
        </Tabs.Panel>
      </Tabs>

      {can('prospects') && (
        <Modal.Backdrop isOpen={editSkillsOpen} onOpenChange={(isOpen) => { if (!isOpen) setEditSkillsOpen(false) }}>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-md">
              <Modal.Header>
                <Modal.Heading>Edit Skills</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="overflow-y-auto max-h-[60vh]">
                <TextField>
                  <Label>Skills</Label>
                  <textarea
                    className="input w-full"
                    rows={3}
                    value={skillsInput}
                    onChange={e => setSkillsInput(e.target.value)}
                    placeholder="e.g. React, Node.js, TypeScript"
                  />
                  <p className="text-xs text-muted mt-1">Separate skills with commas</p>
                </TextField>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" slot="close">Cancel</Button>
                <Button
                  color="accent"
                  isDisabled={!hero.prospectId || skillsMutation.isPending}
                  onPress={() => {
                    if (!hero.prospectId) return
                    skillsMutation.mutate({ prospectId: hero.prospectId, skills: skillsInput.trim() })
                  }}
                >
                  Save
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      )}
    </div>
  )
}
