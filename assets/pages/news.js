/* ============================================================
import { initReveal, initChipFilters, initNewsletterForm, initPagination, initSearchBars, wireSearchFilter, wireSortSelect, wireChipFilter, wireChipCategoryFilter, initVoteControls } from '../services/interaction.service.js';
import { findArticle, findDiscussion, findQuestion, findEvent, findPoll, findCompany, findUser, getRelatedForCompany, getRelatedForArticle as getRelatedForArticle_kg, getRelatedForDiscussion, getRelatedForQuestion, findExpert, findCommodity } from '../services/knowledge-graph.service.js';
import { mountBreadcrumbs, navigateTo, navigateBack } from '../services/navigation.service.js';
import { articles } from '../data/articles.data.js';
import { discussions } from '../data/discussions.data.js';
import { events } from '../data/events.data.js';
import { questions } from '../data/questions.data.js';
   NEWS.JS — unified chronological News Hub for news.html.
   Aggregates articles, discussions, questions and upcoming
   events from existing datasets. Pure composition only.
   ============================================================ */

mountBreadcrumbs('newsBreadcrumbs', [
  { label:'Home', href:'index.html' },
  { label:'News' },
]);

const articles    = articles    || [];
const discussions = discussions || [];
const questions   = questions   || [];
const events      = (events     || []).filter(e => !e.past);

document.getElementById('newsStats').appendChild(renderStatStrip([
  { value: articles.length,    label:'Articles' },
  { value: discussions.length, label:'Discussions' },
  { value: questions.length,   label:'Questions' },
  { value: events.length,      label:'Upcoming Events' },
]));

const MONTH_MAP = { JAN:1,FEB:2,MAR:3,APR:4,MAY:5,JUN:6,JUL:7,AUG:8,SEP:9,OCT:10,NOV:11,DEC:12 };
function eventToIso(ev){
  const m = MONTH_MAP[ev.month] || 7;
  return `2026-${String(m).padStart(2,'0')}-${String(ev.day).padStart(2,'0')}T08:00:00Z`;
}

const feedItems = [
  ...articles.map(a => ({
    type:'article', dateIso: a.publishedAt || a.updatedAt,
    title: a.title, node: renderArticleAsNewsCard(a),
  })),
  ...discussions.map(d => ({
    type:'discussion', dateIso: d.updatedAt || d.createdAt,
    title: d.title, node: renderDiscussionRow(d, findUser(d.authorId), ''),
  })),
  ...questions.map(q => ({
    type:'question', dateIso: q.createdAt,
    title: q.title, node: adaptQuestionForCard(q, findUser(q.expertId)),
  })),
  ...events.map(ev => ({
    type:'event', dateIso: eventToIso(ev),
    title: ev.title, node: renderEventCard(adaptEventForCard(ev)),
  })),
];

feedItems.sort((a,b) => new Date(b.dateIso) - new Date(a.dateIso));

const grid = document.getElementById('feedGrid');
grid.append(...feedItems.map(item => renderFeedCard(item.type, item.node, item.dateIso, item.title)));

wireSearchFilter('#newsSearch', '#feedGrid', '.feed-card');
wireChipFilter('#newsTypeChips', '#feedGrid', '.feed-card', 'type');
wireSortSelect('#newsSort', '#feedGrid', {
  newest: (a,b) => Number(b.dataset.date) - Number(a.dataset.date),
  oldest: (a,b) => Number(a.dataset.date) - Number(b.dataset.date),
});