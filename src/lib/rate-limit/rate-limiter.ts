import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

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

  isRateLimited(key: string): { limited: boolean; remaining?: number; resetTime?: number } {
    const now = Date.now();

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

    this.store[key].count++;

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

  get limit() {
    return this.maxRequests;
  }
}

// Create singleton instances for different endpoints
export const apiRateLimiter = new RateLimiter(
  parseInt(process.env.RATE_LIMIT_MAX || '50'),
  parseInt(process.env.RATE_LIMIT_WINDOW || '60000')
);

export const transcriptionRateLimiter = new RateLimiter(10, 60000);
export const evaluationRateLimiter = new RateLimiter(20, 60000);

export function withRateLimit(limiter: RateLimiter) {
  return function(handler: (req: NextRequest, context?: any) => Promise<Response>) {
    return async (req: NextRequest, context?: any): Promise<Response> => {
      // Key by authenticated userId — not IP, which is client-spoofable
      const { userId } = await auth();
      const key = userId ?? "anonymous";

      const result = limiter.isRateLimited(key);

      if (result.limited) {
        return new Response(JSON.stringify({
          error: "Rate limit exceeded",
          code: "RATE_LIMITED",
          resetTime: result.resetTime
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limiter.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(result.resetTime! / 1000).toString(),
            'Retry-After': Math.ceil((result.resetTime! - Date.now()) / 1000).toString()
          }
        });
      }

      const response = await handler(req, context);

      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });

      newResponse.headers.set('X-RateLimit-Limit', limiter.limit.toString());
      newResponse.headers.set('X-RateLimit-Remaining', result.remaining!.toString());
      newResponse.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime! / 1000).toString());

      return newResponse;
    };
  };
}
