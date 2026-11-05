/* ============================================================
   PERMISSION MODEL
   assets/permissions/permissions.js

   Single source of truth for every "can this user do X" check
   on the platform. No page, component or script should ever
   write `if (user.role === 'admin')` directly — always go
   through FDM.permissions.can(user, CAPABILITY) so the rule
   lives in exactly one place.
   ============================================================ */
window.FDM = window.FDM || {};

(function(){

  const ROLES = Object.freeze({
    GUEST: 'guest',
    MEMBER: 'member',
    EXPERT: 'expert',
    MODERATOR: 'moderator',
    ADMIN: 'admin',
  });

  // Order defines inheritance: each role inherits every capability
  // of every role to its left.
  const ROLE_ORDER = [ROLES.GUEST, ROLES.MEMBER, ROLES.EXPERT, ROLES.MODERATOR, ROLES.ADMIN];

  const ROLE_LABELS = {
    [ROLES.GUEST]: 'Guest',
    [ROLES.MEMBER]: 'Member',
    [ROLES.EXPERT]: 'Verified Expert',
    [ROLES.MODERATOR]: 'Moderator',
    [ROLES.ADMIN]: 'Administrator',
  };

  // Capabilities introduced AT each role level (not cumulative —
  // cumulative resolution happens in getCapabilities()).
  // Verified Expert intentionally adds NO new gated actions: per
  // spec it has the same actions as Member, plus display-only
  // attributes (badge, highlighted answers, ranking) that are
  // read off the user object directly (user.verifiedExpert),
  // not gated through a capability.
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

  // ---- UI visibility map (documentation + single lookup table) ----
  // Mirrors the spec's per-role UI examples. Components can consult
  // this directly, but the underlying gate is always can()/isAtLeast().
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
  function can(user, capability){
    return getCapabilities(roleOf(user)).has(capability);
  }

  /** Is this user's role at or above the given role in the hierarchy? */
  function isAtLeast(user, role){
    return ROLE_ORDER.indexOf(roleOf(user)) >= ROLE_ORDER.indexOf(role);
  }

  /** Ownership-aware edit check: own content needs EDIT_OWN_CONTENT, any content needs EDIT_ANY_CONTENT. */
  function canEditContent(user, content){
    if(!user) return false;
    if(can(user, 'EDIT_ANY_CONTENT')) return true;
    return can(user, 'EDIT_OWN_CONTENT') && !!content && content.authorId === user.id;
  }

  /** Ownership-aware delete check, same pattern as edit. */
  function canDeleteContent(user, content){
    if(!user) return false;
    if(can(user, 'EDIT_ANY_CONTENT')) return true;
    return can(user, 'DELETE_OWN_CONTENT') && !!content && content.authorId === user.id;
  }

  /** Looks up a UI_VISIBILITY entry by key and resolves it for this user. */
  function canSee(user, uiKey){
    const rule = UI_VISIBILITY[uiKey];
    if(!rule) return false;
    if(rule.minRole) return isAtLeast(user, rule.minRole);
    if(rule.capability) return can(user, rule.capability);
    return false;
  }

  function label(role){
    return ROLE_LABELS[role] || ROLE_LABELS[ROLES.GUEST];
  }

  /* ---- Named convenience functions — what every page should actually call ---- */
  function canReadArticle(user, article){
    if(!article || article.status === 'published') return true;
    return isAtLeast(user, ROLES.ADMIN); // drafts/scheduled/archived: admins only
  }
  function canCreateDiscussion(user){ return can(user, 'CREATE_DISCUSSION'); }
  function canCreateQuestion(user){ return can(user, 'CREATE_QUESTION'); }
  function canComment(user){ return can(user, 'COMMENT'); }
  function canVote(user){ return can(user, 'VOTE'); }
  function canBookmark(user){ return can(user, 'BOOKMARK'); }
  function canFollow(user){ return can(user, 'FOLLOW_USER') || can(user, 'FOLLOW_DISCUSSION'); }
  function canCreateNews(user){ return can(user, 'PUBLISH_ARTICLE'); }
  function canPublishArticle(user){ return can(user, 'PUBLISH_ARTICLE'); }
  function canEditComment(user, comment){ return canEditContent(user, comment); }
  function canDeleteComment(user, comment){ return can(user, 'REMOVE_CONTENT') || canDeleteContent(user, comment); }
  function canModerateDiscussion(user){ return isAtLeast(user, ROLES.MODERATOR); }
  function canLockDiscussion(user){ return can(user, 'LOCK_THREAD'); }
  function canPinDiscussion(user){ return can(user, 'PIN_DISCUSSION'); }
  function canBanUser(user){ return can(user, 'BAN_USER'); }
  function canAssignRoles(user){ return can(user, 'ASSIGN_ROLES'); }
  function canVerifyExpert(user){ return can(user, 'VERIFY_EXPERT'); }
  function canAccessAdmin(user){ return isAtLeast(user, ROLES.ADMIN); }
  function canAccessModeration(user){ return isAtLeast(user, ROLES.MODERATOR); }
  function canReportContent(user){ return can(user, 'REPORT_CONTENT'); }

  FDM.permissions = {
    ROLES, ROLE_ORDER, ROLE_LABELS, UI_VISIBILITY,
    can, isAtLeast, canEditContent, canDeleteContent, canSee, label,
    getCapabilities, roleOf,
    // named convenience layer:
    canReadArticle, canCreateDiscussion, canCreateQuestion, canComment, canVote,
    canBookmark, canFollow, canCreateNews, canPublishArticle, canEditComment,
    canDeleteComment, canModerateDiscussion, canLockDiscussion, canPinDiscussion,
    canBanUser, canAssignRoles, canVerifyExpert, canAccessAdmin, canAccessModeration, canReportContent,
  };

})();
