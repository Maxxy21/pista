"use client"

import { useState } from 'react'
import { jsPDF } from 'jspdf'
import { Download, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'

interface ExportPDFButtonProps {
  data: {
    title: string
    _creationTime: number
    text: string
    evaluation: {
      overallScore: number
      overallFeedback: string
      evaluations: Array<{
        criteria: string
        score: number
        comment: string
        strengths: string[]
        improvements: string[]
      }>
    }
  }
}

export const ExportPDFButton = ({ data }: ExportPDFButtonProps) => {
  const [isExporting, setIsExporting] = useState(false)

  const generatePDF = async (type: 'full' | 'summary') => {
    try {
      setIsExporting(true)
      
      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })
      
      // Add title and date
      doc.setFontSize(24)
      doc.setTextColor(44, 62, 80)
      doc.text(data.title, 20, 20)
      
      doc.setFontSize(12)
      doc.setTextColor(127, 140, 141)
      doc.text(`Created: ${new Date(data._creationTime).toLocaleDateString()}`, 20, 30)
      
      // Add overall score
      doc.setFontSize(16)
      doc.setTextColor(44, 62, 80)
      doc.text('Overall Score', 20, 45)
      
      doc.setFontSize(24)
      const scoreColor = data.evaluation.overallScore >= 8 ? [39, 174, 96] : 
                         data.evaluation.overallScore >= 6 ? [41, 128, 185] : 
                         data.evaluation.overallScore >= 4 ? [243, 156, 18] : [231, 76, 60]
      doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
      doc.text(`${data.evaluation.overallScore.toFixed(1)}/10`, 20, 55)
      
      // Add overall feedback
      doc.setFontSize(16)
      doc.setTextColor(44, 62, 80)
      doc.text('Evaluation Summary', 20, 70)
      
      doc.setFontSize(12)
      doc.setTextColor(44, 62, 80)
      const feedbackLines = doc.splitTextToSize(data.evaluation.overallFeedback, 170)
      doc.text(feedbackLines, 20, 80)
      
      let yPosition = 80 + (feedbackLines.length * 7)
      
      // Add detailed evaluations if full report
      if (type === 'full') {
        // Add transcript
        if (yPosition > 240) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.setFontSize(16)
        doc.setTextColor(44, 62, 80)
        doc.text('Transcript', 20, yPosition)
        
        doc.setFontSize(10)
        doc.setTextColor(44, 62, 80)
        const transcriptLines = doc.splitTextToSize(data.text.substring(0, 1000) + 
          (data.text.length > 1000 ? '...' : ''), 170)
        doc.text(transcriptLines, 20, yPosition + 10)
        
        yPosition += 10 + (transcriptLines.length * 5)
        
        // Add detailed analysis
        data.evaluation.evaluations.forEach((evaluation) => {
          if (yPosition > 240) {
            doc.addPage()
            yPosition = 20
          }
          
          // Category title and score
          doc.setFontSize(14)
          doc.setTextColor(44, 62, 80)
          doc.text(evaluation.criteria, 20, yPosition)
          
          const catScoreColor = evaluation.score >= 8 ? [39, 174, 96] : 
                               evaluation.score >= 6 ? [41, 128, 185] : 
                               evaluation.score >= 4 ? [243, 156, 18] : [231, 76, 60]
          doc.setTextColor(catScoreColor[0], catScoreColor[1], catScoreColor[2])
          doc.text(`${evaluation.score.toFixed(1)}/10`, 170, yPosition, { align: 'right' })
          
          yPosition += 10
          
          // Comment
          doc.setFontSize(10)
          doc.setTextColor(44, 62, 80)
          const commentLines = doc.splitTextToSize(evaluation.comment, 170)
          doc.text(commentLines, 20, yPosition)
          
          yPosition += (commentLines.length * 5) + 5
          
          // Strengths
          doc.setFontSize(12)
          doc.setTextColor(39, 174, 96)
          doc.text('Strengths:', 20, yPosition)
          
          yPosition += 7
          
          doc.setFontSize(10)
          doc.setTextColor(44, 62, 80)
          evaluation.strengths.forEach((strength) => {
            const strengthLines = doc.splitTextToSize(`• ${strength}`, 160)
            doc.text(strengthLines, 25, yPosition)
            yPosition += (strengthLines.length * 5) + 2
          })
          
          yPosition += 5
          
          // Improvements
          doc.setFontSize(12)
          doc.setTextColor(231, 76, 60)
          doc.text('Areas for Improvement:', 20, yPosition)
          
          yPosition += 7
          
          doc.setFontSize(10)
          doc.setTextColor(44, 62, 80)
          evaluation.improvements.forEach((improvement) => {
            const improvementLines = doc.splitTextToSize(`• ${improvement}`, 160)
            doc.text(improvementLines, 25, yPosition)
            yPosition += (improvementLines.length * 5) + 2
          })
          
          yPosition += 15
        })
      }
      
      // Add footer
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(10)
        doc.setTextColor(127, 140, 141)
        doc.text(`PitchPerfect Evaluation Report - Page ${i} of ${pageCount}`, 105, 287, { align: 'center' })
      }
      
      // Save the PDF
      doc.save(`${data.title.replace(/\s+/g, '_')}_${type === 'full' ? 'Full' : 'Summary'}_Report.pdf`)
      toast({
        title: "Export successful",
        description: `Your ${type} report has been downloaded.`,
      })
    } catch (error) {
      console.error('PDF generation error:', error)
      toast({
        title: "Export failed",
        description: "There was an error generating your PDF report.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Export</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => generatePDF('summary')}
          disabled={isExporting}
        >
          <FileText className="h-4 w-4 mr-2" />
          <span>Summary Report</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => generatePDF('full')}
          disabled={isExporting}
        >
          <FileText className="h-4 w-4 mr-2" />
          <span>Full Report</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 