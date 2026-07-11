/* ============================================================
import { getCurrentUser, isAuthenticated, login, logout, setMockUser, MOCK_USERS } from '../services/auth.js';
import { articles } from '../data/articles.data.js';
import { companies } from '../data/companies.data.js';
import { discussions } from '../data/discussions.data.js';
import { events } from '../data/events.data.js';
import { experts } from '../data/experts.data.js';
import { polls } from '../data/polls.data.js';
import { questions } from '../data/questions.data.js';
import { staff } from '../data/articles.data.js';
   KNOWLEDGE GRAPH SERVICE
   assets/services/knowledge-graph.service.js

   Resolves related-id arrays into real objects by looking them
   up in data stores. Pages never search seed data themselves.
   ============================================================ */

export function findExpert(id){
  return findExpertInData(id);
}
export function findArticle(id){
  return (articles || []).find(a => a.id === id) || null;
}
export function findDiscussion(id){
  return (discussions || []).find(d => d.id === id) || null;
}
export function findQuestion(id){
  return (questions || []).find(q => q.id === id) || null;
}
export function findEvent(id){
  return (events || []).find(e => e.id === id) || null;
}
export function findPoll(id){
  return (polls || []).find(p => p.id === id) || null;
}
export function findCompany(id){
  return (companies || []).find(c => c.id === id) || null;
}
export function getRelatedForCompany(company){
  if(!company) return { articles:[], discussions:[], questions:[], experts:[], events:[] };
  return {
    articles:    (company.relatedArticleIds    || []).map(findArticle).filter(Boolean),
    discussions: (company.relatedDiscussionIds || []).map(findDiscussion).filter(Boolean),
    questions:   (company.relatedQuestionIds   || []).map(findQuestion).filter(Boolean),
    experts:     (company.relatedExpertIds     || []).map(findExpertInData).filter(Boolean),
    events:      (company.relatedEventIds      || []).map(findEvent).filter(Boolean),
  };
}
/** Resolves any user id across every known identity source. Generic — used by comments, discussions, questions alike. */
export function findUser(id){
  return findExpertInData(id)
    || (MOCK_USERS && id === MOCK_USERS.member.id ? MOCK_USERS.member : null);
}
export function findCommodity(name){
  return (typeof commodities !== 'undefined' ? commodities : []).find(c => c.name === name) || null;
}
/**
 * Resolves every related-id array on an Article into actual objects.
 * @param {Object} article - an FDM.models.createArticle() shape
 */
export function getRelatedForArticle(article){
  if(!article) return { discussions:[], questions:[], experts:[], market:[], events:[], articles:[] };
  return {
    discussions: (article.relatedDiscussionIds || []).map(findDiscussion).filter(Boolean),
    questions:   (article.relatedQuestionIds   || []).map(findQuestion).filter(Boolean),
    experts:     (article.relatedExpertIds     || []).map(findExpertInData).filter(Boolean),
    market:      (article.relatedMarketSymbols || []).map(findCommodity).filter(Boolean),
    events:      (article.relatedEventIds      || []).map(findEvent).filter(Boolean),
    articles:    (article.relatedArticleIds    || []).map(findArticle).filter(Boolean),
  };
}
/**
 * Resolves every related-id array on a Discussion into actual objects.
 * @param {Object} discussion - an FDM.models.createDiscussion() shape
 */
export function getRelatedForDiscussion(discussion){
  if(!discussion) return { articles:[], questions:[], discussions:[], experts:[] };
  return {
    articles:    (discussion.relatedArticleIds     || []).map(findArticle).filter(Boolean),
    questions:   (discussion.relatedQuestionIds    || []).map(findQuestion).filter(Boolean),
    discussions: (discussion.relatedDiscussionIds  || []).map(findDiscussion).filter(Boolean),
    experts:     (discussion.recommendedExpertIds  || []).map(findExpertInData).filter(Boolean),
  };
}
export function getRelatedForQuestion(question){
  if(!question) return { articles:[], questions:[], discussions:[], experts:[] };
  return {
    articles:    (question.relatedArticleIds     || []).map(findArticle).filter(Boolean),
    questions:   (question.relatedQuestionIds    || []).map(findQuestion).filter(Boolean),
    discussions: (question.relatedDiscussionIds  || []).map(findDiscussion).filter(Boolean),
    experts:     (question.recommendedExpertIds  || []).map(findExpertInData).filter(Boolean),
  };
}

/* ---- Compatibility bridge ---- */
window.FDM = window.FDM || {};
window.FDM.knowledgeGraph = {
  findExpert, findArticle, findDiscussion, findQuestion, findEvent, findPoll, findCommodity, findUser,
  findCompany, getRelatedForCompany,
  getRelatedForArticle, getRelatedForDiscussion, getRelatedForQuestion,
};

/* ---- Internal helper ---- */
function findExpertInData(id){
  return (experts || []).find(e => e.id === id) || (staff || []).find(e => e.id === id) || null;
}