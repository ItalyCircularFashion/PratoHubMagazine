/* ============================================================
   PERMISSION MODEL
   assets/permissions/permissions.js

   ES Module conversion: named exports + compatibility bridge.
   ============================================================ */

/* ---- Constants / state published as named exports ---- */
export const ROLES = Object.freeze({
  GUEST: 'guest',
  MEMBER: 'member',
  EXPERT: 'expert',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
});

export const ROLE_ORDER = [ROLES.GUEST, ROLES.MEMBER, ROLES.EXPERT, ROLES.MODERATOR, ROLES.ADMIN];

export const ROLE_LABELS = {
  [ROLES.GUEST]: 'Guest',
  [ROLES.MEMBER]: 'Member',
  [ROLES.EXPERT]: 'Verified Expert',
  [ROLES.MODERATOR]: 'Moderator',
  [ROLES.ADMIN]: 'Administrator',
};

const ROLE_CAPABILITIES = {
  [ROLES.GUEST]: [
    'READ_PUBLIC_CONTENT', 'SEARCH_CONTENT',
  ],
  [ROLES.MEMBER]: [
    'CREATE_DISCUSSION', 'CREATE_QUESTION', 'COMMENT', 'REPLY', 'QUOTE_REPLY',
    'VOTE', 'BOOKMARK', 'FOLLOW_USER', 'FOLLOW_DISCUSSION', 'FOLLOW_CATEGORY',
    'RECEIVE_NOTIFICATIONS', 'EDIT_OWN_CONTENT', 'DELETE_OWN_CONTENT',
    'REPORT_CONTENT', 'PARTICIPATE_EVENTS', 'MENTION_USERS', 'ATTACH_MEDIA',
  ],
  [ROLES.EXPERT]: [],
  [ROLES.MODERATOR]: [
    'LOCK_THREAD', 'MERGE_THREAD', 'MOVE_DISCUSSION', 'REMOVE_CONTENT',
    'APPROVE_REPORTS', 'HIDE_COMMENT', 'WARN_USER',
  ],
  [ROLES.ADMIN]: [
    'PUBLISH_ARTICLE', 'EDIT_ANY_CONTENT', 'PIN_DISCUSSION', 'FEATURE_CONTENT',
    'MANAGE_USERS', 'ASSIGN_ROLES', 'VERIFY_EXPERT', 'MANAGE_HOMEPAGE',
    'MANAGE_NEWSLETTER', 'MANAGE_CATEGORIES', 'MANAGE_EVENTS', 'BAN_USER',
    'CONFIGURE_PERMISSIONS',
  ],
};

const UI_VISIBILITY = {
  commentComposer:        { capability: 'COMMENT' },
  createDiscussionButton: { capability: 'CREATE_DISCUSSION' },
  createQuestionButton:   { capability: 'CREATE_QUESTION' },
  voteControl:            { capability: 'VOTE' },
  bookmarkButton:         { capability: 'BOOKMARK' },
  followButton:           { capability: 'FOLLOW_USER' },
  notificationsBell:      { capability: 'RECEIVE_NOTIFICATIONS' },
  moderationToolbar:      { minRole: ROLES.MODERATOR },
  adminCmsLink:           { minRole: ROLES.ADMIN },
  pinDiscussionToggle:    { capability: 'PIN_DISCUSSION' },
};

function getCapabilities(role){
  const idx = ROLE_ORDER.indexOf(role);
  const safeIdx = idx === -1 ? 0 : idx;
  const set = new Set();
  for(let i=0; i<=safeIdx; i++){
    (ROLE_CAPABILITIES[ROLE_ORDER[i]] || []).forEach(cap => set.add(cap));
  }
  return set;
}

function roleOf(user){
  return (user && user.role && ROLE_ORDER.includes(user.role)) ? user.role : ROLES.GUEST;
}

/** Core check: does this user have this capability (inherited included)? */
export function can(user, capability){
  return getCapabilities(roleOf(user)).has(capability);
}

/** Is this user's role at or above the given role in the hierarchy? */
export function isAtLeast(user, role){
  return ROLE_ORDER.indexOf(roleOf(user)) >= ROLE_ORDER.indexOf(role);
}

/** Ownership-aware edit check: own content needs EDIT_OWN_CONTENT, any content needs EDIT_ANY_CONTENT. */
export function canEditContent(user, content){
  if(!user) return false;
  if(can(user, 'EDIT_ANY_CONTENT')) return true;
  return can(user, 'EDIT_OWN_CONTENT') && !!content && content.authorId === user.id;
}

/** Ownership-aware delete check, same pattern as edit. */
export function canDeleteContent(user, content){
  if(!user) return false;
  if(can(user, 'EDIT_ANY_CONTENT')) return true;
  return can(user, 'DELETE_OWN_CONTENT') && !!content && content.authorId === user.id;
}

/** Looks up a UI_VISIBILITY entry by key and resolves it for this user. */
export function canSee(user, uiKey){
  const rule = UI_VISIBILITY[uiKey];
  if(!rule) return false;
  if(rule.minRole) return isAtLeast(user, rule.minRole);
  if(rule.capability) return can(user, rule.capability);
  return false;
}

export function label(role){
  return ROLE_LABELS[role] || ROLE_LABELS[ROLES.GUEST];
}

/* ---- Named convenience functions ---- */
export function canReadArticle(user, article){
  if(!article || article.status === 'published') return true;
  return isAtLeast(user, ROLES.ADMIN); // drafts/scheduled/archived: admins only
}
export function canCreateDiscussion(user){ return can(user, 'CREATE_DISCUSSION'); }
export function canCreateQuestion(user){ return can(user, 'CREATE_QUESTION'); }
export function canComment(user){ return can(user, 'COMMENT'); }
export function canVote(user){ return can(user, 'VOTE'); }
export function canBookmark(user){ return can(user, 'BOOKMARK'); }
export function canFollow(user){ return can(user, 'FOLLOW_USER') || can(user, 'FOLLOW_DISCUSSION'); }
export function canCreateNews(user){ return can(user, 'PUBLISH_ARTICLE'); }
export function canPublishArticle(user){ return can(user, 'PUBLISH_ARTICLE'); }
export function canEditComment(user, comment){ return canEditContent(user, comment); }
export function canDeleteComment(user, comment){ return can(user, 'REMOVE_CONTENT') || canDeleteContent(user, comment); }
export function canModerateDiscussion(user){ return isAtLeast(user, ROLES.MODERATOR); }
export function canLockDiscussion(user){ return can(user, 'LOCK_THREAD'); }
export function canPinDiscussion(user){ return can(user, 'PIN_DISCUSSION'); }
export function canBanUser(user){ return can(user, 'BAN_USER'); }
export function canAssignRoles(user){ return can(user, 'ASSIGN_ROLES'); }
export function canVerifyExpert(user){ return can(user, 'VERIFY_EXPERT'); }
export function canAccessAdmin(user){ return isAtLeast(user, ROLES.ADMIN); }
export function canAccessModeration(user){ return isAtLeast(user, ROLES.MODERATOR); }
export function canReportContent(user){ return can(user, 'REPORT_CONTENT'); }

export function getCapabilitiesForRole(role){
  return getCapabilities(role);
}

export function roleOfUser(user){
  return roleOf(user);
}
