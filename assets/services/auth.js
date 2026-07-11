/* ============================================================
   AUTH SERVICE (mock)
   assets/services/auth.js

   ES Module conversion: named exports + compatibility bridge.
   ============================================================ */

import { ROLES } from "../permissions/permissions.js";
import { createUser } from "../models/user.model.js";

// Preset identities — one per role, used by the dev "Preview as" switcher
// and by any page that needs a stand-in author/expert/commenter.
export const MOCK_USERS = {
  guest: null,
  member: createUser({
    id: 'u-201', nickname: 'elena.tessile', email: 'elena@example.com',
    role: ROLES.MEMBER, professionalRole: 'Production Planner', country: 'Italy',
    expertise: ['Supply Chain', 'ERP'], avatarUrl: 'https://picsum.photos/seed/prato-avatar-member/120/120',
    reputation: 340, badges: [], profileComplete: true,
  }),
  expert: createUser({
    id: 'u-104', nickname: 'renzo.galli', email: 'renzo@example.com',
    role: ROLES.EXPERT, verifiedExpert: true, professionalRole: 'Textile Engineer, 22 yrs',
    country: 'Italy', expertise: ['Textile Engineering', 'Quality Control'],
    avatarUrl: 'https://picsum.photos/seed/prato-avatar-expert/120/120', reputation: 3120,
    badges: ['Verified Expert'], profileComplete: true,
  }),
  moderator: createUser({
    id: 'u-55', nickname: 'mod.alice', email: 'alice@example.com',
    role: ROLES.MODERATOR, professionalRole: 'Community Moderator', country: 'Italy',
    avatarUrl: 'https://picsum.photos/seed/prato-avatar-moderator/120/120', reputation: 1800,
    badges: ['Moderator'], profileComplete: true,
  }),
  admin: createUser({
    id: 'u-1', nickname: 'editorial.desk', email: 'desk@forumdellamoda.com',
    role: ROLES.ADMIN, professionalRole: 'Editorial Desk', country: 'Italy',
    avatarUrl: 'https://picsum.photos/seed/prato-avatar-admin/120/120', reputation: 9999,
    badges: ['Administrator'], profileComplete: true,
  }),
};

let currentUser = null; // null === Guest

export function getCurrentUser(){
  return currentUser;
}
export function isAuthenticated(){
  return !!currentUser;
}
/** Real login() will eventually call a backend; the event contract stays identical. */
export function login(user){
  currentUser = user || null;
  document.dispatchEvent(new CustomEvent('fdm:authchange', { detail: { user: currentUser } }));
}
export function logout(){
  login(null);
}
/** Dev-only helper backing the "Preview as" switcher. Not part of the real auth API. */
export function setMockUser(key){
  login(MOCK_USERS[key] || null);
}

/* ---- Compatibility bridge for legacy global namespace consumers ---- */
window.FDM = window.FDM || {};
window.FDM.auth = {
  getCurrentUser,
  isAuthenticated,
  login,
  logout,
  setMockUser,
  MOCK_USERS,
};
