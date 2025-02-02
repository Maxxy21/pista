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

export function getOpenAI() {
  if (openai === null) {
    openai = new OpenAI();
  }
  return openai;
}



export async function fileToText(file: File): Promise<string> {
  if (!file) {
    throw new Error('No file provided');
  }

  if (!file.type.includes('text/plain')) {
    throw new Error('Invalid file type. Please upload a text file (.txt)');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Validate content isn't empty
        if (!reader.result.trim()) {
          reject(new Error('File is empty'));
          return;
        }
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };

    reader.onerror = () => {
      reject(new Error(`File reading error: ${reader.error?.message || 'Unknown error'}`));
    };

    try {
      reader.readAsText(file);
    } catch (error: any) {
      reject(new Error(`Failed to start reading file: ${error.message}`));
    }
  });
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