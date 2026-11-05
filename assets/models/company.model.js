/* ============================================================
   COMPANY MODEL — v2 (PUBLIC Directory)
   assets/models/company.model.js
   Schema pubblico definito: non usare P.IVA come condizione sufficiente.
   ============================================================ */

export function createCompany(overrides){
  return Object.assign({
    id: null, name: '', logoUrl: '', city: '', district: '', region: 'Tuscany', country: 'IT',
    specialization: '', description: '', foundedYear: null, employeeRange: '',
    website: '', vatNumber: null, rea: null, legalForm: '',
    certifications: [], productSectors: [], exportMarkets: [],
    sustainabilityHighlights: [], technologies: [],
    texCodes: [], sectorsB2B: [], sources: [],
    datasetType: 'DEMO',
    verification: {identity: 'DEMO', information: 'DEMO', publishEligibility: 'DEMO_FORBIDDEN'},
    publish: {allowed: false, reason: ''},
    history: '', timeline: [], galleryImages: [], products: [],
    relatedArticleIds: [], relatedDiscussionIds: [], relatedQuestionIds: [],
    relatedExpertIds: [], relatedEventIds: [],
  }, overrides || {});
}
