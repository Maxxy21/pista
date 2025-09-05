'use client'

import React from 'react'
import { Container } from '@/components/ui/container'
import { VStack, HStack } from '@/components/ui/stack'
import { Typography, Text, Heading } from '@/components/ui/typography'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card-new'
import { 
  Brain, 
  Zap, 
  Target, 
  FileText, 
  TrendingUp, 
  Shield,
  Clock,
  BarChart3,
  Users
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning algorithms analyze every aspect of your pitch, from content structure to visual design.",
    color: "bg-primary-50 text-primary-600"
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get detailed analysis in seconds, not days. Upload your pitch deck and receive comprehensive feedback immediately.",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: Target,
    title: "Industry-Specific Insights",
    description: "Tailored recommendations based on your industry, target market, and funding stage for maximum relevance.",
    color: "bg-green-50 text-green-600"
  },
  {
    icon: FileText,
    title: "Detailed Reports",
    description: "Comprehensive analysis covering story flow, financial projections, market validation, and presentation design.",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: TrendingUp,
    title: "Success Tracking",
    description: "Monitor your pitch improvements over time and track success rates across different versions.",
    color: "bg-purple-50 text-purple-600"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Enterprise-grade security ensures your sensitive pitch information remains completely confidential.",
    color: "bg-red-50 text-red-600"
  }
]

const stats = [
  {
    icon: Users,
    value: "2,000+",
    label: "Startups Analyzed"
  },
  {
    icon: TrendingUp,
    value: "94%",
    label: "Success Rate"
  },
  {
    icon: Clock,
    value: "< 30s",
    label: "Analysis Time"
  },
  {
    icon: BarChart3,
    value: "40%",
    label: "Avg. Score Improvement"
  }
]

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-32">
      <Container size="lg">
        <VStack gap="xl">
          
          {/* Header */}
          <VStack gap="md" align="center" className="text-center max-w-3xl mx-auto">
            <Heading level={2}>
              Transform Your Pitch with AI
            </Heading>
            <Text variant="lead" className="text-muted-foreground">
              Our advanced AI system provides comprehensive analysis and actionable insights 
              to help you create a pitch deck that resonates with investors and secures funding.
            </Text>
          </VStack>

          {/* Stats Bar */}
          <Card variant="gradient" className="w-full">
            <CardContent className="py-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <VStack key={index} align="center" gap="sm" className="text-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Typography variant="h3" className="text-white">
                        {stat.value}
                      </Typography>
                      <Text variant="small" className="text-white/80">
                        {stat.label}
                      </Text>
                    </div>
                  </VStack>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                variant="elevated" 
                hover="lift"
                className="group cursor-pointer"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <Card variant="outline" className="w-full max-w-4xl mx-auto">
            <CardContent className="py-8 text-center">
              <VStack gap="md">
                <VStack gap="sm">
                  <Heading level={3}>
                    Ready to analyze your pitch?
                  </Heading>
                  <Text variant="body-lg" className="text-muted-foreground">
                    Join thousands of successful startups who have improved their pitch decks with Pista.
                  </Text>
                </VStack>
                
                <HStack gap="sm" justify="center" className="pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 border-2 border-background flex items-center justify-center text-white text-xs font-semibold"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <Text variant="small" className="text-muted-foreground">
                    Trusted by 2,000+ founders
                  </Text>
                </HStack>
              </VStack>
            </CardContent>
          </Card>
        </VStack>
      </Container>
    </section>
  )
}

export default Features