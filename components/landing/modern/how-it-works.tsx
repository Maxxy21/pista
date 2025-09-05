'use client'

import React from 'react'
import { Container } from '@/components/ui/container'
import { VStack, HStack } from '@/components/ui/stack'
import { Typography, Text, Heading } from '@/components/ui/typography'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card-new'
import { Button } from '@/components/ui/button-new'
import { 
  Upload, 
  Brain, 
  FileText, 
  ArrowRight,
  CheckCircle,
  Clock,
  Download
} from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: Upload,
    title: "Upload Your Pitch",
    description: "Simply drag and drop your pitch deck PDF or upload slides directly to our secure platform.",
    details: [
      "Support for PDF, PPT, and PPTX files",
      "Secure, encrypted file handling",
      "Instant file processing"
    ]
  },
  {
    number: 2,
    icon: Brain,
    title: "AI Analysis",
    description: "Our advanced AI system analyzes every aspect of your pitch in under 30 seconds.",
    details: [
      "Content structure evaluation",
      "Visual design assessment", 
      "Market validation review"
    ]
  },
  {
    number: 3,
    icon: FileText,
    title: "Get Detailed Feedback",
    description: "Receive comprehensive insights with specific recommendations to improve your pitch.",
    details: [
      "Actionable improvement suggestions",
      "Industry-specific recommendations",
      "Scoring across multiple criteria"
    ]
  }
]

const benefits = [
  {
    icon: Clock,
    title: "Save Time",
    description: "Get feedback in minutes instead of waiting weeks for investor responses."
  },
  {
    icon: CheckCircle,
    title: "Improve Success Rate",
    description: "Startups using our analysis show 40% higher funding success rates."
  },
  {
    icon: Download,
    title: "Export Results",
    description: "Download detailed reports and share improvements with your team."
  }
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-muted/30">
      <Container size="lg">
        <VStack gap="xl">
          
          {/* Header */}
          <VStack gap="md" align="center" className="text-center max-w-3xl mx-auto">
            <Heading level={2}>
              How It Works
            </Heading>
            <Text variant="lead" className="text-muted-foreground">
              Getting expert feedback on your pitch is simple and fast. 
              Our AI-powered platform makes pitch analysis accessible to everyone.
            </Text>
          </VStack>

          {/* Steps */}
          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-2/3">
              <div className="flex justify-between">
                <div className="w-1/3 h-0.5 bg-gradient-to-r from-primary-200 to-primary-300 mt-8" />
                <div className="w-1/3 h-0.5 bg-gradient-to-r from-primary-300 to-primary-200 mt-8" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {steps.map((step, index) => (
                <Card key={index} variant="elevated" hover="lift" className="relative">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-6 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {step.number}
                  </div>
                  
                  <CardHeader className="pt-8">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <VStack gap="xs">
                      {step.details.map((detail, detailIndex) => (
                        <HStack key={detailIndex} gap="sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <Text variant="small" className="text-muted-foreground">
                            {detail}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 pt-12">
            {benefits.map((benefit, index) => (
              <Card key={index} variant="glass" className="text-center">
                <CardContent className="py-6">
                  <VStack gap="sm" align="center">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                      <benefit.icon className="w-5 h-5" />
                    </div>
                    <Heading level={5}>{benefit.title}</Heading>
                    <Text variant="small" className="text-muted-foreground">
                      {benefit.description}
                    </Text>
                  </VStack>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <Card variant="gradient" className="w-full max-w-2xl mx-auto">
            <CardContent className="py-8 text-center">
              <VStack gap="md">
                <Heading level={3} className="text-white">
                  Ready to get started?
                </Heading>
                <Text className="text-white/90">
                  Upload your pitch deck now and get instant AI-powered feedback.
                </Text>
                <Button variant="secondary" size="lg" animation="bounce" className="gap-2 mt-4">
                  Try Free Analysis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </VStack>
            </CardContent>
          </Card>
        </VStack>
      </Container>
    </section>
  )
}

export default HowItWorks