import { Card, Chip, Button } from '@heroui/react'
import { Pencil, Star, Send, XCircle, Calendar, Building2 } from 'lucide-react'
import type { Prospect } from '../../../types/prospect.types'

interface ProspectCardProps {
  prospect: Prospect
  onEdit?: () => void
  onPromote?: () => void
  onSendResume?: () => void
  onReject?: () => void
  onCoordinateInterview?: () => void
  onCoordinateClientInterview?: () => void
}

const statusColor: Record<string, 'default' | 'accent' | 'warning' | 'success' | 'danger'> = {
  sourcing: 'default',
  contacted: 'accent',
  interview: 'warning',
  client_review: 'warning',
  budget: 'warning',
  contract: 'accent',
  hired: 'success',
  rejected: 'danger',
}

const statusLabel: Record<string, string> = {
  sourcing: 'Sourcing',
  contacted: 'Screening',
  interview: 'Company Review',
  client_review: 'Client Interview',
  budget: 'Budget / Negotiation',
  contract: 'Contract & Hire',
  hired: 'Hired',
  rejected: 'Rejected',
}

const TERMINAL = new Set(['hired', 'rejected'])

export function ProspectCard({
  prospect,
  onEdit,
  onPromote,
  onSendResume,
  onReject,
  onCoordinateInterview,
  onCoordinateClientInterview,
}: ProspectCardProps) {
  const isTerminal = TERMINAL.has(prospect.status)

  return (
    <Card
      className="cursor-grab active:cursor-grabbing"
      data-testid={`prospect-card-${prospect.id}`}
    >
      <Card.Content className="p-3">
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-medium text-foreground leading-tight">
            {prospect.firstName} {prospect.lastName}
          </p>
          <div className="flex shrink-0 -mt-0.5 -mr-0.5">
            {onEdit && (
              <span onPointerDown={e => e.stopPropagation()}>
                <Button
                  size="sm"
                  variant="ghost"
                  isIconOnly
                  aria-label="Edit prospect"
                  onPress={() => onEdit()}
                >
                  <Pencil className="size-3" />
                </Button>
              </span>
            )}
            {onReject && !isTerminal && (
              <span onPointerDown={e => e.stopPropagation()}>
                <Button
                  size="sm"
                  variant="ghost"
                  isIconOnly
                  color="danger"
                  aria-label="Stop process"
                  onPress={() => onReject()}
                >
                  <XCircle className="size-3" />
                </Button>
              </span>
            )}
          </div>
        </div>

        {prospect.position && (
          <p className="text-xs text-muted mt-0.5 line-clamp-1">{prospect.position}</p>
        )}

        <Chip
          size="sm"
          variant="soft"
          color={statusColor[prospect.status] ?? 'default'}
          className="mt-2"
        >
          {statusLabel[prospect.status] ?? prospect.status}
        </Chip>

        {/* Screening: Coordinate Interview (internal RH) */}
        {onCoordinateInterview && prospect.status === 'contacted' && (
          <span onPointerDown={e => e.stopPropagation()} className="mt-2 block">
            <Button
              size="sm"
              color="primary"
              variant="flat"
              startContent={<Calendar className="size-3" />}
              onPress={() => onCoordinateInterview()}
              className="w-full text-xs"
            >
              Coordinate Interview
            </Button>
          </span>
        )}

        {/* Company Review: Send Resume */}
        {onSendResume && prospect.status === 'interview' && (
          <span onPointerDown={e => e.stopPropagation()} className="mt-2 block">
            <Button
              size="sm"
              color="primary"
              variant="flat"
              startContent={<Send className="size-3" />}
              onPress={() => onSendResume()}
              className="w-full text-xs"
            >
              Send Resume
            </Button>
          </span>
        )}

        {/* Client Interview: Coordinate Interview with Company */}
        {onCoordinateClientInterview && prospect.status === 'client_review' && (
          <span onPointerDown={e => e.stopPropagation()} className="mt-2 block">
            <Button
              size="sm"
              color="accent"
              variant="flat"
              startContent={<Building2 className="size-3" />}
              onPress={() => onCoordinateClientInterview()}
              className="w-full text-xs"
            >
              Interview w/ Company
            </Button>
          </span>
        )}

        {/* Contract & Hire: Promote to Hero */}
        {onPromote && prospect.status === 'contract' && (
          <span onPointerDown={e => e.stopPropagation()} className="mt-2 block">
            <Button
              size="sm"
              color="success"
              variant="flat"
              startContent={<Star className="size-3" />}
              onPress={() => onPromote()}
              className="w-full text-xs"
            >
              Promote to Hero
            </Button>
          </span>
        )}
      </Card.Content>
    </Card>
  )
}
