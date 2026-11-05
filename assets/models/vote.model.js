/* ============================================================
   VOTE MODEL
   assets/models/vote.model.js
   ============================================================ */
window.FDM = window.FDM || {};
FDM.models = FDM.models || {};

/**
 * @typedef {Object} Vote
 * @property {string} id
 * @property {string} userId
 * @property {'discussion'|'comment'|'question'} targetType
 * @property {string} targetId
 * @property {1|-1} value
 * @property {string} createdAt
 */
FDM.models.createVote = function createVote(overrides){
  overrides = overrides || {};
  return Object.assign({
    id: null,
    userId: null,
    targetType: 'discussion',
    targetId: null,
    value: 1,
    createdAt: new Date().toISOString(),
  }, overrides);
};
