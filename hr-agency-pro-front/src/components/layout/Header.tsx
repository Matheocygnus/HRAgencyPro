import { useAuth } from '../../features/auth/use-auth'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="header">
      {/* HeroUI Pro Header — pending license setup */}
      <div>
        <span>{user?.email}</span>
        <button type="button" onClick={() => void logout()}>
          Logout
        </button>
      </div>
    </header>
  )
}
