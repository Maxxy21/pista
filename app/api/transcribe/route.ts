import { NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/utils';

export const runtime = 'edge';

export async function POST(req: Request) {
    let formData: FormData | null = null;
    let audioFile: File | null = null;

    try {
        formData = await req.formData();
        audioFile = formData.get('audio') as File | null;

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
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

        const isOpenAIError = error?.response?.status || error?.name === 'OpenAIError';
        const status = isOpenAIError ? 503 : 500;
        const message = isOpenAIError
            ? 'OpenAI transcription failed'
            : 'Transcription processing failed';

        return NextResponse.json({ error: message }, { status });
    }
}