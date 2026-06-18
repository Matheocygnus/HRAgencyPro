import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'
import { useRouterState } from '@tanstack/react-router'
import { AppLayout, Navbar, Sidebar, useSidebar } from '@heroui-pro/react'
import { Avatar, Button } from '@heroui/react'
import {
  LayoutDashboard, Building2, User, UserSearch, Users, Database,
  Shield, Building, FileText, Receipt, Calendar, Briefcase,
  ClipboardList, UserCog, ShieldCheck, Settings,
} from 'lucide-react'
import { usePermissions } from '../../features/auth/use-permissions'
import { useAuth } from '../../features/auth/use-auth'
import { navigationItems } from '../../config/navigation'

export const Route = createFileRoute('/_authenticated/_dashboard-shell')({
  component: DashboardShell,
})

const ROUTE_ICONS: Record<string, React.ElementType> = {
  '/dashboard': LayoutDashboard,
  '/client-dashboard': Building2,
  '/hero-dashboard': User,
  '/prospect-dashboard': UserSearch,
  '/prospects': Users,
  '/prospect-database': Database,
  '/heroes': Shield,
  '/clients': Building,
  '/contracts': FileText,
  '/invoices': Receipt,
  '/interviews': Calendar,
  '/jobs': Briefcase,
  '/job-requests': ClipboardList,
  '/users': UserCog,
  '/roles': ShieldCheck,
  '/settings': Settings,
}

function SidebarContent({ currentPath }: { currentPath: string }) {
  const { can } = usePermissions()
  const { isOpen } = useSidebar()
  const visibleItems = navigationItems.filter(item => can(item.permission))

  return (
    <>
      <Sidebar>
        <Sidebar.Header className="px-3 py-3">
          <a
            href="/"
            className="flex items-center gap-2 overflow-hidden rounded-md transition-colors hover:text-[var(--accent)]"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-white">
              <span className="text-xs font-bold">H</span>
            </div>
            {isOpen && (
              <span className="truncate text-sm font-semibold text-foreground transition-colors hover:text-[var(--accent)]">
                HR Agency Pro
              </span>
            )}
          </a>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Menu aria-label="Main navigation">
            {visibleItems.map(item => {
              const Icon = ROUTE_ICONS[item.to] ?? LayoutDashboard
              return (
                <Sidebar.MenuItem
                  key={item.to}
                  href={item.to}
                  isCurrent={currentPath === item.to}
                  textValue={item.label}
                  tooltip={item.label}
                >
                  <Sidebar.MenuIcon><Icon className="size-4" /></Sidebar.MenuIcon>
                  <Sidebar.MenuLabel>{item.label}</Sidebar.MenuLabel>
                </Sidebar.MenuItem>
              )
            })}
          </Sidebar.Menu>
        </Sidebar.Content>
      </Sidebar>

      <Sidebar.Mobile>
        <Sidebar.Header className="px-3 py-3">
          <a href="/" className="flex items-center gap-2 rounded-md transition-colors hover:text-[var(--accent)]">
            <div className="flex size-7 items-center justify-center rounded-lg bg-[var(--accent)] text-white">
              <span className="text-xs font-bold">H</span>
            </div>
            <span className="text-sm font-semibold text-foreground transition-colors hover:text-[var(--accent)]">HR Agency Pro</span>
          </a>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Menu aria-label="Main navigation">
            {visibleItems.map(item => {
              const Icon = ROUTE_ICONS[item.to] ?? LayoutDashboard
              return (
                <Sidebar.MenuItem
                  key={item.to}
                  href={item.to}
                  isCurrent={currentPath === item.to}
                  textValue={item.label}
                >
                  <Sidebar.MenuIcon><Icon className="size-4" /></Sidebar.MenuIcon>
                  <Sidebar.MenuLabel>{item.label}</Sidebar.MenuLabel>
                </Sidebar.MenuItem>
              )
            })}
          </Sidebar.Menu>
        </Sidebar.Content>
      </Sidebar.Mobile>
    </>
  )
}

function DashboardShell() {
  const router = useRouter()
  const { location } = useRouterState()
  const { user, logout } = useAuth()
  const currentPath = location.pathname

  return (
    <AppLayout
      sidebarCollapsible="icon"
      navigate={(href) => void router.navigate({ to: href })}
      navbar={
        <Navbar maxWidth="full">
          <Navbar.Header>
            <AppLayout.MenuToggle />
            <Sidebar.Trigger />
            <Navbar.Spacer />
            <Navbar.Content className="gap-2 sm:gap-3">
              <Navbar.Item className="hidden sm:flex">
                <span className="cursor-default text-sm text-muted transition-colors hover:text-[var(--accent)]">
                  {user?.email}
                </span>
              </Navbar.Item>
              <Avatar size="sm">
                <Avatar.Fallback>
                  {user?.email?.[0]?.toUpperCase() ?? 'U'}
                </Avatar.Fallback>
              </Avatar>
              <Button
                size="sm"
                variant="flat"
                onPress={() => void logout()}
                className="transition-colors hover:text-[var(--accent)]"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </Navbar.Content>
          </Navbar.Header>
        </Navbar>
      }
      sidebar={<SidebarContent currentPath={currentPath} />}
    >
      <Outlet />
    </AppLayout>
  )
}
