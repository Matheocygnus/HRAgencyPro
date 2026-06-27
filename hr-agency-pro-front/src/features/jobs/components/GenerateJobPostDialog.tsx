import { useState, useEffect } from 'react'
import { Modal, Button, Spinner } from '@heroui/react'
import { Sparkles } from 'lucide-react'

interface EnhanceJobPostDialogProps {
  open: boolean
  onClose: () => void
  onPublish: (data: { title: string; description: string }) => void
  requestTitle: string
  enhancedText: string | null
  isEnhancing: boolean
  debugError?: string
}

export function GenerateJobPostDialog({
  open,
  onClose,
  onPublish,
  requestTitle,
  enhancedText,
  isEnhancing,
  debugError,
}: EnhanceJobPostDialogProps) {
  const [editedText, setEditedText] = useState('')

  useEffect(() => {
    if (enhancedText) setEditedText(enhancedText)
  }, [enhancedText])

  function handleClose() {
    setEditedText('')
    onClose()
  }

  function handlePublish() {
    onPublish({ title: requestTitle, description: editedText })
    setEditedText('')
    onClose()
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose() }}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-2xl" aria-label="Enhance with AI">
          <Modal.Header>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <Modal.Heading>Enhance with AI — {requestTitle}</Modal.Heading>
            </div>
          </Modal.Header>
          <Modal.Body>
            {isEnhancing ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <Spinner size="lg" />
                <p className="text-sm text-muted">Enhancing job post with Gemini AI...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {debugError && (
                  <div className="max-h-32 overflow-y-auto rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
                    <p className="mb-1 font-semibold">⚠️ AI error — showing raw content.</p>
                    <code className="whitespace-pre-wrap break-all font-mono">{debugError}</code>
                  </div>
                )}
                <p className="text-xs text-muted">
                  {debugError ? 'Fix the error above and retry, or edit and publish the raw content.' : 'Review and edit the AI-enhanced content. Once published it will appear on the public careers page.'}
                </p>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={18}
                  className="w-full rounded-lg border border-default bg-background p-3 font-mono text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                  placeholder="Enhanced job post will appear here..."
                />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onPress={handleClose}>Cancel</Button>
            {!isEnhancing && (
              <Button
                color="primary"
                isDisabled={!editedText.trim()}
                onPress={handlePublish}
                startContent={<Sparkles className="size-4" />}
              >
                Publish Job Post
              </Button>
            )}
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
