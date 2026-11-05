/* ============================================================
   COMPANY MODEL
   assets/models/company.model.js
   ============================================================ */
window.FDM = window.FDM || {};
FDM.models = FDM.models || {};

FDM.models.createCompany = function createCompany(overrides){
  return Object.assign({
    id: null, name: '', logoUrl: '', city: '', district: '', region: 'Tuscany', country: 'IT',
    specialization: '', description: '', foundedYear: null, employeeRange: '',
    website: '', vatNumber: '', rea: '', legalForm: '',
    certifications: [], productSectors: [], exportMarkets: [],
    sustainabilityHighlights: [], technologies: [],
    // Company detail fields (used by future company.html)
    history: '', timeline: [], galleryImages: [], products: [],
    // Knowledge graph
    relatedArticleIds: [], relatedDiscussionIds: [], relatedQuestionIds: [],
    relatedExpertIds: [], relatedEventIds: [],
  }, overrides || {});
};
