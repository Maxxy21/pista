import jsPDF from 'jspdf';
import { UniversalPitchData } from '@/lib/types/pitch';
import { getOverallFeedback, getEvaluations } from '@/lib/utils/evaluation-utils';
import { StructuredFeedback } from '@/lib/types/evaluation';

export function exportPitchToPDF(pitch: UniversalPitchData): void {
  try {
    const doc = new jsPDF();
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    const addTextWithWrapping = (
      text: string,
      x: number,
      y: number,
      options: {
        fontSize?: number,
        fontStyle?: string,
        maxWidth?: number,
        align?: 'left' | 'center' | 'right'
      } = {}
    ): number => {
      const fontSize = options.fontSize || 12;
      const fontStyle = options.fontStyle || 'normal';
      const textMaxWidth = options.maxWidth || maxWidth;
      const align = options.align || 'left';

      doc.setFontSize(fontSize);
      doc.setFont('helvetica', fontStyle);

      const lines = doc.splitTextToSize(text, textMaxWidth);
      const lineHeight = fontSize * 0.352778;
      if (y + (lines.length * lineHeight) > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 20;
      }

      lines.forEach((line: string, index: number) => {
        let xPos = x;
        if (align === 'center') {
          xPos = (pageWidth - doc.getTextWidth(line)) / 2;
        } else if (align === 'right') {
          xPos = pageWidth - margin - doc.getTextWidth(line);
        }
        doc.text(line, xPos, y + (index * lineHeight));
      });

      return y + (lines.length * lineHeight) + 5;
    };

    yPosition = addTextWithWrapping(
      'Pitch Evaluation Report',
      margin,
      yPosition,
      { fontSize: 20, fontStyle: 'bold', align: 'center' }
    );

    yPosition += 5;

    yPosition = addTextWithWrapping(
      'PITCH INFORMATION',
      margin,
      yPosition,
      { fontSize: 14, fontStyle: 'bold' }
    );

    yPosition = addTextWithWrapping(
      `Title: ${pitch.title}`,
      margin,
      yPosition,
      { fontSize: 12, fontStyle: 'bold' }
    );

    yPosition = addTextWithWrapping(
      `Author: ${pitch.authorName}`,
      margin,
      yPosition
    );

    yPosition = addTextWithWrapping(
      `Type: ${pitch.type}`,
      margin,
      yPosition
    );

    yPosition = addTextWithWrapping(
      `Created: ${new Date(pitch.createdAt).toLocaleDateString()}`,
      margin,
      yPosition
    );

    yPosition = addTextWithWrapping(
      `Overall Score: ${pitch.evaluation.overallScore}/10`,
      margin,
      yPosition,
      { fontSize: 12, fontStyle: 'bold' }
    );

    yPosition += 10;

    yPosition = addTextWithWrapping(
      'PITCH CONTENT',
      margin,
      yPosition,
      { fontSize: 14, fontStyle: 'bold' }
    );

    yPosition = addTextWithWrapping(
      pitch.text,
      margin,
      yPosition,
      { fontSize: 10 }
    );

    yPosition += 10;

    const evaluations = getEvaluations(pitch.evaluation);

    yPosition = addTextWithWrapping(
      'DETAILED EVALUATION',
      margin,
      yPosition,
      { fontSize: 14, fontStyle: 'bold' }
    );

    evaluations.forEach((evaluation) => {
      yPosition = addTextWithWrapping(
        `${evaluation.criteria}: ${evaluation.score}/10`,
        margin,
        yPosition,
        { fontSize: 12, fontStyle: 'bold' }
      );

      yPosition = addTextWithWrapping(
        evaluation.summary,
        margin,
        yPosition,
        { fontSize: 10 }
      );

      if (evaluation.breakdown.strengths.length > 0) {
        yPosition = addTextWithWrapping(
          'Strengths:',
          margin,
          yPosition,
          { fontSize: 10, fontStyle: 'bold' }
        );

        evaluation.breakdown.strengths.forEach((strength) => {
          yPosition = addTextWithWrapping(
            `• ${strength.point} (${strength.impact} impact)`,
            margin + 5,
            yPosition,
            { fontSize: 10 }
          );
        });
      }

      if (evaluation.breakdown.improvements.length > 0) {
        yPosition = addTextWithWrapping(
          'Areas for Improvement:',
          margin,
          yPosition,
          { fontSize: 10, fontStyle: 'bold' }
        );

        evaluation.breakdown.improvements.forEach((improvement) => {
          yPosition = addTextWithWrapping(
            `• ${improvement.area} (${improvement.priority}) - ${improvement.actionable}`,
            margin + 5,
            yPosition,
            { fontSize: 10 }
          );
        });
      }

      if (evaluation.recommendations.length > 0) {
        yPosition = addTextWithWrapping(
          'Recommendations:',
          margin,
          yPosition,
          { fontSize: 10, fontStyle: 'bold' }
        );

        evaluation.recommendations.forEach((recommendation) => {
          yPosition = addTextWithWrapping(
            `• ${recommendation}`,
            margin + 5,
            yPosition,
            { fontSize: 10 }
          );
        });
      }

      yPosition += 8;
    });

    const overallFeedback = getOverallFeedback(pitch.evaluation);

    yPosition = addTextWithWrapping(
      'OVERALL FEEDBACK',
      margin,
      yPosition,
      { fontSize: 14, fontStyle: 'bold' }
    );

    if (typeof overallFeedback === 'string') {
      yPosition = addTextWithWrapping(
        overallFeedback,
        margin,
        yPosition,
        { fontSize: 10 }
      );
    } else {
      const structuredFeedback = overallFeedback as StructuredFeedback;

      yPosition = addTextWithWrapping(
        'Summary:',
        margin,
        yPosition,
        { fontSize: 12, fontStyle: 'bold' }
      );

      yPosition = addTextWithWrapping(
        structuredFeedback.overallAssessment.summary,
        margin,
        yPosition,
        { fontSize: 10 }
      );

      if (structuredFeedback.overallAssessment.keyHighlights.length > 0) {
        yPosition = addTextWithWrapping(
          'Key Highlights:',
          margin,
          yPosition,
          { fontSize: 11, fontStyle: 'bold' }
        );

        structuredFeedback.overallAssessment.keyHighlights.forEach((highlight) => {
          yPosition = addTextWithWrapping(
            `• ${highlight}`,
            margin + 5,
            yPosition,
            { fontSize: 10 }
          );
        });
      }

      if (structuredFeedback.overallAssessment.primaryConcerns.length > 0) {
        yPosition = addTextWithWrapping(
          'Primary Concerns:',
          margin,
          yPosition,
          { fontSize: 11, fontStyle: 'bold' }
        );

        structuredFeedback.overallAssessment.primaryConcerns.forEach((concern) => {
          yPosition = addTextWithWrapping(
            `• ${concern}`,
            margin + 5,
            yPosition,
            { fontSize: 10 }
          );
        });
      }

      yPosition = addTextWithWrapping(
        'Investment Thesis:',
        margin,
        yPosition,
        { fontSize: 12, fontStyle: 'bold' }
      );

      yPosition = addTextWithWrapping(
        `Viability: ${structuredFeedback.investmentThesis.viability}`,
        margin,
        yPosition,
        { fontSize: 10, fontStyle: 'bold' }
      );

      yPosition = addTextWithWrapping(
        structuredFeedback.investmentThesis.reasoning,
        margin,
        yPosition,
        { fontSize: 10 }
      );

      yPosition = addTextWithWrapping(
        `Potential Returns: ${structuredFeedback.investmentThesis.potentialReturns}`,
        margin,
        yPosition,
        { fontSize: 10 }
      );

      yPosition = addTextWithWrapping(
        'Risk Assessment:',
        margin,
        yPosition,
        { fontSize: 12, fontStyle: 'bold' }
      );

      yPosition = addTextWithWrapping(
        `Risk Score: ${structuredFeedback.riskAssessment.riskScore}/10`,
        margin,
        yPosition,
        { fontSize: 10, fontStyle: 'bold' }
      );

      structuredFeedback.riskAssessment.majorRisks.forEach((risk) => {
        yPosition = addTextWithWrapping(
          `• ${risk.risk} (${risk.severity} severity) - ${risk.mitigation}`,
          margin + 5,
          yPosition,
          { fontSize: 10 }
        );
      });

      if (structuredFeedback.nextSteps.immediateActions.length > 0) {
        yPosition = addTextWithWrapping(
          'Immediate Actions:',
          margin,
          yPosition,
          { fontSize: 11, fontStyle: 'bold' }
        );

        structuredFeedback.nextSteps.immediateActions.forEach((action) => {
          yPosition = addTextWithWrapping(
            `• ${action}`,
            margin + 5,
            yPosition,
            { fontSize: 10 }
          );
        });
      }

      if (structuredFeedback.nextSteps.longTermRecommendations.length > 0) {
        yPosition = addTextWithWrapping(
          'Long-term Recommendations:',
          margin,
          yPosition,
          { fontSize: 11, fontStyle: 'bold' }
        );

        structuredFeedback.nextSteps.longTermRecommendations.forEach((recommendation) => {
          yPosition = addTextWithWrapping(
            `• ${recommendation}`,
            margin + 5,
            yPosition,
            { fontSize: 10 }
          );
        });
      }
    }

    if (pitch.questions && pitch.questions.length > 0) {
      yPosition += 10;

      yPosition = addTextWithWrapping(
        'FOLLOW-UP QUESTIONS & ANSWERS',
        margin,
        yPosition,
        { fontSize: 14, fontStyle: 'bold' }
      );

      pitch.questions.forEach((qa, index) => {
        yPosition = addTextWithWrapping(
          `Q${index + 1}: ${qa.text}`,
          margin,
          yPosition,
          { fontSize: 11, fontStyle: 'bold' }
        );

        yPosition = addTextWithWrapping(
          `A: ${qa.answer}`,
          margin,
          yPosition,
          { fontSize: 10 }
        );

        yPosition += 5;
      });
    }

    yPosition += 10;
    const currentDate = new Date().toLocaleString();
    yPosition = addTextWithWrapping(
      `Generated on ${currentDate} by Pista`,
      margin,
      yPosition,
      { fontSize: 8, align: 'center' }
    );

    const fileName = `pitch-${pitch.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${Date.now()}.pdf`;
    doc.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF export');
  }
}