/* ============================================================
   DISCUSSIONS.JS — page-specific composition for discussions.html.
   ============================================================ */
import { getCurrentUser, isAuthenticated, login, logout, setMockUser, MOCK_USERS } from '../services/auth.js';
import { renderRoleBadge, renderAuthNav, mountAuthNav, isVisibleFor, applyPermissionVisibility, gateOrCta, renderCommentComposer, renderVoteControl, mountRoleSwitcher } from '../components/ui.js';
import { canFollow } from '../permissions/permissions.js';
import { initReveal, initChipFilters, initNewsletterForm, initPagination, initSearchBars, wireSearchFilter, wireSortSelect, wireChipFilter, wireChipCategoryFilter, initVoteControls } from '../services/interaction.service.js';
import { findArticle, findDiscussion, findQuestion, findEvent, findPoll, findCompany, findUser, getRelatedForCompany, getRelatedForArticle as getRelatedForArticle_kg, getRelatedForDiscussion, getRelatedForQuestion, findExpert, findCommodity } from '../services/knowledge-graph.service.js';
import { mountBreadcrumbs } from '../services/navigation.service.js';
import { isFollowing, toggleFollow } from '../services/session.service.js';
import { discussions } from '../data/discussions.data.js';
mountBreadcrumbs('discBreadcrumbs', [
  { label:'Home', href:'index.html' },
  { label:'Discussions' },
]);

// ---- Header stats ----
const totalReplies = discussionList.reduce((sum,d) => sum + d.replyCount, 0);
const totalVotes = discussionList.reduce((sum,d) => sum + d.voteCount, 0);
document.getElementById('discStats').appendChild(renderStatStrip([
  { value: discussionList.length, label:'Open Threads' },
  { value: totalReplies, label:'Replies' },
  { value: totalVotes, label:'Votes Cast' },
]));

// ---- Create Discussion CTA (permission-gated) ----
document.getElementById('createDiscussionCta').innerHTML = gateOrCta(
  'CREATE_DISCUSSION',
  '<a href="#" class="btn btn-primary">Start a Discussion</a>',
  'Sign in to start a discussion'
);

// ---- Categories: derived from the data, not hardcoded ----
const categoryCounts = discussionList.reduce((acc,d) => { acc[d.category] = (acc[d.category]||0)+1; return acc; }, {});
const categories = Object.keys(categoryCounts);

document.getElementById('discTopics').append(...categories.map(cat =>
  el(`<a href="#" class="topic-pill">${cat} <span class="count">${categoryCounts[cat]}</span></a>`)
));
document.getElementById('discCategoryChips').append(...categories.map(cat => el(`<div class="chip">${cat}</div>`)));

// ---- Follow HTML helper — lives in the controller (auth/permissions/session belong here) ----
function makeFollowHtml(d){
  const user = getCurrentUser();
  if(!canFollow(user)){
    return gateOrCta('FOLLOW_DISCUSSION','','Sign in to follow');
  }
  const following = isFollowing('discussion', d.id);
  return `<button class="comment-action follow-toggle" data-id="${d.id}">${following ? 'Following ✓' : '+ Follow'}</button>`;
}

// ---- Render the list (model + resolved author, via the extended renderDiscussionRow) ----
document.getElementById('discListContainer').append(
  ...discussionList.map(d => renderDiscussionRow(d, findUser(d.authorId), makeFollowHtml(d)))
);

// ---- Search, sort, category filter — all existing interaction-service functions ----
wireSearchFilter('#discSearch', '#discListContainer', '.disc-row');
wireChipCategoryFilter('#discCategoryChips', '#discListContainer', '.disc-row');
wireSortSelect('#discSort', '#discListContainer', {
  votes:   (a,b) => b.dataset.votes   - a.dataset.votes,
  replies: (a,b) => b.dataset.replies - a.dataset.replies,
  updated: (a,b) => b.dataset.updated - a.dataset.updated,
  newest:  (a,b) => b.dataset.created - a.dataset.created,
});

// ---- View-mode chips (All / Trending / Latest / Following / Solved) ----
const viewChips = document.querySelectorAll('#discViewChips .chip');
const rows = () => document.querySelectorAll('#discListContainer .disc-row');
const VIEW_FILTERS = {
  all:       () => true,
  trending:  (row) => Number(row.dataset.votes) >= 150,
  latest:    () => true, // re-sorted below, not filtered
  following: (row) => isFollowing('discussion', row.querySelector('.follow-toggle')?.dataset.id),
  solved:    (row) => row.querySelector('.tag') && row.textContent.includes('Solved'),
};
viewChips.forEach(chip => chip.addEventListener('click', () => {
  const mode = chip.textContent.trim().toLowerCase();
  rows().forEach(row => { row.style.display = VIEW_FILTERS[mode](row) ? '' : 'none'; });
  if(mode === 'latest'){
    [...document.getElementById('discListContainer').children]
      .sort((a,b) => b.dataset.created - a.dataset.created)
      .forEach(node => document.getElementById('discListContainer').appendChild(node));
  }
}));

// ---- Follow toggle (event delegation — single listener, calls the existing session service) ----
document.getElementById('discListContainer').addEventListener('click', (e) => {
  const btn = e.target.closest('.follow-toggle');
  if(!btn) return;
  const nowFollowing = toggleFollow('discussion', btn.dataset.id);
  btn.textContent = nowFollowing ? 'Following ✓' : '+ Follow';
});
document.addEventListener('fdm:authchange', () => {
  document.getElementById('discListContainer').innerHTML = '';
  document.getElementById('discListContainer').append(
    ...discussions.map(d => renderDiscussionRow(d, findUser(d.authorId), makeFollowHtml(d)))
  );
});