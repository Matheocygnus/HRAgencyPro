import { useNavigate } from '@tanstack/react-router'
import { ShieldOff, ArrowLeft } from 'lucide-react'
import { Button } from '@heroui/react'

interface AccessDeniedProps {
  message?: string
}

export function AccessDenied({ message }: AccessDeniedProps) {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
        <ShieldOff className="size-8" />
      </div>
      <div className="max-w-sm">
        <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
        <p className="mt-2 text-sm text-muted">
          {message ?? "You don't have permission to view this page."}
        </p>
      </div>
      <Button
        variant="flat"
        startContent={<ArrowLeft className="size-4" />}
        onPress={() => void navigate({ to: '/dashboard' })}
      >
        Back to Dashboard
      </Button>
    </div>
  )
}
