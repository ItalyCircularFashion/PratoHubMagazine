/* ============================================================
import { getCommentsFor, resolveAuthor, mountThreadFor } from '../services/comment.service.js';
import { renderRoleBadge, renderAuthNav, mountAuthNav, isVisibleFor, applyPermissionVisibility, gateOrCta, renderCommentComposer, renderVoteControl, mountRoleSwitcher } from '../components/ui.js';
import { findArticle, findDiscussion, findQuestion, findEvent, findPoll, findCompany, findUser, getRelatedForCompany, getRelatedForArticle as getRelatedForArticle_kg, getRelatedForDiscussion, getRelatedForQuestion, findExpert, findCommodity } from '../services/knowledge-graph.service.js';
import { mountToolbar } from '../components/moderation.component.js';
import { mountBreadcrumbs, navigateTo, navigateBack } from '../services/navigation.service.js';
import { mount as mountShare } from '../components/share.component.js';
import { formatRelativeTime, formatDate, formatCompactNumber } from '../utils/format.js';
   THREAD.JS — page-specific composition for thread.html only.
   ============================================================ */

const discussion = findDiscussion('disc-erp');

if(!discussion){
  document.getElementById('threadHero').appendChild(renderErrorState('This discussion could not be found.'));
} else {
  renderThreadPage(discussion);
}

function renderThreadPage(discussion){
  const author = findUser(discussion.authorId);

  mountBreadcrumbs('threadBreadcrumbs', [
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
    `Started ${formatRelativeTime(discussion.createdAt)}`,
    `${discussion.readingTime} min read`,
  ]);

  document.getElementById('threadStats').appendChild(renderStatStrip([
    { value: discussion.viewCount, label:'Views' },
    { value: discussion.replyCount, label:'Replies' },
    { value: discussion.followerIds.length, label:'Followers' },
  ]));

  document.getElementById('threadOpVote').innerHTML = renderVoteControl(discussion.voteCount, 'discussion', discussion.id);

  mountShare('threadShare', {
    targetType:'discussion', targetId:discussion.id, title:discussion.title, url:window.location.href,
  });

  // ---- Moderation toolbar (renders nothing for non-moderators) ----
  mountToolbar('threadModeration', discussion);

  // ---- Comments: nested replies, voting, accepted answer, expert/mod/admin badges ----
  const commentCount = getCommentsFor('discussion', discussion.id).length;
  mountThreadFor('threadComments', 'discussion', discussion.id, {
    composerPlaceholder: discussion.moderationStatus === 'locked'
      ? 'This thread is locked.' : 'Add a reply… (Markdown supported)',
  });

  // ---- Knowledge graph sidebar ----
  const related = getRelatedForDiscussion(discussion);
  mountKgPanel('threadExperts', '', related.experts, renderUserCard, 'No experts linked to this thread yet.');
  mountKgPanel('threadSimilar', '', related.discussions, renderKgDiscussionItem, 'No similar discussions yet.');
  mountKgPanel('threadQuestions', '', related.questions, renderKgQuestionItem, 'No related questions yet.');
  mountKgPanel('threadArticles', '', related.articles, renderArticleAsNewsCard, 'No related articles yet.');
}