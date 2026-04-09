import type { Access } from "payload";
import type { AccessArgs } from "payload";
import type { Administrator } from "@/types/cms";
import type { CollectionConfig } from "payload";
import { log } from "util";

// Cache for user permissions to avoid repeated database queries
const userPermissionsCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  permissions: string[];
  timestamp: number;
}

export const checkUserPermission = async (
  { req }: AccessArgs<Administrator>,
  requiredPermission: "read" | "create" | "update" | "delete",
  permissionField: string
) => {
  const { user, payload, url } = req;

  // Skip permission checks on login routes to avoid blocking authentication
  if (url?.includes("/login")) {
    return true;
  }

  // Customers should not go through admin role checks
  if (user?.collection === "customers") {
    return true;
  }
 // console.log("user", user)
  if (!user?.id) {
    // Allow public read access for static generation
    // if (requiredPermission === "read") {
    //   return true;
    // }
    console.log("No user found, denying access---");
    return false;
  }

  // Admin bypass - only check role if user is an administrator
  if (
    user.collection === "administrators" &&
    user.role === "admin"
   
  ) {
   // console.log(`Admin ${user.id} granted ${requiredPermission} access`);
    return true;
  }
//  console.log("logion user", user)
  try {
    // Fetch permissions from database
    const permissionResult = await payload.find({
      collection: "permission",
      where: {
        "roleTitle": {
          equals: user.collection=="administrators" && user.role
        }
      },
      limit: 1, // We only need the first match
    });

    // console.log("permissionResult",permissionResult)
    const userPermissions = permissionResult.docs[0]?.[permissionField] || [];
  console.log(`User ${user.id} permissions for ${permissionField}:`,);
    const hasPermission = userPermissions.includes(requiredPermission);
    console.log(
      `User ${user.id} ${requiredPermission} permission:`,
      hasPermission
    );

    return hasPermission;
  } catch (error) {
    console.error(
      `Error checking ${requiredPermission} permission for user ${user.id}:`,
      error
    );
    return false;
  }
};

/**
 * Access control for admin users - only allows superadmin to access certain collections
 * Admin users are restricted to only tenant and client management
 */
export const superAdminOnly: Access = ({ req }) => {
  const user = req.user;
  const url = req?.url;

  // Allow API access
  if (url?.includes("/api")) {
    return true;
  }

  // Only superadmin can access these restricted collections
  if (user?.collection === "administrators" && user?.role === "admin") {
    return true;
  }

  // Block admin users from accessing certain collections
  return false;
};

/**
 * Admin access control - only superadmin can see admin panel for certain collections
 */
export const superAdminOnlyAdmin = ({ req }: { req: any }): boolean => {
  const user = req.user;

  // Only superadmin can access admin panel for restricted collections
  if (user?.collection === "administrators" && user?.role === "superadmin") {
    return true;
  }

  return false;
};

/**
 * Access control that allows superadmin full access and admin limited access to their own created items
 */
export const adminOrSuperAdmin: Access = ({ req }) => {
  const user = req.user;
  const url = req?.url;

  // Allow API access
  if (url?.includes("/api")) {
    return true;
  }

  if (user?.collection === "administrators") {
    // Superadmin has full access
    if (user?.role === "admin") {
      return true;
    }

    // Admin has access to items they created
    if (user?.role === "business") {
      return {
        createdBy: {
          equals: user.id
        }
      };
    }
  }

  return false;
};

