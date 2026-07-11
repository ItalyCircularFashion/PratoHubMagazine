/* ============================================================
   VOTE MODEL
   assets/models/vote.model.js
   ============================================================ */

/**
 * @typedef {Object} Vote
 * @property {string} id
 * @property {string} userId
 * @property {'discussion'|'comment'|'question'} targetType
 * @property {string} targetId
 * @property {1|-1} value
 * @property {string} createdAt
 */
export function createVote(overrides){
  overrides = overrides || {};
  return Object.assign({
    id: null,
    userId: null,
    targetType: 'discussion',
    targetId: null,
    value: 1,
    createdAt: new Date().toISOString(),
  }, overrides);
}
