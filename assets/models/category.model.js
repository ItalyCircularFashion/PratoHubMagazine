/* ============================================================
   CATEGORY MODEL
   assets/models/category.model.js
   ============================================================ */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {number} articleCount
 * @property {number} discussionCount
 */
export function createCategory(overrides){
  overrides = overrides || {};
  return Object.assign({
    id: null,
    name: '',
    slug: '',
    description: '',
    articleCount: 0,
    discussionCount: 0,
  }, overrides);
}
