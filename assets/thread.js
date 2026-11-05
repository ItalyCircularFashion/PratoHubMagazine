(function(){
"use strict";
/* ============================================================
   THREAD.JS — page-specific composition for thread.html only.
   ============================================================ */

const discussion = FDM.knowledgeGraph.findDiscussion(new URLSearchParams(location.search).get('id') || 'disc-erp');

if(!discussion){
  document.getElementById('threadHero').appendChild(renderErrorState('This discussion could not be found.'));
} else {
  renderThreadPage(discussion);
}

function renderThreadPage(discussion){
  const author = FDM.knowledgeGraph.findUser(discussion.authorId);

  FDM.navigation.mountBreadcrumbs('threadBreadcrumbs', [
    { label:'Home', href:'index.html' },
    { label:'Discussions', href:'discussions.html' },
    { label:discussion.category, href:'discussions.html' },
    { label:'Thread' },
  ]);

  document.getElementById('threadBadges').innerHTML = [
    `<span class="eyebrow" style="display:inline-flex;">${discussion.category}</span>`,
    discussion.isPinned ? '<span class="tag">Pinned</span>' : '',
    discussion.acceptedAnswerId ? '<span class="tag" style="color:var(--mkt-pos); border-color:var(--mkt-pos);">Solved</span>' : '',
    discussion.moderationStatus === 'locked' ? '<span class="tag">Locked</span>' : '',
  ].filter(Boolean).join(' ');

  document.getElementById('threadTitle').textContent = discussion.title;
  document.getElementById('threadByline').innerHTML = renderEntityByline(author, [
    `Started ${FDM.utils.formatRelativeTime(discussion.createdAt)}`,
    `${discussion.readingTime} min read`,
  ]);

  document.getElementById('threadStats').appendChild(renderStatStrip([
    { value: discussion.viewCount, label:'Views' },
    { value: discussion.replyCount, label:'Replies' },
    { value: discussion.followerIds.length, label:'Followers' },
  ]));

  document.getElementById('threadOpVote').innerHTML = FDM.components.renderVoteControl(discussion.voteCount, 'discussion', discussion.id);

  FDM.shareComponent.mount('threadShare', {
    targetType:'discussion', targetId:discussion.id, title:discussion.title, url:window.location.href,
  });

  // ---- Moderation toolbar (renders nothing for non-moderators) ----
  FDM.moderationComponent.mountToolbar('threadModeration', discussion);

  // ---- Comments: nested replies, voting, accepted answer, expert/mod/admin badges ----
  const commentCount = FDM.commentService.getCommentsFor('discussion', discussion.id).length;
  FDM.commentService.mountThreadFor('threadComments', 'discussion', discussion.id, {
    composerPlaceholder: discussion.moderationStatus === 'locked'
      ? 'This thread is locked.' : 'Add a reply… (Markdown supported)',
  });

  // ---- Knowledge graph sidebar ----
  const related = FDM.knowledgeGraph.getRelatedForDiscussion(discussion);
  mountKgPanel('threadExperts', '', related.experts, renderUserCard, 'No experts linked to this thread yet.');
  mountKgPanel('threadSimilar', '', related.discussions, renderKgDiscussionItem, 'No similar discussions yet.');
  mountKgPanel('threadQuestions', '', related.questions, renderKgQuestionItem, 'No related questions yet.');
  mountKgPanel('threadArticles', '', related.articles, renderArticleAsNewsCard, 'No related articles yet.');
}

})();
