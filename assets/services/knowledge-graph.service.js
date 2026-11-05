/* ============================================================
   KNOWLEDGE GRAPH SERVICE
   assets/services/knowledge-graph.service.js

   Articles and discussions store arrays of related IDs
   (relatedDiscussionIds, relatedQuestionIds, relatedExpertIds,
   relatedMarketSymbols, relatedEventIds). This service is the
   one place that resolves those ids into real objects by
   looking them up in FDM.data — pages never search the seed
   data themselves.

   When a real backend exists, only the lookup functions below
   change (e.g. from array.find to a fetch() call) — every page
   calling FDM.knowledgeGraph.getRelatedForArticle() keeps working.
   ============================================================ */
window.FDM = window.FDM || {};

(function(){

  function findExpert(id){
    return (FDM.data.experts || []).find(e => e.id === id) || (FDM.data.staff || []).find(e => e.id === id) || null;
  }
  function findArticle(id){
    return (FDM.data.articles || []).find(a => a.id === id) || null;
  }
  function findDiscussion(id){
    return (FDM.data.discussions || []).find(d => d.id === id) || null;
  }
  function findQuestion(id){
    return (FDM.data.questions || []).find(q => q.id === id) || null;
  }
  function findEvent(id){
    return (FDM.data.events || []).find(e => e.id === id) || null;
  }
  function findPoll(id){
    return (FDM.data.polls || []).find(p => p.id === id) || null;
  }
  function findCompany(id){
    return (FDM.data.companies || []).find(c => c.id === id) || null;
  }
  function getRelatedForCompany(company){
    if(!company) return { articles:[], discussions:[], questions:[], experts:[], events:[] };
    return {
      articles:    (company.relatedArticleIds    || []).map(findArticle).filter(Boolean),
      discussions: (company.relatedDiscussionIds || []).map(findDiscussion).filter(Boolean),
      questions:   (company.relatedQuestionIds   || []).map(findQuestion).filter(Boolean),
      experts:     (company.relatedExpertIds     || []).map(findExpert).filter(Boolean),
      events:      (company.relatedEventIds      || []).map(findEvent).filter(Boolean),
    };
  }
  /** Resolves any user id across every known identity source. Generic — used by comments, discussions, questions alike. */
  function findUser(id){
    return findExpert(id)
      || (FDM.auth && FDM.auth.MOCK_USERS && id === FDM.auth.MOCK_USERS.member.id ? FDM.auth.MOCK_USERS.member : null);
  }
  function findCommodity(name){
    // `commodities` is a top-level const declared in main.js — top-level
    // let/const are NOT properties of window, but they ARE visible as a
    // bare identifier to every script that loads after main.js, since all
    // classic <script> tags in one document share one global lexical scope.
    return (typeof commodities !== 'undefined' ? commodities : []).find(c => c.name === name) || null;
  }

  /**
   * Resolves every related-id array on an Article into actual objects.
   * @param {Object} article - an FDM.models.createArticle() shape
   */
  function getRelatedForArticle(article){
    if(!article) return { discussions:[], questions:[], experts:[], market:[], events:[], articles:[] };
    return {
      discussions: (article.relatedDiscussionIds || []).map(findDiscussion).filter(Boolean),
      questions:   (article.relatedQuestionIds   || []).map(findQuestion).filter(Boolean),
      experts:     (article.relatedExpertIds     || []).map(findExpert).filter(Boolean),
      market:      (article.relatedMarketSymbols || []).map(findCommodity).filter(Boolean),
      events:      (article.relatedEventIds      || []).map(findEvent).filter(Boolean),
      articles:    (article.relatedArticleIds    || []).map(findArticle).filter(Boolean),
    };
  }

  /**
   * Resolves every related-id array on a Discussion into actual objects.
   * @param {Object} discussion - an FDM.models.createDiscussion() shape
   */
  function getRelatedForDiscussion(discussion){
    if(!discussion) return { articles:[], questions:[], discussions:[], experts:[] };
    return {
      articles:    (discussion.relatedArticleIds     || []).map(findArticle).filter(Boolean),
      questions:   (discussion.relatedQuestionIds    || []).map(findQuestion).filter(Boolean),
      discussions: (discussion.relatedDiscussionIds  || []).map(findDiscussion).filter(Boolean),
      experts:     (discussion.recommendedExpertIds  || []).map(findExpert).filter(Boolean),
    };
  }

  function getRelatedForQuestion(question){
    if(!question) return { articles:[], questions:[], discussions:[], experts:[] };
    return {
      articles:    (question.relatedArticleIds     || []).map(findArticle).filter(Boolean),
      questions:   (question.relatedQuestionIds    || []).map(findQuestion).filter(Boolean),
      discussions: (question.relatedDiscussionIds  || []).map(findDiscussion).filter(Boolean),
      experts:     (question.recommendedExpertIds  || []).map(findExpert).filter(Boolean),
    };
  }

  FDM.knowledgeGraph = {
    findExpert, findArticle, findDiscussion, findQuestion, findEvent, findPoll, findCommodity, findUser,
    findCompany, getRelatedForCompany,
    getRelatedForArticle, getRelatedForDiscussion, getRelatedForQuestion,
  };

})();
