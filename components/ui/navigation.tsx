'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './button'
import {
  ChevronRight,
  LayoutDashboard,
  FileSpreadsheet,
  Settings,
  Menu
} from 'lucide-react'

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isCollapsed: boolean
}

function NavItem({ href, icon, label, isCollapsed }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start gap-2',
          isCollapsed ? 'px-2' : 'px-4',
          isActive && 'bg-muted'
        )}
      >
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </Button>
    </Link>
  )
}

export function Navigation() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        'flex flex-col border-r bg-background h-screen sticky top-0 transition-all duration-300',
        isCollapsed ? 'w-[50px]' : 'w-[200px]'
      )}
    >
      <div className="flex items-center justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        <NavItem
          href="/"
          icon={<LayoutDashboard className="h-4 w-4" />}
          label="Dashboard"
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/bank-statements"
          icon={<FileSpreadsheet className="h-4 w-4" />}
          label="Bank Statements"
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/settings"
          icon={<Settings className="h-4 w-4" />}
          label="Settings"
          isCollapsed={isCollapsed}
        />
      </nav>
    </div>
  )
} 