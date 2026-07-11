/* ============================================================
import { getCurrentUser, isAuthenticated, login, logout, setMockUser, MOCK_USERS } from '../services/auth.js';
import { notifications } from '../data/notifications.data.js';
   UI COMPONENTS
   assets/components/ui.js
   ============================================================ */

import { can, isAtLeast, label, ROLES } from '../permissions/permissions.js';
import { getCurrentUser } from '../services/auth.js';
import { getVoteState } from '../services/session.service.js';

export function renderRoleBadge(user){
  if(!user || !user.role || user.role === 'guest') return '';
  const cls = 'role-badge role-badge--' + user.role;
  const labels = { member:'Member', expert:'Expert', moderator:'Moderator', admin:'Admin' };
  return `<span class="${cls}">${labels[user.role] || user.role}</span>`;
}
export function renderAuthNav(){
  const user = getCurrentUser();
  if(!user){
    return `
      <a href="login.html" class="auth-link">Sign In</a>
      <a href="register.html" class="btn btn-primary">Join the Community</a>`;
  }
  const unread = (window.notifications || []).filter(n => n.userId === user.id && !n.isRead).length;
  return `
    <a href="notifications.html" class="auth-bell" aria-label="Notifications, ${unread} unread">
      🔔${unread ? '<span class="auth-bell-dot"></span>' : ''}
    </a>
    <a href="profile.html" class="auth-user">
      <img class="avatar" src="${user.avatarUrl}" alt="">
      <span class="auth-user-name">${user.nickname}</span>
      ${renderRoleBadge(user)}
    </a>`;
}
export function mountAuthNav(){
  const el = document.getElementById('authNav');
  if(!el) return;
  el.innerHTML = renderAuthNav();
}
export function isVisibleFor(node, user){
  if(node.hasAttribute('data-require-guest')) return !user;
  const cap = node.getAttribute('data-require-capability');
  if(cap) return can(user, cap);
  const role = node.getAttribute('data-require-role');
  if(role) return isAtLeast(user, role);
  return true;
}
export function applyPermissionVisibility(){
  const user = getCurrentUser();
  document.querySelectorAll('[data-require-capability], [data-require-role], [data-require-guest]')
    .forEach(node => {
      const visible = isVisibleFor(node, user);
      node.style.display = visible ? '' : 'none';
    });
}
export function gateOrCta(capability, controlHtml, ctaLabel){
  const user = getCurrentUser();
  if(can(user, capability)) return controlHtml;
  return `<a class="signin-cta" href="login.html">${ctaLabel || 'Sign in to participate'}</a>`;
}
export function renderCommentComposer(placeholder){
  return gateOrCta('COMMENT', `
    <form class="composer">
      <textarea class="composer-input" rows="3" placeholder="${placeholder || 'Share your perspective… (Markdown supported)'}"></textarea>
      <div class="composer-actions">
        <span class="composer-hint">Markdown · @mentions · attachments</span>
        <button type="submit" class="btn btn-primary">Post</button>
      </div>
    </form>`, 'Sign in to comment');
}
export function renderVoteControl(count, targetType, targetId){
  const user = getCurrentUser();
  const enabled = can(user, 'VOTE');
  const voteState = (targetType && targetId) ? getVoteState(targetType, targetId) : null;
  return `
    <div class="vote-control ${enabled ? '' : 'is-disabled'}" data-target-type="${targetType || ''}" data-target-id="${targetId || ''}">
      <button class="vote-btn ${voteState==='up'?'is-active':''}" data-dir="up" ${enabled ? '' : 'disabled title="Sign in to vote"'}>▲</button>
      <span class="vote-count">${count}</span>
      <button class="vote-btn ${voteState==='down'?'is-active':''}" data-dir="down" ${enabled ? '' : 'disabled title="Sign in to vote"'}>▼</button>
    </div>`;
}
export function mountRoleSwitcher(){
  if(document.getElementById('devRoleSwitcher')) return;
  const wrap = document.createElement('div');
  wrap.className = 'dev-role-switcher';
  wrap.id = 'devRoleSwitcher';
  wrap.innerHTML = `
    <span class="drs-label">Preview as</span>
    <select id="devRoleSelect" aria-label="Preview as role">
      <option value="guest">Guest</option>
      <option value="member">Member</option>
      <option value="expert">Verified Expert</option>
      <option value="moderator">Moderator</option>
      <option value="admin">Administrator</option>
    </select>`;
  document.body.appendChild(wrap);
  wrap.querySelector('select').addEventListener('change', (e) => {
    setMockUser(e.target.value);
  });
}

window.addEventListener('fdm:authchange', () => {
  mountAuthNav();
  applyPermissionVisibility();
});

mountAuthNav();
applyPermissionVisibility();
mountRoleSwitcher();