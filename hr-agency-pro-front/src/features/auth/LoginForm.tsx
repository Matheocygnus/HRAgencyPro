import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Card, Button, Label, TextField } from '@heroui/react'
import { useAuth } from './use-auth'
import { getRoleLanding } from '../../lib/role-landing'
import type { User } from './auth-context'

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      // Fetch fresh user so we can read up-to-date permissions for role landing
      const freshUser = await queryClient.fetchQuery<User | null>({
        queryKey: ['auth', 'me'],
      })
      const landing = getRoleLanding(freshUser?.permissions ?? [])
      await navigate({ to: landing })
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 401) {
        setError('root', { message: 'Invalid email or password' })
      } else {
        setError('root', { message: 'An error occurred. Please try again.' })
      }
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <Card.Header className="items-center text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <span className="text-xl font-bold text-primary-foreground">H</span>
        </div>
        <Card.Title className="text-2xl">HR Agency Pro</Card.Title>
        <Card.Description>Sign in to your account</Card.Description>
      </Card.Header>
      <Card.Content>
        <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4"
          >
            <TextField isInvalid={!!errors.username}>
              <Label htmlFor="username">Username</Label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                {...register('username')}
                className="input w-full"
              />
              {errors.username && (
                <span role="alert" className="text-xs text-danger">
                  {errors.username.message}
                </span>
              )}
            </TextField>

            <TextField isInvalid={!!errors.password}>
              <Label htmlFor="password">Password</Label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className="input w-full"
              />
              {errors.password && (
                <span role="alert" className="text-xs text-danger">
                  {errors.password.message}
                </span>
              )}
            </TextField>

            {errors.root && (
              <div
                role="alert"
                className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger border border-danger/20"
              >
                {errors.root.message}
              </div>
            )}

            <Button
              type="submit"
              color="accent"
              className="w-full mt-2"
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
      </Card.Content>
    </Card>
  )
}
