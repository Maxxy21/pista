'use client'

import React from 'react'
import { Container } from '@/components/ui/container'
import { VStack, HStack } from '@/components/ui/stack'
import { Typography } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card-modern'
import { 
  Brain, 
  FileText, 
  BarChart3, 
  Target, 
  Clock, 
  Shield,
  Sparkles,
  CheckCircle2
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced AI evaluates your pitch across multiple dimensions including clarity, market opportunity, and investor appeal.",
    benefits: ["Deep content analysis", "Competitive insights", "Market validation"]
  },
  {
    icon: FileText,
    title: "Instant Feedback",
    description: "Get comprehensive feedback in seconds, not weeks. Our AI provides actionable insights to improve your pitch immediately.",
    benefits: ["Real-time scoring", "Detailed recommendations", "Industry benchmarks"]
  },
  {
    icon: BarChart3,
    title: "Performance Metrics",
    description: "Track your pitch performance with detailed analytics and see how you compare against successful funding rounds.",
    benefits: ["Success probability", "Weakness identification", "Improvement tracking"]
  },
  {
    icon: Target,
    title: "Investor Matching",
    description: "Match your startup with the right investors based on your industry, stage, and pitch quality.",
    benefits: ["Curated investor list", "Match scoring", "Introduction assistance"]
  },
  {
    icon: Clock,
    title: "Time Efficient",
    description: "Save weeks of preparation time with instant analysis and focused improvement recommendations.",
    benefits: ["Quick iterations", "Priority focus", "Faster funding"]
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your sensitive business information is protected with enterprise-grade security and privacy measures.",
    benefits: ["End-to-end encryption", "Private analysis", "Secure storage"]
  }
]

const Features = () => {
  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-50/80 rounded-full blur-3xl" />
      </div>

      <Container size="xl">
        <VStack gap="xl">
          
          {/* Section Header */}
          <VStack gap="md" className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 border border-primary-200 text-primary-700 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Powerful Features
            </div>
            
            <Typography variant="display-lg" className="text-gray-900">
              Everything you need to{' '}
              <span className="text-gradient">perfect your pitch</span>
            </Typography>
            
            <Typography variant="lead" className="text-gray-600">
              This thesis project explores machine learning approaches to automated 
              startup pitch evaluation and feedback generation.
            </Typography>
          </VStack>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                variant="default" 
                hover="lift" 
                className="h-full border-gray-100 hover:border-primary-200 transition-all duration-300"
              >
                <CardContent className="p-8">
                  <VStack gap="lg">
                    
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary-600" />
                    </div>

                    {/* Content */}
                    <VStack gap="md">
                      <Typography variant="h4" className="text-gray-900">
                        {feature.title}
                      </Typography>
                      
                      <Typography variant="body-sm" className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </Typography>
                    </VStack>

                    {/* Benefits */}
                    <VStack gap="sm">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <HStack key={benefitIndex} gap="sm" align="center">
                          <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0" />
                          <Typography variant="small" className="text-gray-700">
                            {benefit}
                          </Typography>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <Card variant="gradient" className="max-w-4xl mx-auto">
            <CardContent className="p-12 text-center">
              <VStack gap="md">
                <Typography variant="h2" className="text-gray-900">
                  Explore the research
                </Typography>
                <Typography variant="lead" className="text-gray-700 max-w-2xl">
                  This project demonstrates practical applications of NLP and machine learning in startup ecosystem analysis.
                </Typography>
                <div className="pt-4">
                  <Typography variant="small" className="text-gray-600">
                    Academic research project • Thesis demonstration
                  </Typography>
                </div>
              </VStack>
            </CardContent>
          </Card>

        </VStack>
      </Container>
    </section>
  )
}

export default Features