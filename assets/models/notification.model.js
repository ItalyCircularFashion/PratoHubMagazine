/* ============================================================
   NOTIFICATION MODEL
   assets/models/notification.model.js
   ============================================================ */

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
export function createNotification(overrides){
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
}
