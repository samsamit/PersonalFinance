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
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react'
import { useTheme } from 'next-themes'

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
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </Button>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <div
        className={cn(
          'fixed md:sticky top-0 bottom-0 left-0 z-40 md:z-0',
          'flex flex-col border-r bg-background transition-all duration-300',
          'w-[240px] md:w-[200px]',
          'md:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed && 'md:w-[50px]'
        )}
      >
        <div className="flex items-center justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex"
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

        {/* Theme Toggle at Bottom */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'w-full justify-center',
              !isCollapsed && 'justify-start px-4'
            )}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            {!isCollapsed && <span className="ml-2">Toggle theme</span>}
          </Button>
        </div>
      </div>
    </>
  )
} 