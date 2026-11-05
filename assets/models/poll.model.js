/* ============================================================
   POLL MODEL
   assets/models/poll.model.js
   ============================================================ */
window.FDM = window.FDM || {};
FDM.models = FDM.models || {};

/**
 * @typedef {Object} PollOption
 * @property {string} id
 * @property {string} label
 * @property {number} votes
 *
 * @typedef {Object} Poll
 * @property {string} id
 * @property {string} question
 * @property {'article'|'discussion'|'question'} targetType
 * @property {string} targetId
 * @property {PollOption[]} options
 */
FDM.models.createPoll = function createPoll(overrides){
  overrides = overrides || {};
  return Object.assign({
    id: null,
    question: '',
    targetType: 'article',
    targetId: null,
    options: [],
  }, overrides);
};
