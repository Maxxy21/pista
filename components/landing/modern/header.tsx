'use client'

import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button-modern'
import { Container } from '@/components/ui/container'
import { HStack } from '@/components/ui/stack'
import { Typography } from '@/components/ui/typography'
import LogoIcon from '@/components/ui/logo-icon'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const Header = () => {
  const { data: session, status } = useSession()
  const isSignedIn = status === 'authenticated' && session
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <LogoIcon />
            <Typography variant="h5" className="text-gradient font-bold">
              Pista
            </Typography>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="#features" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </Link>
            <Link 
              href="#pricing" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop CTA */}
          <HStack gap="sm" className="hidden md:flex">
            <Link href={isSignedIn ? "/dashboard" : "/auth/sign-in"}>
              <Button variant="ghost" size="sm">
                {isSignedIn ? "Dashboard" : "Sign In"}
              </Button>
            </Link>
            <Link href={isSignedIn ? "/dashboard" : "/auth/sign-up"}>
              <Button size="sm" animation="bounce">
                {isSignedIn ? "Go to App" : "Get Started"}
              </Button>
            </Link>
          </HStack>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="#features" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#how-it-works" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it Works
              </Link>
              <Link 
                href="#pricing" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Link href={isSignedIn ? "/dashboard" : "/auth/sign-in"}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    {isSignedIn ? "Dashboard" : "Sign In"}
                  </Button>
                </Link>
                <Link href={isSignedIn ? "/dashboard" : "/auth/sign-up"}>
                  <Button size="sm" className="w-full">
                    {isSignedIn ? "Go to App" : "Get Started"}
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  )
}

export default Header