/* ============================================================
   COMMENT COMPONENT
   assets/components/comment.component.js
   ============================================================ */

import { renderCommentItem, renderEmptyState } from '../renderers/card.renderer.js';
import { renderVoteControl, gateOrCta } from './ui.js';
import { canReportContent, canComment } from '../permissions/permissions.js';
import { getCurrentUser } from '../services/auth.js';
import { createComment } from '../models/comment.model.js';

const registry = new Map();

export function mountThread(containerId, comments, resolveAuthor, opts){
  const container = document.getElementById(containerId);
  if(!container) return;
  opts = opts || {};
  container.innerHTML = '';
  registry.set(containerId, { comments, resolveAuthor, opts });

  const composerWrap = document.createElement('div');
  composerWrap.className = 'thread-composer';
  composerWrap.innerHTML = gateOrCta('COMMENT', `
    <form class="composer">
      <textarea class="composer-input" rows="3" placeholder="${opts.composerPlaceholder || 'Share your perspective… (Markdown supported)'}"></textarea>
      <div class="composer-actions">
        <span class="composer-hint">Markdown · @mentions · attachments</span>
        <button type="submit" class="btn btn-primary">Post</button>
      </div>
    </form>`, 'Sign in to comment');
  container.appendChild(composerWrap);

  const list = document.createElement('div');
  list.className = 'thread-list';
  container.appendChild(list);

  if(!comments.length){
    list.appendChild(renderEmptyState(opts.emptyMessage || 'No comments yet — be the first to weigh in.'));
  } else {
    const tree = buildTree(comments, resolveAuthor);
    tree.forEach(node => {
      const voteHtml = renderVoteControl(node.comment.voteCount, 'comment', node.comment.id);
      list.appendChild(renderCommentItem(node.comment, node.author, node.children, voteHtml));
    });
  }

  if(!container.dataset.fdmThreadBound){
    document.addEventListener('fdm:authchange', () => mountThread(containerId, registry.get(containerId).comments, registry.get(containerId).resolveAuthor, registry.get(containerId).opts));
    container.addEventListener('click', (e) => handleClick(e, containerId));
    container.addEventListener('submit', (e) => handleSubmit(e, containerId));
    container.dataset.fdmThreadBound = '1';
  }
}

export function buildTree(comments, resolveAuthor){
  const byId = {};
  comments.forEach(c => byId[c.id] = { comment: c, author: resolveAuthor(c.authorId), children: [] });
  const roots = [];
  comments.forEach(c => {
    if(c.parentId && byId[c.parentId]) byId[c.parentId].children.push(byId[c.id]);
    else roots.push(byId[c.id]);
  });
  return roots;
}

export function signInPrompt(actionsRow, message){
  if(actionsRow.querySelector('.signin-cta')) return;
  actionsRow.insertAdjacentHTML('beforeend', `<a class="signin-cta" href="login.html">${message || 'Sign in to participate'}</a>`);
}

export function handleClick(e, containerId){
  const actionBtn = e.target.closest('.comment-action');
  if(!actionBtn || actionBtn.classList.contains('comment-expand')) return;
  const item = actionBtn.closest('.comment-item');
  const label = actionBtn.textContent.trim();
  const user = getCurrentUser();
  const entry = registry.get(containerId);

  if(label === 'Report'){
    if(!canReportContent(user)) return signInPrompt(actionBtn.parentElement);
    const comment = entry.comments.find(c => c.id === item.dataset.commentId);
    comment.reportCount += 1; comment.isReported = true;
    item.querySelector('.comment-report-status').textContent = 'Reported';
    actionBtn.disabled = true;
    return;
  }
  if(label === 'Reply' || label === 'Quote'){
    if(!canComment(user)) return signInPrompt(actionBtn.parentElement);
    toggleReplyBox(item, entry, label === 'Quote');
  }
}

export function toggleReplyBox(item, entry, isQuote){
  const existing = item.querySelector('.inline-reply-box');
  if(existing){ existing.remove(); return; }
  const comment = entry.comments.find(c => c.id === item.dataset.commentId);
  const box = document.createElement('div');
  box.className = 'inline-reply-box';
  box.innerHTML = gateOrCta('COMMENT', `
    <form class="composer">
      <textarea class="composer-input" rows="3" placeholder="${isQuote ? 'Write a reply…' : 'Write a reply…'}"></textarea>
      <div class="composer-actions">
        <span class="composer-hint">Markdown · @mentions · attachments</span>
        <button type="submit" class="btn btn-primary">Post</button>
      </div>
    </form>`, 'Sign in to comment');
  item.querySelector('.comment-body-col').appendChild(box);
  const textarea = box.querySelector('textarea');
  if(textarea){
    if(isQuote) textarea.value = `> ${comment.body}\n\n`;
    textarea.focus();
  }
}

export function handleSubmit(e, containerId){
  const box = e.target.closest('.inline-reply-box');
  const topComposer = e.target.closest('.thread-composer');
  if(!box && !topComposer) return;
  e.preventDefault();
  const textarea = e.target.querySelector('textarea');
  const body = textarea ? textarea.value.trim() : '';
  const user = getCurrentUser();
  if(!body || !user) return;

  const entry = registry.get(containerId);
  const parentItem = box ? box.closest('.comment-item') : null;
  const sample = entry.comments[0];
  const newComment = createComment({
    id: 'c-' + Date.now(),
    targetType: sample ? sample.targetType : 'discussion',
    targetId: sample ? sample.targetId : null,
    parentId: parentItem ? parentItem.dataset.commentId : null,
    authorId: user.id, roleBadgeAtPost: user.role, body,
  });
  entry.comments.push(newComment);

  if(parentItem){
    const voteHtml = renderVoteControl(newComment.voteCount, 'comment', newComment.id);
    parentItem.querySelector('.comment-children').appendChild(renderCommentItem(newComment, user, [], voteHtml));
    box.remove();
  } else {
    const list = document.getElementById(containerId).querySelector('.thread-list');
    const emptyState = list.querySelector('.state-empty');
    if(emptyState) emptyState.remove();
    const voteHtmlNew = renderVoteControl(newComment.voteCount, 'comment', newComment.id);
    list.appendChild(renderCommentItem(newComment, user, [], voteHtmlNew));
    textarea.value = '';
  }
}

