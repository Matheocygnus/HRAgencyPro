import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Card, Button, Skeleton, Chip } from '@heroui/react'
import { MapPin, DollarSign, Briefcase } from 'lucide-react'
import { jobsApi } from '../api/jobs.api'
import type { JobOpening } from '../types/job.types'
import { ApplyDialog, type ApplyFormData } from '../features/jobs/components/ApplyDialog'

export const Route = createFileRoute('/careers')({
  component: CareersPage,
})

export function CareersPage() {
  const [applyingToId, setApplyingToId] = useState<number | null>(null)

  const { data: allOpenings = [], isLoading } = useQuery<JobOpening[]>({
    queryKey: ['job-openings', 'public'],
    queryFn: () => jobsApi.openings.list(),
  })

  const openings = allOpenings.filter(o => o.status === 'active')
  const selectedOpening = openings.find(o => o.id === applyingToId) ?? null

  async function handleApply(data: ApplyFormData) {
    const formData = new FormData()
    const { resumeFile, ...fields } = data
    Object.entries(fields).forEach(([k, v]) => {
      if (v !== undefined && v !== null) formData.append(k, String(v))
    })
    formData.append('resume', resumeFile)
    await jobsApi.applications.create(formData)
    // Dialog closes itself via onClose() after showing the success message
  }

  return (
    <div data-testid="careers-page" className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-divider px-6 py-8 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-1 flex items-center gap-2 text-primary">
            <Briefcase className="size-5" />
            <span className="text-sm font-semibold uppercase tracking-widest">Careers</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Open Positions</h1>
          <p className="mt-1 text-sm text-muted">Join our remote talent network</p>
        </div>
      </header>

      {/* Main */}
      <main className="px-6 py-8 md:px-12">
        <div className="mx-auto max-w-5xl">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-xl" />
              ))}
            </div>
          ) : openings.length === 0 ? (
            <Card>
              <Card.Content className="py-16 text-center">
                <Briefcase className="mx-auto mb-3 size-10 text-muted opacity-40" />
                <p className="text-sm text-muted">No open positions at the moment. Check back soon!</p>
              </Card.Content>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {openings.map(opening => (
                <Card
                  key={opening.id}
                  data-testid={`opening-card-${opening.id}`}
                  className="transition-shadow hover:shadow-md"
                >
                  <Card.Header className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <Card.Title className="text-base">{opening.title}</Card.Title>
                      <Chip size="sm" variant="flat" color="success">Open</Chip>
                    </div>
                  </Card.Header>
                  <Card.Content className="flex flex-col gap-1.5 pb-4">
                    {opening.location && (
                      <div className="flex items-center gap-1.5 text-xs text-muted">
                        <MapPin className="size-3 shrink-0" />
                        <span>{opening.location}</span>
                      </div>
                    )}
                    {opening.salaryRange && (
                      <div className="flex items-center gap-1.5 text-xs text-muted">
                        <DollarSign className="size-3 shrink-0" />
                        <span>{opening.salaryRange}</span>
                      </div>
                    )}
                    {opening.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted">{opening.description}</p>
                    )}
                  </Card.Content>
                  <Card.Footer className="pt-0">
                    <Button
                      color="primary"
                      size="sm"
                      className="w-full"
                      data-testid={`btn-apply-${opening.id}`}
                      onPress={() => setApplyingToId(opening.id)}
                    >
                      Apply Now
                    </Button>
                  </Card.Footer>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedOpening && (
        <ApplyDialog
          jobOpeningId={selectedOpening.id}
          jobTitle={selectedOpening.title}
          onClose={() => setApplyingToId(null)}
          onSubmit={handleApply}
        />
      )}
    </div>
  )
}
