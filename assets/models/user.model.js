/* ============================================================
   USER MODEL
   assets/models/user.model.js

   Canonical shape of a platform user. The nickname is the
   public identity used everywhere on the platform (bylines,
   avatars, comment authorship, mentions).
   ============================================================ */
window.FDM = window.FDM || {};
FDM.models = FDM.models || {};

/**
 * @typedef {Object} User
 * @property {string|null} id
 * @property {string} nickname        - public identity, unique, mandatory
 * @property {string} displayName     - optional formatted name shown alongside nickname
 * @property {string} email
 * @property {string|null} avatarUrl
 * @property {string} bio
 * @property {string} country
 * @property {string} professionalRole
 * @property {string[]} expertise
 * @property {'guest'|'member'|'expert'|'moderator'|'admin'} role
 * @property {boolean} verifiedExpert
 * @property {number} reputation
 * @property {string[]} badges
 * @property {string} joinedAt        - ISO date
 * @property {number} followersCount
 * @property {number} followingCount
 * @property {boolean} profileComplete
 * @property {Object} preferences         - {emailDigest, density}
 * @property {Object} notificationSettings - {replies, mentions, follows, admin}
 * @property {Object} privacySettings      - {showEmail, showCountry}
 *
 * NOTE: there is no `permissions` field on this model by design —
 * permissions are always DERIVED from `role` via FDM.permissions,
 * never stored on the user, so there is exactly one source of truth.
 */
FDM.models.createUser = function createUser(overrides){
  overrides = overrides || {};
  return Object.assign({
    id: null,
    nickname: '',
    displayName: '',
    email: '',
    avatarUrl: null,
    bio: '',
    country: '',
    professionalRole: '',
    expertise: [],
    role: 'guest',
    verifiedExpert: false,
    reputation: 0,
    badges: [],
    joinedAt: new Date().toISOString(),
    followersCount: 0,
    followingCount: 0,
    profileComplete: false,
    preferences: { emailDigest: true, density: 'comfortable' },
    notificationSettings: { replies: true, mentions: true, follows: true, admin: true },
    privacySettings: { showEmail: false, showCountry: true },
  }, overrides);
};
