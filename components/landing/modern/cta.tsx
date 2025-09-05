'use client'

import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Container } from '@/components/ui/container'
import { VStack, HStack } from '@/components/ui/stack'
import { Typography, Text, Heading } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card-new'
import { Button } from '@/components/ui/button-new'
import { 
  ArrowRight, 
  Star, 
  Zap,
  Shield,
  Clock
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    text: "Instant Analysis"
  },
  {
    icon: Shield,
    text: "100% Secure"
  },
  {
    icon: Clock,
    text: "30-Second Results"
  }
]

const CTA = () => {
  const { data: session, status } = useSession()
  const isSignedIn = status === 'authenticated' && session

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-96 bg-gradient-to-r from-primary-500/10 via-primary-400/5 to-primary-600/10 rounded-full blur-3xl" />
      </div>

      <Container size="lg">
        <Card 
          variant="elevated" 
          hover="glow"
          className="relative overflow-hidden shadow-2xl"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
          
          <CardContent className="relative py-16 md:py-20 text-center">
            <Container size="sm">
              <VStack gap="lg">
                
                {/* Content */}
                <VStack gap="md">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium">
                    <Star className="w-4 h-4 mr-2 fill-current" />
                    Join 2,000+ Successful Startups
                  </div>
                  
                  <Heading level={1} className="text-white max-w-3xl">
                    Ready to Perfect Your Pitch?
                  </Heading>
                  
                  <Text variant="lead" className="text-white/90 max-w-2xl">
                    Don't leave your funding to chance. Get expert AI-powered analysis 
                    and transform your pitch deck into a compelling story that investors can't ignore.
                  </Text>
                </VStack>

                {/* Features */}
                <HStack gap="lg" justify="center" wrap="wrap" className="py-4">
                  {features.map((feature, index) => (
                    <HStack key={index} gap="sm" className="text-white/90 text-sm">
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                        <feature.icon className="w-3 h-3" />
                      </div>
                      {feature.text}
                    </HStack>
                  ))}
                </HStack>

                {/* CTA Buttons */}
                <VStack gap="sm" className="pt-4">
                  <HStack gap="sm" justify="center" wrap="wrap">
                    <Link href={isSignedIn ? "/dashboard" : "/auth/sign-up"}>
                      <Button 
                        variant="secondary" 
                        size="xl" 
                        animation="bounce" 
                        className="gap-2 shadow-xl"
                      >
                        {isSignedIn ? "Go to Dashboard" : "Start Free Analysis"}
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                    
                    {!isSignedIn && (
                      <Link href="/auth/sign-in">
                        <Button 
                          variant="ghost" 
                          size="xl" 
                          className="text-white border-white/20 hover:bg-white/10"
                        >
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </HStack>
                  
                  <Text variant="small" className="text-white/70">
                    No credit card required • Free analysis included • Cancel anytime
                  </Text>
                </VStack>

                {/* Testimonial */}
                <Card variant="glass" className="max-w-lg mx-auto mt-8">
                  <CardContent className="py-6">
                    <VStack gap="sm">
                      <HStack gap="xs" justify="center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </HStack>
                      <Text variant="body-sm" className="text-white/90 italic">
                        "Pista helped us identify critical gaps in our pitch. We closed our Series A in 3 weeks!"
                      </Text>
                      <Text variant="small" className="text-white/70">
                        — Sarah Chen, Founder at TechFlow
                      </Text>
                    </VStack>
                  </CardContent>
                </Card>
              </VStack>
            </Container>
          </CardContent>
        </Card>
      </Container>
    </section>
  )
}

export default CTA