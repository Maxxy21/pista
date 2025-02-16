// lib/rate-limit.ts
import { RateLimiter } from "limiter";

const limiter = new RateLimiter({
    tokensPerInterval: 5, // Adjust based on your needs
    interval: "minute"
});

export async function checkRateLimit() {
    const remainingRequests = await limiter.removeTokens(1);
    return remainingRequests >= 0;
}