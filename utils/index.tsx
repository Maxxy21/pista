import OpenAI from "openai";

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