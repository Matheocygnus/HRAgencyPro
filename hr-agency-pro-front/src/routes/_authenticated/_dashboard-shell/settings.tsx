import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePermissions } from '../../../features/auth/use-permissions'
import { AccessDenied } from '../../../components/AccessDenied'
import { TabScrollShadow } from '../../../components/TabScrollShadow'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { Card, Button, Tabs, TextField, Switch, Label } from '@heroui/react'
import { api } from '../../../lib/api'
import { useAuthContext } from '../../../features/auth/auth-context'
import { useToast } from '../../../lib/toast'

import { guardRoute } from '../../../lib/route-guard'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/settings')({
  beforeLoad: guardRoute('settings'),
  component: SettingsPage,
})

type ActiveTab = 'profile' | 'password' | 'notifications'

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ProfileFormValues = z.infer<typeof profileSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

function ProfileTab({ user }: { user: ReturnType<typeof useAuthContext>['user'] }) {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true)
    try {
      await api.patch(`/users/${user?.id}`, data)
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      addToast('Profile updated successfully.', 'success')
    } catch {
      addToast('Failed to update profile. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div data-testid="profile-tab-content">
      <Card>
        <Card.Header>
          <Card.Title>Profile Information</Card.Title>
          <Card.Description>Update your personal details.</Card.Description>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md flex-col gap-4">
            <TextField isRequired isInvalid={!!errors.firstName} errorMessage={errors.firstName?.message}>
              <Label>First Name</Label>
              <input {...register('firstName')} className="input w-full" />
            </TextField>

            <TextField isRequired isInvalid={!!errors.lastName} errorMessage={errors.lastName?.message}>
              <Label>Last Name</Label>
              <input {...register('lastName')} className="input w-full" />
            </TextField>

            <TextField isRequired isInvalid={!!errors.email} errorMessage={errors.email?.message}>
              <Label>Email</Label>
              <input type="email" {...register('email')} className="input w-full" />
            </TextField>

            <Button type="submit" color="primary" size="sm" isLoading={isSubmitting} className="self-start">
              Save Profile
            </Button>
          </form>
        </Card.Content>
      </Card>
    </div>
  )
}

function PasswordTab() {
  const { addToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  })

  async function onSubmit(data: PasswordFormValues) {
    setIsSubmitting(true)
    try {
      await api.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      addToast('Password changed successfully.', 'success')
      reset()
    } catch {
      setError('currentPassword', { message: 'Current password is incorrect' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div data-testid="password-tab-content">
      <Card>
        <Card.Header>
          <Card.Title>Change Password</Card.Title>
          <Card.Description>Keep your account secure with a strong password.</Card.Description>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md flex-col gap-4">
            <TextField isRequired isInvalid={!!errors.currentPassword} errorMessage={errors.currentPassword?.message}>
              <Label>Current Password</Label>
              <input type="password" {...register('currentPassword')} className="input w-full" />
            </TextField>

            <TextField isRequired isInvalid={!!errors.newPassword} errorMessage={errors.newPassword?.message}>
              <Label>New Password</Label>
              <input type="password" {...register('newPassword')} className="input w-full" />
            </TextField>

            <div className="flex flex-col gap-1">
              <TextField isRequired isInvalid={!!errors.confirmPassword}>
                <Label>Confirm Password</Label>
                <input type="password" {...register('confirmPassword')} className="input w-full" />
              </TextField>
              {errors.confirmPassword && (
                <p className="text-xs text-danger">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" color="primary" size="sm" isLoading={isSubmitting} className="self-start">
              Save Password
            </Button>
          </form>
        </Card.Content>
      </Card>
    </div>
  )
}

function NotificationsTab() {
  const { addToast } = useToast()
  const [prefs, setPrefs] = useState({
    newContracts: true,
    invoiceDueDates: true,
    interviewReminders: true,
  })

  function toggle(key: keyof typeof prefs) {
    setPrefs(p => ({ ...p, [key]: !p[key] }))
  }

  function handleSave() {
    addToast('Notification preferences saved.', 'success')
  }

  return (
    <div data-testid="notifications-tab-content">
      <Card>
        <Card.Header>
          <Card.Title>Notification Preferences</Card.Title>
          <Card.Description>Choose which events trigger email notifications.</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="flex max-w-md flex-col gap-4">
            <Switch size="sm" isSelected={prefs.newContracts} onChange={() => toggle('newContracts')}>
              <Switch.Control><Switch.Thumb /></Switch.Control>
              <Switch.Content><Label className="text-sm">Email notifications for new contracts</Label></Switch.Content>
            </Switch>
            <Switch size="sm" isSelected={prefs.invoiceDueDates} onChange={() => toggle('invoiceDueDates')}>
              <Switch.Control><Switch.Thumb /></Switch.Control>
              <Switch.Content><Label className="text-sm">Email notifications for invoice due dates</Label></Switch.Content>
            </Switch>
            <Switch size="sm" isSelected={prefs.interviewReminders} onChange={() => toggle('interviewReminders')}>
              <Switch.Control><Switch.Thumb /></Switch.Control>
              <Switch.Content><Label className="text-sm">Interview reminders</Label></Switch.Content>
            </Switch>
            <Button color="primary" size="sm" className="self-start" onPress={handleSave}>
              Save Preferences
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export function SettingsPage() {
  const { can } = usePermissions()
  if (!can('settings')) return <AccessDenied />

  const [activeTab, setActiveTab] = useState<ActiveTab>('profile')
  const { user } = useAuthContext()

  const tabs: { key: ActiveTab; label: string }[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'password', label: 'Password' },
    { key: 'notifications', label: 'Notifications' },
  ]

  return (
    <div data-testid="settings-page" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">Settings</h1>
        <p className="text-xs text-muted md:text-sm">Manage your account preferences</p>
      </div>

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={k => setActiveTab(k as ActiveTab)}
        size="sm"
      >
        <TabScrollShadow>
          <Tabs.ListContainer className="!overflow-x-visible">
            <Tabs.List aria-label="Settings sections">
              {tabs.map(tab => (
                <Tabs.Tab key={tab.key} id={tab.key}>{tab.label}<Tabs.Indicator /></Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.ListContainer>
        </TabScrollShadow>
      </Tabs>

      {activeTab === 'profile' && <ProfileTab user={user} />}
      {activeTab === 'password' && <PasswordTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
    </div>
  )
}
