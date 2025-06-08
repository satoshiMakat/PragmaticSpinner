'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Menu,
  Home
} from 'lucide-react'

export default function Header() {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-800/20 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              GameSite
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/" 
            className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <Home className="h-4 w-4" />
            Ana Sayfa
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-300 hover:text-blue-500"
              >
                Giriş Yap
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Kayıt Ol
              </Button>
            </div>

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700 md:hidden">
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-slate-700">
                Ana Sayfa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}