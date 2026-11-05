/* ============================================================
   QUESTIONS SEED DATA
   assets/data/questions.data.js
   ============================================================ */
window.FDM = window.FDM || {};
FDM.data = FDM.data || {};

FDM.data.questions = [
  FDM.models.createQuestion({
    id:'q-jacquard', category:'Textile Engineering', tags:['Textile Engineering','Quality Control'],
    title:'How do you set acceptable defect tolerance for jacquard weaving?',
    difficulty:'advanced', expertId:'exp-renzo', accepted:true, acceptedAnswerId:'qa-jacquard-1',
    viewCount:3400, voteCount:62, answerCount:7, createdAt:'2026-06-18T09:00:00Z',
    relatedQuestionIds:['q-defectgrading','q-colorfastness'],
    relatedDiscussionIds:['disc-inspection','disc-spc-knitting'],
    relatedArticleIds:['art-spc-quality','art-pilling-standards'],
    recommendedExpertIds:['exp-sofia','exp-paolo'],
  }),
  FDM.models.createQuestion({
    id:'q-gots', category:'Supply Chain', tags:['Supply Chain','Fashion Law'],
    title:'What actually changes in contracts once a supplier is GOTS certified?',
    difficulty:'intermediate', expertId:'exp-marta', accepted:true, acceptedAnswerId:'qa-gots-1',
    viewCount:2890, voteCount:54, answerCount:5, createdAt:'2026-06-19T09:00:00Z',
  }),
  FDM.models.createQuestion({
    id:'q-blazer', category:'Pattern Making', tags:['Pattern Making'],
    title:'Best approach for grading a fitted blazer across 8 sizes?',
    difficulty:'beginner', expertId:'exp-luca', accepted:false,
    viewCount:1120, voteCount:19, answerCount:3, createdAt:'2026-06-22T09:00:00Z',
  }),
  FDM.models.createQuestion({
    id:'q-yarn', category:'Manufacturing', tags:['Manufacturing','Materials'],
    title:'Ring-spun vs open-end yarn — when does the cost difference matter?',
    difficulty:'advanced', expertId:'exp-federica', accepted:true, acceptedAnswerId:'qa-yarn-1',
    viewCount:2100, voteCount:41, answerCount:4, createdAt:'2026-06-23T09:00:00Z',
    relatedDiscussionIds:['disc-erp'],
  }),
  FDM.models.createQuestion({
    id:'q-shrinkage', category:'Quality Engineering', tags:['Quality Control','Cotton','Testing'],
    title:'What is an acceptable shrinkage tolerance for cotton twill after the first home wash?',
    difficulty:'beginner', expertId:'exp-sofia', accepted:true, acceptedAnswerId:'qa-shrinkage-1',
    viewCount:4200, voteCount:58, answerCount:9, createdAt:'2026-06-09T09:00:00Z',
  }),
  FDM.models.createQuestion({
    id:'q-oee', category:'Lean Manufacturing', tags:['OEE','Weaving','KPIs'],
    title:'How do you calculate OEE for a weaving shed running multiple loom types?',
    difficulty:'intermediate', expertId:'exp-paolo', accepted:true, acceptedAnswerId:'qa-oee-1',
    viewCount:3300, voteCount:49, answerCount:6, createdAt:'2026-06-11T09:00:00Z',
    relatedDiscussionIds:['disc-changeover'],
  }),
  FDM.models.createQuestion({
    id:'q-labdip', category:'Dyeing', tags:['Dyeing','Lab Dip','Workflow'],
    title:'Best practice for lab dip approval turnaround without slowing down bulk dyeing?',
    difficulty:'intermediate', expertId:'exp-chiara', accepted:true, acceptedAnswerId:'qa-labdip-1',
    viewCount:1870, voteCount:33, answerCount:5, createdAt:'2026-06-14T09:00:00Z',
    relatedDiscussionIds:['disc-colorconsistency'],
  }),
  FDM.models.createQuestion({
    id:'q-colorfastness', category:'Laboratory Testing', tags:['AATCC','Colorfastness','Denim'],
    title:'Which AATCC test method should I specify for colorfastness to rubbing on denim?',
    difficulty:'beginner', expertId:'exp-sofia', accepted:true, acceptedAnswerId:'qa-colorfastness-1',
    viewCount:2640, voteCount:37, answerCount:4, createdAt:'2026-06-16T09:00:00Z',
  }),
  FDM.models.createQuestion({
    id:'q-rapier', category:'Weaving', tags:['Weaving','Rapier Looms','Yarn Breakage'],
    title:'How to reduce yarn breakage on rapier looms running fine-count cotton?',
    difficulty:'advanced', expertId:'exp-paolo', accepted:false,
    viewCount:1450, voteCount:24, answerCount:3, createdAt:'2026-06-21T09:00:00Z',
    relatedDiscussionIds:['disc-warpbreaks'],
  }),
  FDM.models.createQuestion({
    id:'q-microfiber', category:'Sustainability', tags:['Microfiber Shedding','Sustainability','Testing'],
    title:'Practical ways to reduce microfiber shedding without changing the fabric construction?',
    difficulty:'intermediate', expertId:'exp-davide', accepted:true, acceptedAnswerId:'qa-microfiber-1',
    viewCount:3050, voteCount:52, answerCount:7, createdAt:'2026-06-08T09:00:00Z',
    relatedDiscussionIds:['disc-waterreuse'],
  }),
  FDM.models.createQuestion({
    id:'q-stenter', category:'Finishing', tags:['Finishing','Stenter','Polyester-Cotton'],
    title:'Stenter frame temperature settings for polyester-cotton blends — what is a sane starting point?',
    difficulty:'intermediate', expertId:'exp-anna', accepted:true, acceptedAnswerId:'qa-stenter-1',
    viewCount:1980, voteCount:29, answerCount:5, createdAt:'2026-06-17T09:00:00Z',
    relatedDiscussionIds:['disc-stenter-energy'],
  }),
  FDM.models.createQuestion({
    id:'q-defectgrading', category:'Defect Analysis', tags:['Defect Analysis','Fabric Inspection'],
    title:'What is the practical difference between 4-point and 10-point fabric grading systems?',
    difficulty:'beginner', expertId:'exp-sofia', accepted:true, acceptedAnswerId:'qa-defectgrading-1',
    viewCount:2210, voteCount:31, answerCount:4, createdAt:'2026-06-22T09:00:00Z',
    relatedDiscussionIds:['disc-inspection'],
  }),
];
