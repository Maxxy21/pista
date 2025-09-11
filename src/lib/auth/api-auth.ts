import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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
    console.error("Authentication validation failed:", error);
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

    // Attach user info to request
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

/**
 * Checks if user has access to organization resources
 * @param userId - The user ID
 * @param orgId - The organization ID to check access for
 * @param requiredOrgId - The organization ID required for access
 * @returns boolean indicating access permission
 */
export function hasOrgAccess(userId: string, orgId: string | undefined, requiredOrgId: string): boolean {
  // If no org context, allow personal access
  if (!requiredOrgId) return true;
  
  // Must have matching org ID
  return orgId === requiredOrgId;
}