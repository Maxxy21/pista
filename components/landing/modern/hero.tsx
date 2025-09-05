'use client'

import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Button } from '@/components/ui/button-new'
import { Container } from '@/components/ui/container'
import { VStack, HStack } from '@/components/ui/stack'
import { Typography, Text } from '@/components/ui/typography'
import { Card } from '@/components/ui/card-new'
import { ArrowRight, Play, Star, Users, TrendingUp } from 'lucide-react'

const Hero = () => {
  const { data: session, status } = useSession()
  const isSignedIn = status === 'authenticated' && session

  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-primary-500/10 via-primary-400/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-l from-primary-600/5 to-transparent rounded-full blur-3xl" />
      </div>

      <Container size="lg">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Content */}
          <VStack gap="lg" className="text-center lg:text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium">
              <Star className="w-4 h-4 mr-2 fill-current" />
              AI-Powered Pitch Analysis
            </div>

            {/* Main Heading */}
            <VStack gap="md">
              <Typography variant="display-lg" className="max-w-3xl">
                Perfect Your{' '}
                <span className="text-gradient">Startup Pitch</span>
                {' '}with AI
              </Typography>
              
              <Text variant="lead" className="max-w-2xl text-muted-foreground">
                Get instant, expert-level feedback on your pitch deck from our advanced AI system. 
                Identify strengths, fix weaknesses, and secure funding with confidence.
              </Text>
            </VStack>

            {/* CTA Buttons */}
            <HStack gap="sm" justify="center" className="lg:justify-start">
              <Link href={isSignedIn ? "/dashboard" : "/auth/sign-up"}>
                <Button size="lg" animation="bounce" className="gap-2">
                  {isSignedIn ? "Go to Dashboard" : "Start Free Analysis"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              
              <Button variant="ghost" size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </HStack>

            {/* Social Proof */}
            <HStack gap="lg" justify="center" className="lg:justify-start pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>2,000+ startups</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>94% success rate</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span>4.9/5 rating</span>
              </div>
            </HStack>
          </VStack>

          {/* Visual */}
          <div className="relative">
            {/* Main Dashboard Preview */}
            <Card 
              variant="elevated" 
              hover="glow" 
              className="relative overflow-hidden shadow-2xl"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src="/dashboard-preview.png"
                  alt="Pista Dashboard Preview"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </Card>

            {/* Floating Elements */}
            <Card 
              variant="glass" 
              padding="sm" 
              className="absolute -top-4 -left-4 flex items-center gap-2 text-sm font-medium"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Analysis
            </Card>

            <Card 
              variant="glass" 
              padding="sm" 
              className="absolute -bottom-4 -right-4 flex items-center gap-2 text-sm font-medium"
            >
              <TrendingUp className="w-4 h-4 text-primary" />
              +40% Success Rate
            </Card>

            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full opacity-20 blur-xl" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-r from-primary-300 to-primary-500 rounded-full opacity-10 blur-2xl" />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Hero