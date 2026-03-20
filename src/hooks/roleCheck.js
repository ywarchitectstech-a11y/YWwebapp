// export const canManage = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const role = user?.role;

//   const allowedRoles = ["ADMIN", "CO_FOUNDER", "HR"];

//   return allowedRoles.includes(role);
// };

// ─── Role Helpers ─────────────────────────────────────────────────────────────
// Single source of truth for role-based checks across the entire app.
// Import this file wherever role logic is needed.

/**
 * Returns the parsed user object from localStorage, or null.
 * @returns {{ role: string, name: string, ... } | null}
 */
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Returns the current user's role string, or null.
 * e.g. "ADMIN" | "CO_FOUNDER" | "HR" | "EMPLOYEE" | "CLIENT"
 */
export const getUserRole = () => getStoredUser()?.role ?? null;

/**
 * ADMIN, CO_FOUNDER, HR → can manage attendance, employees, HR pages.
 * Used to gate HR-only routes and actions.
 */
export const canManage = () => {
  const role = getUserRole();
  return ["ADMIN", "CO_FOUNDER", "HR"].includes(role);
};

/**
 * ADMIN and CO_FOUNDER only — for the most sensitive operations.
 */
export const isAdminOrFounder = () => {
  const role = getUserRole();
  return ["ADMIN", "CO_FOUNDER"].includes(role);
};

/**
 * Returns true if the current user is a CLIENT (portal user).
 */
export const isClient = () => getUserRole() === "CLIENT";

/**
 * Returns true if the current user is an internal employee
 * (ADMIN, CO_FOUNDER, HR, EMPLOYEE — anyone who is NOT a client).
 */
export const isEmployee = () => {
  const role = getUserRole();
  return role !== null && role !== "CLIENT";
};