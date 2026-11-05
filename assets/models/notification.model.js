/* ============================================================
   NOTIFICATION MODEL
   assets/models/notification.model.js
   ============================================================ */
window.FDM = window.FDM || {};
FDM.models = FDM.models || {};

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} userId      - recipient
 * @property {'reply'|'mention'|'accepted_answer'|'follow'|'vote'|'event'|'moderation'|'admin_announcement'|'system'} type
 * @property {string} actorNickname  - who triggered it
 * @property {string} message
 * @property {string} link
 * @property {boolean} isRead
 * @property {string} createdAt
 */
FDM.models.createNotification = function createNotification(overrides){
  overrides = overrides || {};
  return Object.assign({
    id: null,
    userId: null,
    type: 'reply',
    actorNickname: '',
    message: '',
    link: '#',
    isRead: false,
    createdAt: new Date().toISOString(),
  }, overrides);
};
