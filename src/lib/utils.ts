import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import OpenAI from "openai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

let openai: OpenAI | null = null;

export class OpenAIConfigError extends Error {
  code: string
  constructor(message = 'OpenAI API key is not configured. Set OPENAI_API_KEY in your environment.') {
    super(message)
    this.name = 'OpenAIConfigError'
    this.code = 'OPENAI_CONFIG_ERROR'
  }
}

export function getOpenAI(): OpenAI {
  if (openai === null) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey.trim().length === 0) {
      throw new OpenAIConfigError()
    }
    openai = new OpenAI({ apiKey })
  }
  return openai
}


export const streamUpload = async (url: string, file: File, onProgress: (progress: number) => void) => {
  const contentLength = file.size;

  // Create a ReadableStream from the file
  const stream = file.stream();
  const reader = stream.getReader();

  let uploaded = 0;

  // Create a new ReadableStream that will track progress
  const progressStream = new ReadableStream({
    async start(controller) {
      while (true) {
        const {done, value} = await reader.read();

        if (done) break;

        uploaded += value.length;
        const progress = (uploaded / contentLength) * 100;
        onProgress(progress);

        controller.enqueue(value);
      }

      controller.close();
    },
  });

  // Create a Response from the stream
  const newResponse = new Response(progressStream);

  // Create a FormData with the streaming Response
  const formData = new FormData();
  formData.append('audio', await newResponse.blob(), file.name);

  // Make the fetch request
  return fetch(url, {
    method: 'POST',
    body: formData
  });
};
