'use client'

import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { HStack, VStack } from '@/components/ui/stack'
import { Typography, Text } from '@/components/ui/typography'
import LogoIcon from '@/components/ui/logo-icon'
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  ExternalLink
} from 'lucide-react'

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "API", href: "/docs" }
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" }
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Security", href: "/security" }
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Documentation", href: "/docs" },
    { name: "Status", href: "/status" },
    { name: "Community", href: "/community" }
  ]
}

const socialLinks = [
  {
    name: "Twitter",
    href: "https://twitter.com/pista_ai",
    icon: Twitter
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/pista-ai",
    icon: Linkedin
  },
  {
    name: "GitHub",
    href: "https://github.com/pista-ai",
    icon: Github
  },
  {
    name: "Email",
    href: "mailto:hello@pista.ai",
    icon: Mail
  }
]

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <Container size="lg">
        
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            
            {/* Brand Section */}
            <div className="col-span-2">
              <VStack gap="md">
                <Link href="/" className="flex items-center space-x-2">
                  <LogoIcon />
                  <Typography variant="h5" className="text-gradient font-bold">
                    Pista
                  </Typography>
                </Link>
                
                <Text variant="body-sm" className="text-muted-foreground max-w-sm">
                  AI-powered pitch analysis for startups. Transform your pitch deck 
                  and increase your chances of securing funding.
                </Text>
                
                <HStack gap="sm">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.name}
                      href={social.href}
                      className="w-8 h-8 rounded-lg bg-muted hover:bg-muted-foreground/20 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <social.icon className="w-4 h-4" />
                    </Link>
                  ))}
                </HStack>
              </VStack>
            </div>

            {/* Product Links */}
            <div>
              <VStack gap="sm">
                <Typography variant="h6" className="font-semibold">
                  Product
                </Typography>
                <VStack gap="xs">
                  {footerLinks.product.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </VStack>
              </VStack>
            </div>

            {/* Company Links */}
            <div>
              <VStack gap="sm">
                <Typography variant="h6" className="font-semibold">
                  Company
                </Typography>
                <VStack gap="xs">
                  {footerLinks.company.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </VStack>
              </VStack>
            </div>

            {/* Support Links */}
            <div>
              <VStack gap="sm">
                <Typography variant="h6" className="font-semibold">
                  Support
                </Typography>
                <VStack gap="xs">
                  {footerLinks.support.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      {link.name}
                      {link.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3" />
                      )}
                    </Link>
                  ))}
                </VStack>
              </VStack>
            </div>

            {/* Legal Links */}
            <div>
              <VStack gap="sm">
                <Typography variant="h6" className="font-semibold">
                  Legal
                </Typography>
                <VStack gap="xs">
                  {footerLinks.legal.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </VStack>
              </VStack>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Text variant="small" className="text-muted-foreground">
              © {new Date().getFullYear()} Pista. All rights reserved.
            </Text>
            
            <HStack gap="md" className="text-sm text-muted-foreground">
              <Text variant="small">
                Made with ❤️ by{' '}
                <Link 
                  href="https://maxwellaboagye.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Maxwell Aboagye
                </Link>
              </Text>
              <span>•</span>
              <Text variant="small">
                Powered by AI
              </Text>
            </HStack>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer