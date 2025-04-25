import { ReactNode } from 'react'
import { Navbar } from './Navbar'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-4">
        {children}
      </main>
    </div>
  )
} 