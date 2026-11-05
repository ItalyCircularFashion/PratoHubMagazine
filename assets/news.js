(function(){
"use strict";
/* ============================================================
   NEWS.JS — unified chronological News Hub for news.html.
   Aggregates articles, discussions, questions and upcoming
   events from existing datasets. Pure composition only.
   ============================================================ */

FDM.navigation.mountBreadcrumbs('newsBreadcrumbs', [
  { label:'Home', href:'index.html' },
  { label:'News' },
]);

const articles    = FDM.data.articles    || [];
const discussions = FDM.data.discussions || [];
const questions   = FDM.data.questions   || [];
const events      = (FDM.data.events     || []).filter(e => !e.past);

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
    title: d.title, node: renderDiscussionRow(d, FDM.knowledgeGraph.findUser(d.authorId), ''),
  })),
  ...questions.map(q => ({
    type:'question', dateIso: q.createdAt,
    title: q.title, node: adaptQuestionForCard(q, FDM.knowledgeGraph.findUser(q.expertId)),
  })),
  ...events.map(ev => ({
    type:'event', dateIso: eventToIso(ev),
    title: ev.title, node: renderEventCard(adaptEventForCard(ev)),
  })),
];

feedItems.sort((a,b) => new Date(b.dateIso) - new Date(a.dateIso));

const grid = document.getElementById('feedGrid');
grid.append(...feedItems.map(item => renderFeedCard(item.type, item.node, item.dateIso, item.title)));

FDM.interaction.wireSearchFilter('#newsSearch', '#feedGrid', '.feed-card');
FDM.interaction.wireChipFilter('#newsTypeChips', '#feedGrid', '.feed-card', 'type');
FDM.interaction.wireSortSelect('#newsSort', '#feedGrid', {
  newest: (a,b) => Number(b.dataset.date) - Number(a.dataset.date),
  oldest: (a,b) => Number(a.dataset.date) - Number(b.dataset.date),
});

})();
