import { requireRole } from "./role.middleware.js";

export const adminOnly = requireRole("admin", "superadmin");
