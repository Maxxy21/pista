export interface FileValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
}

export interface FileValidationOptions {
  maxSize: number; // in bytes
  allowedTypes: string[];
  allowedExtensions?: string[];
  maxFiles?: number;
}

// Common file type configurations
export const FILE_VALIDATION_CONFIGS: Record<string, FileValidationOptions> = {
  AUDIO: {
    maxSize: 25 * 1024 * 1024, // 25MB
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/mp4', 'audio/webm', 'application/octet-stream'],
    allowedExtensions: ['.mp3', '.wav', '.m4a', '.mp4', '.webm'],
  },
  TEXT: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['text/plain'],
    allowedExtensions: ['.txt'],
  },
  DOCUMENT: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    allowedExtensions: ['.txt', '.pdf', '.doc', '.docx'],
  }
};


export function validateFile(file: File, options: FileValidationOptions): FileValidationResult {
  // Check file size
  if (file.size > options.maxSize) {
    const maxSizeMB = Math.round(options.maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${maxSizeMB}MB`,
      code: 'FILE_TOO_LARGE'
    };
  }

  // Check file type
  if (!options.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${options.allowedTypes.join(', ')}`,
      code: 'INVALID_FILE_TYPE'
    };
  }

  // Check file extension if specified
  if (options.allowedExtensions) {
    const fileExtension = getFileExtension(file.name);
    if (!options.allowedExtensions.includes(fileExtension)) {
      return {
        valid: false,
        error: `Invalid file extension. Allowed extensions: ${options.allowedExtensions.join(', ')}`,
        code: 'INVALID_FILE_EXTENSION'
      };
    }
  }

  // Additional security checks
  const securityCheck = performSecurityChecks(file);
  if (!securityCheck.valid) {
    return securityCheck;
  }

  return { valid: true };
}



function performSecurityChecks(file: File): FileValidationResult {
  // Check for suspicious file names
  const suspiciousPatterns = [
    /\.(exe|bat|cmd|com|pif|scr|vbs|jar|sh)$/i,
    /\.\w+\.(exe|bat|cmd|com|pif|scr|vbs|jar|sh)$/i, // Double extensions
    /[<>:"/\\|?*]/g, // Invalid filename characters
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(file.name)) {
      return {
        valid: false,
        error: 'Suspicious file name detected',
        code: 'SUSPICIOUS_FILENAME'
      };
    }
  }

  // Check for empty files (0 bytes)
  if (file.size === 0) {
    return {
      valid: false,
      error: 'Empty files are not allowed',
      code: 'EMPTY_FILE'
    };
  }

  return { valid: true };
}

/**
 * Gets the file extension from a filename
 */
function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex === -1 ? '' : filename.slice(lastDotIndex).toLowerCase();
}

