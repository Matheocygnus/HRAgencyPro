import { useState } from 'react'
import { Modal, Button, Label } from '@heroui/react'
import type { Prospect } from '../../../types/prospect.types'

interface RejectProspectDialogProps {
  open: boolean
  prospect: Prospect | null
  onClose: () => void
  onConfirm: (reason: string) => Promise<void>
}

export function RejectProspectDialog({ open, prospect, onClose, onConfirm }: RejectProspectDialogProps) {
  const [reason, setReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    if (!reason.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      await onConfirm(reason.trim())
      setReason('')
      onClose()
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to reject prospect')
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    if (!isLoading) {
      setReason('')
      setError(null)
      onClose()
    }
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose() }}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md" aria-label="Stop Selection Process">
          <Modal.Header>
            <Modal.Heading>Stop Selection Process</Modal.Heading>
            {prospect && (
              <p className="mt-1 text-sm text-muted">
                {prospect.firstName} {prospect.lastName}
              </p>
            )}
          </Modal.Header>

          <Modal.Body className="flex flex-col gap-4">
            {error && (
              <div className="rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</div>
            )}
            <p className="text-sm text-muted">
              This will mark the prospect as <strong>Rejected</strong> and save the reason in their history.
            </p>
            <div className="flex flex-col gap-1">
              <Label htmlFor="reject-reason">Reason for stopping</Label>
              <textarea
                id="reject-reason"
                placeholder="e.g. Skills did not match requirements"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-default-200 bg-default-100 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onPress={handleClose} isDisabled={isLoading}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleConfirm}
              isLoading={isLoading}
              isDisabled={!reason.trim()}
            >
              Stop Process
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
