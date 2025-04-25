import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-xl font-semibold hover:text-primary transition-colors"
        >
          Personal Finance
        </Link>
        <div className="flex items-center gap-4">
          {/* Add navigation items here as needed */}
        </div>
      </div>
    </nav>
  )
} 