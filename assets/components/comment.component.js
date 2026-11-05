/* ============================================================
   COMMENT COMPONENT
   assets/components/comment.component.js
   Mounts a full comment/reply thread (nested) plus the
   permission-gated composer above it. Used by article.html,
   discussion threads and question pages alike — none of them
   re-implement comment rendering or permission checks.
   ============================================================ */
window.FDM = window.FDM || {};

(function(){

  /** Builds a {comment, author, children:[...]} tree from a flat comment list. */
  function buildTree(comments, resolveAuthor){
    const byId = {};
    comments.forEach(c => byId[c.id] = { comment: c, author: resolveAuthor(c.authorId), children: [] });
    const roots = [];
    comments.forEach(c => {
      if(c.parentId && byId[c.parentId]) byId[c.parentId].children.push(byId[c.id]);
      else roots.push(byId[c.id]);
    });
    return roots;
  }

  // containerId -> {comments, resolveAuthor, opts} — lets delegated handlers mutate the live list.
  const registry = new Map();

  /**
   * Mounts a full thread into `containerId`.
   * @param {string} containerId
   * @param {Array} comments - flat list, FDM.models.createComment() shape
   * @param {function} resolveAuthor - (authorId) => User
   * @param {Object} [opts] - {composerPlaceholder, emptyMessage}
   */
  function mountThread(containerId, comments, resolveAuthor, opts){
    const container = document.getElementById(containerId);
    if(!container) return;
    opts = opts || {};
    container.innerHTML = '';
    registry.set(containerId, { comments, resolveAuthor, opts });

    const composerWrap = document.createElement('div');
    composerWrap.className = 'thread-composer';
    composerWrap.innerHTML = FDM.components.renderCommentComposer(opts.composerPlaceholder);
    container.appendChild(composerWrap);

    const list = document.createElement('div');
    list.className = 'thread-list';
    container.appendChild(list);

    if(!comments.length){
      list.appendChild(renderEmptyState(opts.emptyMessage || 'No comments yet — be the first to weigh in.'));
    } else {
      const tree = buildTree(comments, resolveAuthor);
      tree.forEach(node => {
        const voteHtml = FDM.components.renderVoteControl(node.comment.voteCount, 'comment', node.comment.id);
        list.appendChild(renderCommentItem(node.comment, node.author, node.children, voteHtml));
      });
    }

    if(!container.dataset.fdmThreadBound){
      // Re-mount on auth change so the composer/CTA always reflects the current user.
      document.addEventListener('fdm:authchange', () => mountThread(containerId, registry.get(containerId).comments, registry.get(containerId).resolveAuthor, registry.get(containerId).opts));
      container.addEventListener('click', (e) => handleClick(e, containerId));
      container.addEventListener('submit', (e) => handleSubmit(e, containerId));
      container.dataset.fdmThreadBound = '1';
    }
  }

  function signInPrompt(actionsRow, message){
    if(actionsRow.querySelector('.signin-cta')) return;
    actionsRow.insertAdjacentHTML('beforeend', `<a class="signin-cta" href="demo.html">${message || 'Sign in to participate'}</a>`);
  }

  function handleClick(e, containerId){
    const actionBtn = e.target.closest('.comment-action');
    if(!actionBtn || actionBtn.classList.contains('comment-expand')) return;
    const item = actionBtn.closest('.comment-item');
    const label = actionBtn.textContent.trim();
    const user = FDM.auth.getCurrentUser();
    const entry = registry.get(containerId);

    if(label === 'Report'){
      if(!FDM.permissions.canReportContent(user)) return signInPrompt(actionBtn.parentElement);
      const comment = entry.comments.find(c => c.id === item.dataset.commentId);
      comment.reportCount += 1; comment.isReported = true;
      item.querySelector('.comment-report-status').textContent = 'Reported';
      actionBtn.disabled = true;
      return;
    }
    if(label === 'Reply' || label === 'Quote'){
      if(!FDM.permissions.canComment(user)) return signInPrompt(actionBtn.parentElement);
      toggleReplyBox(item, entry, label === 'Quote');
    }
  }

  function toggleReplyBox(item, entry, isQuote){
    const existing = item.querySelector('.inline-reply-box');
    if(existing){ existing.remove(); return; }
    const comment = entry.comments.find(c => c.id === item.dataset.commentId);
    const box = document.createElement('div');
    box.className = 'inline-reply-box';
    box.innerHTML = FDM.components.renderCommentComposer('Write a reply…');
    item.querySelector('.comment-body-col').appendChild(box);
    const textarea = box.querySelector('textarea');
    if(textarea){
      if(isQuote) textarea.value = `> ${comment.body}\n\n`;
      textarea.focus();
    }
  }

  function handleSubmit(e, containerId){
    const box = e.target.closest('.inline-reply-box');
    const topComposer = e.target.closest('.thread-composer');
    if(!box && !topComposer) return;
    e.preventDefault();
    const textarea = e.target.querySelector('textarea');
    const body = textarea ? textarea.value.trim() : '';
    const user = FDM.auth.getCurrentUser();
    if(!body || !user) return;

    const entry = registry.get(containerId);
    const parentItem = box ? box.closest('.comment-item') : null;
    const sample = entry.comments[0];
    const newComment = FDM.models.createComment({
      id: 'c-' + Date.now(),
      targetType: sample ? sample.targetType : 'discussion',
      targetId: sample ? sample.targetId : null,
      parentId: parentItem ? parentItem.dataset.commentId : null,
      authorId: user.id, roleBadgeAtPost: user.role, body,
    });
    entry.comments.push(newComment);

    if(parentItem){
      const voteHtml = FDM.components.renderVoteControl(newComment.voteCount, 'comment', newComment.id);
      parentItem.querySelector('.comment-children').appendChild(renderCommentItem(newComment, user, [], voteHtml));
      box.remove();
    } else {
      const list = document.getElementById(containerId).querySelector('.thread-list');
      const emptyState = list.querySelector('.state-empty');
      if(emptyState) emptyState.remove();
      const voteHtmlNew = FDM.components.renderVoteControl(newComment.voteCount, 'comment', newComment.id);
      list.appendChild(renderCommentItem(newComment, user, [], voteHtmlNew));
      textarea.value = '';
    }
  }

  FDM.commentComponent = { mountThread, buildTree };

})();
