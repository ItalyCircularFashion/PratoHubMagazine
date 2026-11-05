/* ============================================================
   DISCUSSION MODEL
   assets/models/discussion.model.js
   ============================================================ */
window.FDM = window.FDM || {};
FDM.models = FDM.models || {};

/**
 * @typedef {Object} Discussion
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} authorId
 * @property {string} category
 * @property {string[]} tags
 * @property {string} body                    - markdown
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} viewCount
 * @property {number} replyCount
 * @property {number} voteCount
 * @property {string[]} followerIds
 * @property {number} readingTime              - minutes
 * @property {'open'|'locked'|'merged'|'removed'} moderationStatus
 * @property {boolean} isPinned
 * @property {string|null} acceptedAnswerId     - comment id, optional
 * @property {string[]} relatedArticleIds
 * @property {string[]} relatedQuestionIds
 * @property {string[]} relatedDiscussionIds
 * @property {string[]} recommendedExpertIds
 * @property {string[]} moderatorNotes        - internal notes, never shown to regular users
 */
FDM.models.createDiscussion = function createDiscussion(overrides){
  overrides = overrides || {};
  return Object.assign({
    id: null,
    title: '',
    slug: '',
    authorId: null,
    category: '',
    tags: [],
    body: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 0,
    replyCount: 0,
    voteCount: 0,
    followerIds: [],
    readingTime: 1,
    moderationStatus: 'open',
    isPinned: false,
    acceptedAnswerId: null,
    relatedArticleIds: [],
    relatedQuestionIds: [],
    relatedDiscussionIds: [],
    recommendedExpertIds: [],
    moderatorNotes: [],
  }, overrides);
};
