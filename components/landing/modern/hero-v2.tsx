'use client'

import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button-modern'
import { Container } from '@/components/ui/container'
import { VStack, HStack } from '@/components/ui/stack'
import { Typography } from '@/components/ui/typography'
import { Card } from '@/components/ui/card-modern'
import { ArrowRight, Play, Star, Users, TrendingUp, Sparkles } from 'lucide-react'

const Hero = () => {
  const { data: session, status } = useSession()
  const isSignedIn = status === 'authenticated' && session

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-primary-50/50 to-gray-50">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-primary-100/20 via-transparent to-primary-200/20 rounded-full blur-3xl" />
      </div>

      <Container size="xl" className="py-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Content */}
          <VStack gap="xl" className="text-center lg:text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 border border-primary-200 text-primary-700 text-sm font-medium shadow-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Pitch Analysis
            </div>

            {/* Main Heading */}
            <VStack gap="md">
              <Typography variant="display-lg" className="max-w-4xl leading-tight">
                Perfect Your{' '}
                <span className="text-gradient">Startup Pitch</span>
                {' '}with AI
              </Typography>
              
              <Typography variant="lead" className="max-w-2xl text-gray-600">
                A bachelor thesis project demonstrating AI-powered analysis of startup pitch decks. 
                Explore automated feedback systems and pitch evaluation methodologies.
              </Typography>
            </VStack>

            {/* CTA Buttons */}
            <HStack gap="sm" justify="center" className="lg:justify-start pt-4">
              <Link href={isSignedIn ? "/dashboard" : "/auth/sign-up"}>
                <Button 
                  variant="gradient" 
                  size="xl" 
                  animation="bounce" 
                  className="gap-2 shadow-xl"
                >
                  {isSignedIn ? "Go to Dashboard" : "Try Demo"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="xl" 
                className="gap-2 hover:bg-gray-50"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </HStack>

            {/* Academic Context */}
            <HStack gap="lg" justify="center" className="lg:justify-start pt-6">
              <HStack gap="sm" className="text-sm text-gray-600">
                <Users className="w-4 h-4 text-primary-600" />
                <span>Bachelor Thesis</span>
              </HStack>
              <HStack gap="sm" className="text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 text-primary-600" />
                <span>AI Research</span>
              </HStack>
              <HStack gap="sm" className="text-sm text-gray-600">
                <Star className="w-4 h-4 fill-primary text-primary-600" />
                <span>Demo Project</span>
              </HStack>
            </HStack>
          </VStack>

          {/* Visual */}
          <div className="relative">
            {/* Main Dashboard Preview */}
            <Card 
              variant="elevated" 
              hover="lift" 
              className="relative overflow-hidden shadow-2xl border-primary-100"
            >
              <div className="aspect-[4/3] relative bg-gradient-to-br from-primary-50 to-gray-50 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-primary-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <Typography variant="h4" className="text-gray-800 mb-2">
                    Dashboard Preview
                  </Typography>
                  <Typography variant="body-sm" className="text-gray-600">
                    Interactive pitch analysis coming soon
                  </Typography>
                </div>
              </div>
            </Card>

            {/* Floating Elements */}
            <Card 
              variant="glass" 
              padding="sm" 
              className="absolute -top-4 -left-4 animate-slide-up"
            >
              <HStack gap="sm" className="text-sm font-medium text-gray-700">
                <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                Live Analysis
              </HStack>
            </Card>

            <Card 
              variant="glass" 
              padding="sm" 
              className="absolute -bottom-4 -right-4 animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <HStack gap="sm" className="text-sm font-medium text-gray-700">
                <TrendingUp className="w-4 h-4 text-primary-600" />
                +40% Success Rate
              </HStack>
            </Card>

            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full opacity-20 blur-xl animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-r from-primary-300 to-primary-500 rounded-full opacity-10 blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Hero