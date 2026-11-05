/* ============================================================
   ARTICLE MODEL
   assets/models/article.model.js

   Articles are always authored by an Administrator (the
   editorial desk). The model carries everything the layout
   needs: TOC sections, citations, and the cross-links that
   make the article behave like a node in the knowledge graph.
   ============================================================ */
window.FDM = window.FDM || {};
FDM.models = FDM.models || {};

/**
 * @typedef {Object} ArticleSection
 * @property {string} id        - used for the sticky table of contents anchor
 * @property {string} heading
 *
 * @typedef {Object} Citation
 * @property {string} label
 * @property {string} url
 *
 * @typedef {Object} Article
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} subtitle
 * @property {string} heroImageUrl
 * @property {string} coverCaption
 * @property {string} authorId        - must resolve to a user with role 'admin'
 * @property {string} editorId
 * @property {string} category
 * @property {string[]} tags
 * @property {ArticleSection[]} sections
 * @property {Citation[]} citations
 * @property {string} publishedAt
 * @property {string} updatedAt
 * @property {number} readingTime
 * @property {number} commentCount
 * @property {boolean} isFeatured
 * @property {string[]} relatedArticleIds
 * @property {string[]} relatedDiscussionIds
 * @property {string[]} relatedQuestionIds
 * @property {string[]} relatedMarketSymbols   - resolved against FDM.data.commodities
 * @property {string[]} relatedEventIds
 * @property {'draft'|'published'|'scheduled'|'archived'} status
 * @property {string|null} scheduledAt
 * @property {number} viewCount
 * @property {number} saveCount
 * @property {number} shareCount
 * @property {string} imageSeed                - picsum seed for thumbnail contexts (kept distinct from heroImageUrl)
 * @property {Object[]} galleryImages           - [{src, alt, caption}]
 * @property {Object[]} revisionHistory         - [{date, label, note}]
 * @property {string|null} pollId               - resolved via FDM.knowledgeGraph.findPoll()
 */
FDM.models.createArticle = function createArticle(overrides){
  overrides = overrides || {};
  return Object.assign({
    id: null,
    title: '',
    slug: '',
    subtitle: '',
    heroImageUrl: '',
    coverCaption: '',
    authorId: null,
    editorId: null,
    category: '',
    tags: [],
    sections: [],
    citations: [],
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readingTime: 1,
    commentCount: 0,
    isFeatured: false,
    relatedArticleIds: [],
    relatedDiscussionIds: [],
    relatedQuestionIds: [],
    relatedMarketSymbols: [],
    relatedEventIds: [],
    status: 'draft',
    scheduledAt: null,
    viewCount: 0,
    saveCount: 0,
    shareCount: 0,
    imageSeed: '',
    galleryImages: [],
    revisionHistory: [],
    pollId: null,
  }, overrides);
};
