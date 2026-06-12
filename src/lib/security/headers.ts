import { NextResponse } from 'next/server';

export function createSecurityHeaders() {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.*.dev https://*.clerk.accounts.dev https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "media-src 'self' data: blob:",
    "connect-src 'self' https://api.openai.com https://api.anthropic.com https://generativelanguage.googleapis.com https://*.convex.cloud https://*.clerk.accounts.dev https://clerk.*.dev wss://*.convex.cloud",
    "frame-src 'self' https://challenges.cloudflare.com https://*.clerk.accounts.dev",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  return {
    'Content-Security-Policy': csp,
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-DNS-Prefetch-Control': 'off',
    'Permissions-Policy': [
      'camera=()',
      'microphone=(self)',
      'geolocation=()',
      'interest-cohort=()',
      'payment=()',
      'usb=()'
    ].join(', ')
  };
}

export function addSecurityHeaders(response: NextResponse): NextResponse {
  const headers = createSecurityHeaders();
  
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

export function createSecureResponse(data: any, options: ResponseInit = {}): NextResponse {
  const response = NextResponse.json(data, options);
  return addSecurityHeaders(response);
}