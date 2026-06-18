import { Link } from '@tanstack/react-router'
import { usePermissions } from '../../features/auth/use-permissions'
import { navigationItems } from '../../config/navigation'

export function Sidebar() {
  const { can } = usePermissions()
  const visibleItems = navigationItems.filter((item) => can(item.permission))

  return (
    <aside className="sidebar">
      {/* HeroUI Pro Sidebar — pending license setup */}
      <nav>
        <ul>
          {visibleItems.map((item) => (
            <li key={item.to}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
