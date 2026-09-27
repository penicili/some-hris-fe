/**
 * Role helpers for the UI.
 *
 * The backend is the only real gate: `/api/employee` and friends sit behind
 * `authorize(PRIVILEGED_ROLES)`. These helpers only decide what the frontend
 * offers, so a `user` account is not shown actions that would answer 403.
 */

/** Mirrors PRIVILEGED_ROLES in the backend (hris-anu/src/utils/access.ts). */
export const PRIVILEGED_ROLES = ["admin", "executive", "management"] as const;

export function canManageEmployees(role: string): boolean {
  return (PRIVILEGED_ROLES as readonly string[]).includes(role);
}
