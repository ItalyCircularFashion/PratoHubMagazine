/* ============================================================
   QUESTION MODEL
   assets/models/question.model.js
   ============================================================ */
window.FDM = window.FDM || {};
FDM.models = FDM.models || {};

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {string} authorId
 * @property {string} category
 * @property {string[]} tags
 * @property {'beginner'|'intermediate'|'advanced'} difficulty
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} viewCount
 * @property {number} voteCount
 * @property {number} answerCount
 * @property {string|null} acceptedAnswerId
 * @property {string|null} expertId          - denormalized: expert who gave the accepted answer
 * @property {boolean} accepted
 * @property {string[]} followerIds
 * @property {string[]} relatedArticleIds
 * @property {string[]} relatedDiscussionIds
 * @property {string[]} relatedQuestionIds
 * @property {string[]} recommendedExpertIds
 */
FDM.models.createQuestion = function createQuestion(overrides){
  overrides = overrides || {};
  return Object.assign({
    id: null,
    title: '',
    body: '',
    authorId: null,
    category: '',
    tags: [],
    difficulty: 'intermediate',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 0,
    voteCount: 0,
    answerCount: 0,
    acceptedAnswerId: null,
    expertId: null,
    accepted: false,
    followerIds: [],
    relatedArticleIds: [],
    relatedDiscussionIds: [],
    relatedQuestionIds: [],
    recommendedExpertIds: [],
  }, overrides);
};
