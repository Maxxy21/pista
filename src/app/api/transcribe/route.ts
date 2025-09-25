import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI, OpenAIConfigError } from '@/lib/utils';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/api-auth';
import { withRateLimit, transcriptionRateLimiter } from '@/lib/rate-limit/rate-limiter';
import { validateFile, FILE_VALIDATION_CONFIGS } from '@/lib/validation/file-validator';
import { z } from 'zod';

// export const runtime = 'edge';

export const POST = withRateLimit(transcriptionRateLimiter)(withAuth(async (req: AuthenticatedRequest) => {
    let formData: FormData | null = null;
    let audioFile: File | null = null;

    try {
        formData = await req.formData();
        audioFile = formData.get('audio') as File | null;

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        // Comprehensive file validation
        const validationResult = validateFile(audioFile, FILE_VALIDATION_CONFIGS.AUDIO);
        if (!validationResult.valid) {
            return NextResponse.json({ 
                error: validationResult.error,
                code: validationResult.code 
            }, { status: 400 });
        }

        const arrayBuffer = await audioFile.arrayBuffer();
        const fileForOpenAI = new File([arrayBuffer], audioFile.name, { type: audioFile.type });

        const openai = getOpenAI();

        const transcription = await openai.audio.transcriptions.create({
            file: fileForOpenAI,
            model: 'whisper-1',
            language: 'en',
            response_format: 'text',
        });

        return NextResponse.json({ text: transcription });
    } catch (error: any) {
        console.error('Transcription error:', error);

        if (error instanceof OpenAIConfigError) {
            return NextResponse.json({
                error: error.message,
                code: error.code
            }, { status: 503 })
        }

        // Sanitized error messages for production
        return NextResponse.json({ 
            error: 'Transcription processing failed',
            code: 'TRANSCRIPTION_ERROR' 
        }, { status: 500 });
    }
}));
