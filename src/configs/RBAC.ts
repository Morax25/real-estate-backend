export type Role = "admin" | "agent" | "user";

export type Permission =
  | "property:create"
  | "property:update"
  | "property:delete"
  | "property:view"
  | "user:manage"
  | "profile:update";

type RolePermissions = Record<Role, Permission[]>;

export const rolePermissions: RolePermissions = {
  admin: [
    "property:create",
    "property:update",
    "property:delete",
    "property:view",
    "user:manage",
    "profile:update",
  ],
  agent: [
    "property:create",
    "property:update",
    "property:view",
    "profile:update",
  ],
  user: ["property:view", "profile:update"],
};

export const hasPermission = (role: Role, permission: Permission) => {
  return rolePermissions[role]?.includes(permission) || false;
};
