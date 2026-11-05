/* ============================================================
   DISCUSSIONS SEED DATA
   assets/data/discussions.data.js
   ============================================================ */
window.FDM = window.FDM || {};
FDM.data = FDM.data || {};

FDM.data.discussions = [
  FDM.models.createDiscussion({
    id:'disc-erp', title:'Best ERP for managing 6 subcontractor sites at once?',
    authorId:'u-201', category:'Manufacturing', tags:['ERP','Subcontracting'],
    viewCount:2400, replyCount:48, voteCount:217, readingTime:4,
    recommendedExpertIds:['exp-federica'], acceptedAnswerId:'td-2',
    relatedQuestionIds:['q-yarn'], relatedArticleIds:['art-tariff-spreadsheet'],
  }),
  FDM.models.createDiscussion({
    id:'disc-deadstock', title:"Is 'deadstock' fabric actually solving anything?",
    authorId:'u-201', category:'Sustainability', tags:['Deadstock','Circular Fashion'],
    viewCount:3100, replyCount:63, voteCount:189, readingTime:5,
    recommendedExpertIds:['exp-federica'],
  }),
  FDM.models.createDiscussion({
    id:'disc-ai-mills', title:'Which AI tools are textile mills actually using in 2026?',
    authorId:'u-201', category:'AI', tags:['AI','Manufacturing'],
    viewCount:5200, replyCount:91, voteCount:301, readingTime:6,
    recommendedExpertIds:['exp-renzo'],
  }),
  FDM.models.createDiscussion({
    id:'disc-tariffs', title:'How are you pricing in tariff volatility right now?',
    authorId:'u-201', category:'Fashion Business', tags:['Tariffs','Pricing'],
    viewCount:1900, replyCount:37, voteCount:156, readingTime:5,
    recommendedExpertIds:['exp-marta'],
  }),
  FDM.models.createDiscussion({
    id:'disc-grading', title:'Grading for petite sizing — sharing my block adjustments',
    authorId:'u-201', category:'Pattern Making', tags:['Grading','Pattern Making'],
    viewCount:1400, replyCount:22, voteCount:98, readingTime:4,
    recommendedExpertIds:['exp-luca'],
  }),
  FDM.models.createDiscussion({
    id:'disc-colorconsistency', title:'Batch-to-batch colour consistency on reactive dyes — what is realistic?',
    authorId:'u-201', category:'Dyeing', tags:['Dyeing','Colour Matching','Reactive Dyes'],
    viewCount:2750, replyCount:41, voteCount:176, readingTime:5,
    recommendedExpertIds:['exp-chiara'], createdAt:'2026-06-15T08:00:00Z', updatedAt:'2026-06-26T11:00:00Z',
  }),
  FDM.models.createDiscussion({
    id:'disc-warpbreaks', title:'Warp breaks spiking after switching yarn supplier — troubleshooting checklist?',
    authorId:'u-201', category:'Weaving', tags:['Weaving','Yarn Quality','Loom Efficiency'],
    viewCount:1980, replyCount:33, voteCount:142, readingTime:6,
    recommendedExpertIds:['exp-paolo'], createdAt:'2026-06-16T09:30:00Z', updatedAt:'2026-06-25T14:20:00Z',
  }),
  FDM.models.createDiscussion({
    id:'disc-spc-knitting', title:'Running SPC on a knitting line — which parameters actually matter?',
    authorId:'u-201', category:'Quality Engineering', tags:['SPC','Quality Control','Knitting'],
    viewCount:1620, replyCount:27, voteCount:121, readingTime:5,
    recommendedExpertIds:['exp-sofia'], createdAt:'2026-06-17T08:45:00Z', updatedAt:'2026-06-24T10:10:00Z',
  }),
  FDM.models.createDiscussion({
    id:'disc-changeover', title:'How are you tracking changeover time on cut-to-pack lines?',
    authorId:'u-201', category:'Lean Manufacturing', tags:['Lean','OEE','Changeover'],
    viewCount:2050, replyCount:29, voteCount:134, readingTime:5,
    recommendedExpertIds:['exp-federica'], createdAt:'2026-06-12T08:00:00Z', updatedAt:'2026-06-23T09:00:00Z',
  }),
  FDM.models.createDiscussion({
    id:'disc-waterreuse', title:'Real numbers on water reuse in dyehouses — is anyone tracking actual ROI?',
    authorId:'u-201', category:'Sustainability', tags:['Water Treatment','Dyeing','Sustainability'],
    viewCount:3400, replyCount:58, voteCount:241, readingTime:7, isPinned:true,
    recommendedExpertIds:['exp-davide','exp-chiara'], createdAt:'2026-06-10T08:00:00Z', updatedAt:'2026-06-27T16:30:00Z',
  }),
  FDM.models.createDiscussion({
    id:'disc-inspection', title:'4-point vs 10-point fabric inspection — which do your buyers actually require?',
    authorId:'u-201', category:'Defect Analysis', tags:['Defect Analysis','Quality Control','Fabric Inspection'],
    viewCount:2890, replyCount:46, voteCount:198, readingTime:5,
    recommendedExpertIds:['exp-sofia'], createdAt:'2026-06-14T08:00:00Z', updatedAt:'2026-06-26T12:40:00Z',
  }),
  FDM.models.createDiscussion({
    id:'disc-stenter-energy', title:'Reducing energy use in stenter finishing without sacrificing GSM',
    authorId:'u-201', category:'Process Optimization', tags:['Finishing','Energy Efficiency','Stenter'],
    viewCount:1340, replyCount:19, voteCount:87, readingTime:6,
    recommendedExpertIds:['exp-anna'], createdAt:'2026-06-18T08:00:00Z', updatedAt:'2026-06-22T15:15:00Z',
  }),
  FDM.models.createDiscussion({
    id:'disc-nearshoring', title:'Nearshoring vs Far East — has anyone run the real landed-cost numbers for 2026?',
    authorId:'u-201', category:'Supply Chain', tags:['Supply Chain','Nearshoring','Landed Cost'],
    viewCount:4100, replyCount:72, voteCount:266, readingTime:8,
    recommendedExpertIds:['exp-marta','exp-federica'], createdAt:'2026-06-08T08:00:00Z', updatedAt:'2026-06-27T09:50:00Z',
    relatedArticleIds:['art-tariff-spreadsheet'],
  }),
  FDM.models.createDiscussion({
    id:'disc-pilling-lab', title:'Pilling test results inconsistent between two labs — is that normal?',
    authorId:'u-201', category:'Laboratory Testing', tags:['Lab Testing','Pilling','ISO 12945'],
    viewCount:1190, replyCount:21, voteCount:79, readingTime:4,
    recommendedExpertIds:['exp-sofia'], createdAt:'2026-06-19T08:00:00Z', updatedAt:'2026-06-23T13:00:00Z',
  }),
  FDM.models.createDiscussion({
    id:'disc-ai-inspection-cams', title:'Worth investing in AI-based fabric inspection cameras yet?',
    authorId:'u-201', category:'Textile Technology', tags:['AI','Defect Detection','Automation'],
    viewCount:3650, replyCount:64, voteCount:223, readingTime:6,
    recommendedExpertIds:['exp-renzo','exp-paolo'], createdAt:'2026-06-13T08:00:00Z', updatedAt:'2026-06-26T17:00:00Z',
  }),
  FDM.models.createDiscussion({
    id:'disc-predictive-maint', title:'Predictive maintenance on looms — which sensors are actually worth the cost?',
    authorId:'u-201', category:'Maintenance', tags:['Maintenance','Predictive Maintenance','Looms'],
    viewCount:1760, replyCount:25, voteCount:108, readingTime:5,
    recommendedExpertIds:['exp-marco','exp-paolo'], createdAt:'2026-06-20T08:00:00Z', updatedAt:'2026-06-25T11:25:00Z',
  }),
];
