/* ============================================================
   SESSION SERVICE
   assets/services/session.service.js

   In-memory session/preferences store.
   ============================================================ */

/* ---- Module state ---- */
const state = {
  theme: 'light',
  preferences: { emailDigest: true, density: 'comfortable' },
  notificationSettings: { replies: true, mentions: true, follows: true, admin: true },
  privacySettings: { showEmail: false, showCountry: true },
  bookmarks: [],
  followedDiscussions: [],
  followedUsers: [],
};

export function get(key){ return state[key]; }
export function set(key, value){ state[key] = value; document.dispatchEvent(new CustomEvent('fdm:sessionchange', {detail:{key,value}})); }

export function toggleInCollection(collectionKey, targetType, targetId){
  const list = state[collectionKey];
  const idx = list.findIndex(b => b.targetType===targetType && b.targetId===targetId);
  if(idx === -1) list.push({targetType, targetId});
  else list.splice(idx,1);
  set(collectionKey, list);
  return idx === -1;
}
export function isInCollection(collectionKey, targetType, targetId){
  return state[collectionKey].some(b => b.targetType===targetType && b.targetId===targetId);
}

export const toggleBookmark = (targetType, targetId) => toggleInCollection('bookmarks', targetType, targetId);
export const isBookmarked   = (targetType, targetId) => isInCollection('bookmarks', targetType, targetId);
export const toggleFollow   = (targetType, targetId) => toggleInCollection('followedDiscussions', targetType, targetId);
export const isFollowing    = (targetType, targetId) => isInCollection('followedDiscussions', targetType, targetId);

/* ---- Voting ---- */
const votes = {};
const voteValue = (dir) => dir === 'up' ? 1 : dir === 'down' ? -1 : 0;
export function castVote(targetType, targetId, direction){
  const key = targetType + ':' + targetId;
  const current = votes[key] || null;
  const next = current === direction ? null : direction;
  votes[key] = next;
  return voteValue(next) - voteValue(current);
}
export function getVoteState(targetType, targetId){
  return votes[targetType + ':' + targetId] || null;
}

/* ---- Compatibility bridge ---- */
window.FDM = window.FDM || {};
window.FDM.session = {
  get, set, toggleBookmark, isBookmarked, toggleFollow, isFollowing, toggleInCollection, isInCollection, castVote, getVoteState
};
