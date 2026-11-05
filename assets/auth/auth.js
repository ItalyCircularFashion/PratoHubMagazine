/* ============================================================
   AUTH SERVICE (mock)
   assets/auth/auth.js

   This is a STAND-IN for real authentication. The API surface
   (getCurrentUser / login / logout / isAuthenticated / on-change
   event) is the same shape a real session-based or token-based
   service would expose, so wiring up demo.html / demo.html
   to a real backend later means rewriting this one file only —
   no page or component should need to change.

   Current session state lives in memory only (no localStorage —
   this is intentionally a stateless preview layer, not a
   persistence layer). It resets to Guest on every page load,
   except for the explicit "preview as" switcher used for
   demonstrating permission-aware rendering pre-launch.
   ============================================================ */
window.FDM = window.FDM || {};

(function(){

  const ROLES = FDM.permissions.ROLES;

  // Preset identities — one per role, used by the dev "Preview as" switcher
  // and by any page that needs a stand-in author/expert/commenter.
  const MOCK_USERS = {
    guest: null,
    member: FDM.models.createUser({
      id: 'u-201', nickname: 'elena.tessile', email: 'demo@example.invalid',
      role: ROLES.MEMBER, professionalRole: 'Production Planner', country: 'Italy',
      expertise: ['Supply Chain', 'ERP'], avatarUrl: 'assets/images/avatar.svg',
      reputation: 340, badges: [], profileComplete: true,
    }),
    expert: FDM.models.createUser({
      id: 'u-104', nickname: 'renzo.galli', email: 'demo@example.invalid',
      role: ROLES.EXPERT, verifiedExpert: true, professionalRole: 'Textile Engineer, 22 yrs',
      country: 'Italy', expertise: ['Textile Engineering', 'Quality Control'],
      avatarUrl: 'assets/images/avatar.svg', reputation: 3120,
      badges: ['Verified Expert'], profileComplete: true,
    }),
    moderator: FDM.models.createUser({
      id: 'u-55', nickname: 'mod.alice', email: 'demo@example.invalid',
      role: ROLES.MODERATOR, professionalRole: 'Community Moderator', country: 'Italy',
      avatarUrl: 'assets/images/avatar.svg', reputation: 1800,
      badges: ['Moderator'], profileComplete: true,
    }),
    admin: FDM.models.createUser({
      id: 'u-1', nickname: 'editorial.desk', email: 'demo@example.invalid',
      role: ROLES.ADMIN, professionalRole: 'Editorial Desk', country: 'Italy',
      avatarUrl: 'assets/images/avatar.svg', reputation: 9999,
      badges: ['Administrator'], profileComplete: true,
    }),
  };

  let currentUser = null; // null === Guest

  function getCurrentUser(){
    return currentUser;
  }
  function isAuthenticated(){
    return !!currentUser;
  }
  /** Real login() will eventually call a backend; the event contract stays identical. */
  function login(user){
    currentUser = user || null;
    document.dispatchEvent(new CustomEvent('fdm:authchange', { detail: { user: currentUser } }));
  }
  function logout(){
    login(null);
  }
  /** Dev-only helper backing the "Preview as" switcher. Not part of the real auth API. */
  function setMockUser(key){
    login(MOCK_USERS[key] || null);
  }

  FDM.auth = { getCurrentUser, isAuthenticated, login, logout, setMockUser, MOCK_USERS };

})();
