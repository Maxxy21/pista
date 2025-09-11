import { NextRequest } from "next/server";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Clean up expired entries every 5 minutes
    setInterval(() => {
      this.cleanupExpired();
    }, 5 * 60 * 1000);
  }

  private cleanupExpired() {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime <= now) {
        delete this.store[key];
      }
    });
  }

  private getClientIdentifier(req: NextRequest): string {
    // Try to get IP from various headers (for proxy setups)
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfConnectingIp = req.headers.get('cf-connecting-ip');
    
    // Extract first IP if comma-separated
    const ip = forwarded?.split(',')[0]?.trim() || 
               realIp || 
               cfConnectingIp || 
               '127.0.0.1';
    
    return ip;
  }

  isRateLimited(req: NextRequest): { limited: boolean; remaining?: number; resetTime?: number } {
    const key = this.getClientIdentifier(req);
    const now = Date.now();
    
    // Initialize or reset if window expired
    if (!this.store[key] || this.store[key].resetTime <= now) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs
      };
      
      return {
        limited: false,
        remaining: this.maxRequests - 1,
        resetTime: this.store[key].resetTime
      };
    }

    // Increment count
    this.store[key].count++;

    // Check if limit exceeded
    if (this.store[key].count > this.maxRequests) {
      return {
        limited: true,
        remaining: 0,
        resetTime: this.store[key].resetTime
      };
    }

    return {
      limited: false,
      remaining: this.maxRequests - this.store[key].count,
      resetTime: this.store[key].resetTime
    };
  }
}

// Create singleton instances for different endpoints
export const apiRateLimiter = new RateLimiter(
  parseInt(process.env.RATE_LIMIT_MAX || '50'), 
  parseInt(process.env.RATE_LIMIT_WINDOW || '60000')
);

export const transcriptionRateLimiter = new RateLimiter(10, 60000); // 10 requests per minute
export const evaluationRateLimiter = new RateLimiter(20, 60000); // 20 requests per minute

export function withRateLimit(limiter: RateLimiter) {
  return function(handler: (req: NextRequest, context?: any) => Promise<Response>) {
    return async (req: NextRequest, context?: any): Promise<Response> => {
      const result = limiter.isRateLimited(req);
      
      if (result.limited) {
        return new Response(JSON.stringify({
          error: "Rate limit exceeded",
          code: "RATE_LIMITED",
          resetTime: result.resetTime
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limiter['maxRequests'].toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(result.resetTime! / 1000).toString(),
            'Retry-After': Math.ceil((result.resetTime! - Date.now()) / 1000).toString()
          }
        });
      }

      // Add rate limit headers to successful responses
      const response = await handler(req, context);
      
      // Clone response to add headers
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });

      newResponse.headers.set('X-RateLimit-Limit', limiter['maxRequests'].toString());
      newResponse.headers.set('X-RateLimit-Remaining', result.remaining!.toString());
      newResponse.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime! / 1000).toString());

      return newResponse;
    };
  };
}