import { Modal, Button } from '@heroui/react'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  title?: string
  description?: string
  confirmLabel?: string
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export function ConfirmDialog({
  open,
  title = 'Confirm deletion',
  description = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  onClose,
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal.Backdrop isOpen={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <Modal.Container size="sm">
        <Modal.Dialog aria-label={title}>
          {({ close }) => (
            <>
              <Modal.Header>
                <AlertTriangle className="size-4 text-danger" />
                <Modal.Heading>{title}</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-sm text-muted">{description}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" size="sm" onPress={close}>
                  Cancel
                </Button>
                <Button
                  className="bg-danger text-white hover:bg-danger/90"
                  size="sm"
                  isLoading={isLoading}
                  onPress={() => { onConfirm(); close() }}
                >
                  {confirmLabel}
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
