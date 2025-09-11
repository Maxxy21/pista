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
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/mp4', 'audio/webm'],
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

/**
 * Validates a single file against the provided options
 */
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

  // Check file type (MIME type)
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

/**
 * Validates multiple files
 */
export function validateFiles(files: File[], options: FileValidationOptions): FileValidationResult {
  if (options.maxFiles && files.length > options.maxFiles) {
    return {
      valid: false,
      error: `Too many files. Maximum allowed: ${options.maxFiles}`,
      code: 'TOO_MANY_FILES'
    };
  }

  for (const file of files) {
    const result = validateFile(file, options);
    if (!result.valid) {
      return result;
    }
  }

  return { valid: true };
}

/**
 * Performs additional security checks on the file
 */
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

  // Check for empty files (usually suspicious)
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

/**
 * Sanitizes a filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
  // Remove or replace dangerous characters
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace non-alphanumeric chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .slice(0, 255); // Limit filename length
}

/**
 * Higher-order function to validate files in API routes
 */
export function withFileValidation(options: FileValidationOptions) {
  return function(files: File | File[]): FileValidationResult {
    const fileArray = Array.isArray(files) ? files : [files];
    return validateFiles(fileArray, options);
  };
}