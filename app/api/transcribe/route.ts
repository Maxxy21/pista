import { NextResponse } from 'next/server';
import {getOpenAI} from "@/lib/utils";

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const openai = getOpenAI();
        const formData = await req.formData();
        const audioFile = formData.get('audio') as File;

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

        try {
            const transcription = await openai.audio.transcriptions.create({
                file: new File([audioBuffer], audioFile.name, { type: audioFile.type }),
                model: "whisper-1",
                language: "en",
                response_format: "text",
            });

            return NextResponse.json({ text: transcription });
        } catch (openaiError) {
            console.error('OpenAI API Error:', openaiError);
            return NextResponse.json(
                { error: 'OpenAI transcription failed' },
                { status: 503 }
            );
        }
    } catch (error) {
        console.error('Transcription error:', error);
        return NextResponse.json(
            { error: 'Transcription processing failed' },
            { status: 500 }
        );
    }
}