import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export interface AuthenticatedRequest extends NextRequest {
  userId: string;
  orgId?: string;
}

export interface AuthResult {
  success: boolean;
  userId?: string;
  orgId?: string;
  error?: string;
}

/**
 * Validates authentication for API routes
 * @param req - The incoming request
 * @returns AuthResult with user information or error
 */
export async function validateApiAuth(req: NextRequest): Promise<AuthResult> {
  try {
    const { userId, orgId } = await auth();
    
    if (!userId) {
      return {
        success: false,
        error: "Authentication required"
      };
    }

    return {
      success: true,
      userId,
      orgId: orgId || undefined
    };
  } catch (error) {
    logger.error("auth", "Authentication validation failed:", error);
    return {
      success: false,
      error: "Authentication validation failed"
    };
  }
}

/**
 * Higher-order function to protect API routes with authentication
 * @param handler - The API route handler
 * @returns Protected API route handler
 */
export function withAuth(
  handler: (req: AuthenticatedRequest, context?: any) => Promise<Response>
) {
  return async (req: NextRequest, context?: any): Promise<Response> => {
    const authResult = await validateApiAuth(req);
    
    if (!authResult.success) {
      return NextResponse.json(
        { 
          error: authResult.error || "Authentication failed",
          code: "UNAUTHORIZED" 
        },
        { status: 401 }
      );
    }

    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.userId = authResult.userId!;
    authenticatedReq.orgId = authResult.orgId;

    return handler(authenticatedReq, context);
  };
}

/**
 * Utility to get authenticated user info in API routes
 * @param req - The request object
 * @returns User information or throws error
 */
export async function requireAuth(req: NextRequest) {
  const authResult = await validateApiAuth(req);
  
  if (!authResult.success) {
    throw new Error(authResult.error || "Authentication required");
  }
  
  return {
    userId: authResult.userId!,
    orgId: authResult.orgId
  };
}

