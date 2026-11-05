/* ============================================================
   COMMENT MODEL
   assets/models/comment.model.js

   One shape covers article comments, discussion replies and
   question answers. `targetType`/`targetId` make it polymorphic
   instead of needing three near-identical models.
   ============================================================ */
window.FDM = window.FDM || {};
FDM.models = FDM.models || {};

/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {'article'|'discussion'|'question'} targetType
 * @property {string} targetId
 * @property {string|null} parentId        - set for nested replies/quotes
 * @property {string} authorId
 * @property {string} roleBadgeAtPost      - snapshot of the author's role when posted
 * @property {string} body                 - markdown
 * @property {string[]} mentions           - nicknames mentioned
 * @property {Object[]} attachments        - [{name, url, type}]
 * @property {string} createdAt
 * @property {string|null} editedAt
 * @property {number} likeCount
 * @property {number} voteCount
 * @property {boolean} isAcceptedAnswer
 * @property {boolean} isPinned
 * @property {boolean} isHidden            - moderation action
 * @property {boolean} isCollapsed         - long-reply UI collapse
 * @property {number} reportCount
 * @property {boolean} isReported
 */
FDM.models.createComment = function createComment(overrides){
  overrides = overrides || {};
  return Object.assign({
    id: null,
    targetType: 'discussion',
    targetId: null,
    parentId: null,
    authorId: null,
    roleBadgeAtPost: 'member',
    body: '',
    mentions: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    editedAt: null,
    likeCount: 0,
    voteCount: 0,
    isAcceptedAnswer: false,
    isPinned: false,
    isHidden: false,
    isCollapsed: false,
    reportCount: 0,
    isReported: false,
  }, overrides);
};
