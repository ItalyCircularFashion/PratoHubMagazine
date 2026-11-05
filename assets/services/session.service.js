/* ============================================================
   SESSION SERVICE
   assets/services/session.service.js
   In-memory session/preferences store. Intentionally NOT backed
   by localStorage/sessionStorage — resets per page load until a
   real backend-issued session exists. Same API shape a persisted
   version would expose, so swapping the implementation later
   doesn't touch any calling code.
   ============================================================ */
window.FDM = window.FDM || {};

(function(){
  const state = {
    theme: 'light',          // platform is light-mode only by design; kept for API completeness
    preferences: { emailDigest: true, density: 'comfortable' },
    notificationSettings: { replies: true, mentions: true, follows: true, admin: true },
    privacySettings: { showEmail: false, showCountry: true },
    bookmarks: [],            // [{targetType, targetId}]
    followedDiscussions: [],
    followedUsers: [],
  };

  function get(key){ return state[key]; }
  function set(key, value){ state[key] = value; document.dispatchEvent(new CustomEvent('fdm:sessionchange', {detail:{key,value}})); }

  /** Generic toggle for any {targetType,targetId} collection in state (bookmarks, follows, ...). */
  function toggleInCollection(collectionKey, targetType, targetId){
    const list = state[collectionKey];
    const idx = list.findIndex(b => b.targetType===targetType && b.targetId===targetId);
    if(idx === -1) list.push({targetType, targetId});
    else list.splice(idx,1);
    set(collectionKey, list);
    return idx === -1;
  }
  function isInCollection(collectionKey, targetType, targetId){
    return state[collectionKey].some(b => b.targetType===targetType && b.targetId===targetId);
  }

  const toggleBookmark = (targetType, targetId) => toggleInCollection('bookmarks', targetType, targetId);
  const isBookmarked   = (targetType, targetId) => isInCollection('bookmarks', targetType, targetId);
  const toggleFollow   = (targetType, targetId) => toggleInCollection('followedDiscussions', targetType, targetId);
  const isFollowing    = (targetType, targetId) => isInCollection('followedDiscussions', targetType, targetId);

  // ---- Voting: Reddit-style — clicking the same direction again retracts the vote ----
  const votes = {}; // `${targetType}:${targetId}` -> 'up'|'down'|null
  const voteValue = (dir) => dir === 'up' ? 1 : dir === 'down' ? -1 : 0;
  /** Casts (or retracts) a vote; returns the delta to apply to a displayed count. */
  function castVote(targetType, targetId, direction){
    const key = targetType + ':' + targetId;
    const current = votes[key] || null;
    const next = current === direction ? null : direction;
    votes[key] = next;
    return voteValue(next) - voteValue(current);
  }
  function getVoteState(targetType, targetId){
    return votes[targetType + ':' + targetId] || null;
  }

  FDM.session = { get, set, toggleBookmark, isBookmarked, toggleFollow, isFollowing, toggleInCollection, isInCollection, castVote, getVoteState };
})();
