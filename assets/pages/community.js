/* ============================================================
import { renderRoleBadge, renderAuthNav, mountAuthNav, isVisibleFor, applyPermissionVisibility, gateOrCta, renderCommentComposer, renderVoteControl, mountRoleSwitcher } from '../components/ui.js';
import { initReveal, initChipFilters, initNewsletterForm, initPagination, initSearchBars, wireSearchFilter, wireSortSelect, wireChipFilter, wireChipCategoryFilter, initVoteControls } from '../services/interaction.service.js';
import { findArticle, findDiscussion, findQuestion, findEvent, findPoll, findCompany, findUser, getRelatedForCompany, getRelatedForArticle as getRelatedForArticle_kg, getRelatedForDiscussion, getRelatedForQuestion, findExpert, findCommodity } from '../services/knowledge-graph.service.js';
import { mountBreadcrumbs, navigateTo, navigateBack } from '../services/navigation.service.js';
import { comments } from '../data/comments.data.js';
import { discussions } from '../data/discussions.data.js';
import { experts } from '../data/experts.data.js';
import { questions } from '../data/questions.data.js';
import { staff } from '../data/articles.data.js';
   COMMUNITY.JS — page-specific composition for community.html.
   ============================================================ */

const experts  = experts || [];
const staff    = staff   || [];
const discs    = discussions || [];
const qs       = questions  || [];
const comments = comments   || [];

// ---- Breadcrumbs ----
mountBreadcrumbs('commBreadcrumbs', [
  { label:'Home', href:'index.html' },
  { label:'Community' },
]);

// ---- Stats derived entirely from existing seed data ----
const totalAnswers = qs.reduce((s,q) => s + q.answerCount, 0);
const totalVotes   = discs.reduce((s,d) => s + d.voteCount, 0) + qs.reduce((s,q) => s + q.voteCount, 0);
document.getElementById('commStats').appendChild(renderStatStrip([
  { value:experts.length, label:'Verified Experts' },
  { value:discs.length,   label:'Open Discussions' },
  { value:totalAnswers,   label:'Answers Given' },
  { value:totalVotes,     label:'Votes Cast' },
]));

// ---- Join / Member CTA ----
document.getElementById('joinCta').innerHTML = gateOrCta(
  'CREATE_DISCUSSION',
  '<a href="#" class="btn btn-primary">Post in the Community</a>',
  'Sign in to participate'
);

// ---- Expert grid ----
// Derive filter chips from all distinct expertise tags across experts.
const allTags = [...new Set(experts.flatMap(e => e.expertise))].sort();
document.getElementById('expertAreaChips').append(
  ...allTags.map(t => el(`<div class="chip">${t}</div>`))
);
document.getElementById('expertGrid').append(...experts.map(renderUserCard));

wireSearchFilter('#expertSearch', '#expertGrid', '.user-card');

// Chip filter on expertise — each expert card carries expertise tags in its visible text content,
// so wireSearchFilter's text-content fallback handles it (no new data attribute needed).
document.querySelectorAll('#expertAreaChips .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const wanted = chip.textContent.trim().toLowerCase();
    document.querySelectorAll('#expertGrid .user-card').forEach(card => {
      card.style.display = (wanted === 'all' || card.textContent.toLowerCase().includes(wanted)) ? '' : 'none';
    });
  });
});

// ---- Recent activity: top 5 discussions by voteCount ----
const topDiscs = [...discs].sort((a,b) => b.voteCount - a.voteCount).slice(0, 5);
document.getElementById('commDiscussions').append(
  ...topDiscs.map(d => renderDiscussionRow(d, findUser(d.authorId), ''))
);

// ---- Recent questions: latest 4 by createdAt ----
const recentQs = [...qs].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
document.getElementById('commQuestions').append(
  ...recentQs.map(q => adaptQuestionForCard(q, findUser(q.expertId)))
);

// ---- Leaderboard: experts + staff sorted by reputation ----
const everyone = [...experts, ...staff].sort((a,b) => b.reputation - a.reputation);
const leaderboardEl = document.getElementById('leaderboardList');
everyone.forEach((user, i) => leaderboardEl.appendChild(renderLeaderboardRow(user, i + 1)));