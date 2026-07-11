import { createUser } from '../models/user.model.js';
import { createArticle } from '../models/article.model.js';

/* ============================================================
   ARTICLES SEED DATA
   assets/data/articles.data.js
   ============================================================ */

// Editorial staff (Administrators). Kept separate from window.FDM.data.experts —
// experts are community members with domain authority, staff are the
// editorial desk that holds PUBLISH_ARTICLE / EDIT_ANY_CONTENT capability.
export const staff = [
  createUser({
    id:'u-1', nickname:'marco.bianchi', role:'admin',
    professionalRole:'Senior Editor, Business', country:'Italy',
    avatarUrl:'https://picsum.photos/seed/prato-editor-01/120/120', reputation:9000, badges:['Administrator'],
  }),
  createUser({
    id:'u-2', nickname:'isabella.romano', role:'admin',
    professionalRole:'Editor-in-Chief', country:'Italy',
    avatarUrl:'https://picsum.photos/seed/prato-editor-02/120/120', reputation:9500, badges:['Administrator'],
  }),
];

export const articles = [
  createArticle({
    id:'art-tariff-spreadsheet',
    slug:'tariff-spreadsheet-sourcing-directors',
    title:"Inside the Tariff Spreadsheet Every Sourcing Director Is Now Quietly Sharing",
    subtitle:"A leaked planning sheet, passed between three mills in two weeks, shows how Prato's supply chain managers are quietly re-routing orders around the new duties — and what it reveals about where the next bottleneck will be.",
    heroImageUrl:'https://images.unsplash.com/photo-1758270804188-8ca0b6d254bc?w=1600&q=80&fit=crop&auto=format',
    imageSeed:'tariffdesk7',
    coverCaption:'A cutting floor in Prato, photographed during a routine production run, June 2026.',
    authorId:'u-1', editorId:'u-2', category:'Business', tags:['Tariffs','Sourcing','Supply Chain'],
    status:'published', isFeatured:true, readingTime:11, commentCount:4,
    publishedAt:'2026-06-27T09:00:00Z', updatedAt:'2026-06-28T08:15:00Z',
    sections:[
      {id:'surfaced', heading:"How the Spreadsheet Surfaced"},
      {id:'inside', heading:"What's Actually Inside It"},
      {id:'mills', heading:'The Three Mills Involved'},
      {id:'worried', heading:'Why Sourcing Directors Are Worried'},
      {id:'next', heading:'What Happens Next'},
    ],
    citations:[
      {label:'Source mills (names withheld on request), interviewed June 2026', url:'#'},
      {label:'Forum della Moda Market Desk — tariff-adjusted input cost dataset', url:'market.html'},
    ],
    relatedArticleIds:['art-cashmere-economics','art-flagship-shrink'],
    relatedDiscussionIds:['disc-tariffs'],
    relatedQuestionIds:[],
    relatedExpertIds:['exp-marta'],
    relatedMarketSymbols:['Cotton','Brent Oil','EUR / USD'],
    relatedEventIds:['ev-traceability'],
    viewCount:18400, saveCount:312, shareCount:96,
    pollId:'poll-tariff',
    galleryImages:[
      { src:'https://picsum.photos/seed/prato-mill-floor-01/900/700', alt:'Cutting floor', caption:'The cutting floor at one of the mills involved, photographed in May.' },
      { src:'https://picsum.photos/seed/prato-mill-floor-02/900/700', alt:'Loading dock', caption:'A loading dock awaiting a re-routed shipment.' },
      { src:'https://picsum.photos/seed/prato-mill-floor-03/900/700', alt:'Finishing line', caption:'The finishing line at the northern facility.' },
    ],
    revisionHistory:[
      { date:'Jun 27, 09:00', label:'Published' },
      { date:'Jun 27, 14:40', label:'Corrected mill count', note:'An earlier version said four mills; sources confirm three.' },
      { date:'Jun 28, 08:15', label:'Added sourcing director response' },
    ],
  }),
  createArticle({
    id:'art-cashmere-economics', slug:'recycled-cashmere-economics',
    title:'The Economics of Recycled Cashmere', category:'Circular Fashion', tags:['Cashmere','Circular Fashion','Recycling'],
    heroImageUrl:'https://picsum.photos/seed/prato-recycled-cashmere/700/880', imageSeed:'prato-recycled-cashmere',
    authorId:'u-1', status:'published', readingTime:8, commentCount:14, viewCount:6200,
    publishedAt:'2026-06-24T09:00:00Z',
  }),
  createArticle({
    id:'art-flagship-shrink', slug:'flagship-stores-shrinking',
    title:'Why Flagship Stores Are Shrinking', category:'Retail', tags:['Retail','Store Design'],
    heroImageUrl:'https://picsum.photos/seed/prato-flagship-retail/700/880', imageSeed:'prato-flagship-retail',
    authorId:'u-2', status:'published', readingTime:4, commentCount:9, viewCount:4100,
    publishedAt:'2026-06-25T09:00:00Z',
  }),
  createArticle({
    id:'art-changeover-time', slug:'cutting-changeover-time-lean',
    title:'The 90-Minute Changeover: How One Cut-and-Sew Line Cut It to 22',
    category:'Lean Manufacturing', tags:['Lean Manufacturing','OEE','Changeover'],
    heroImageUrl:'https://picsum.photos/seed/prato-lean-cut-sew/700/880', imageSeed:'prato-lean-cut-sew',
    authorId:'u-1', status:'published', readingTime:9, commentCount:21, viewCount:7400,
    publishedAt:'2026-06-21T09:00:00Z', relatedDiscussionIds:['disc-changeover'],
  }),
  createArticle({
    id:'art-spc-quality', slug:'spc-knitting-line-quality',
    title:'What Statistical Process Control Actually Catches on a Knitting Line',
    category:'Quality Engineering', tags:['SPC','Quality Engineering','Knitting'],
    heroImageUrl:'https://picsum.photos/seed/prato-spc-knitting/700/880', imageSeed:'prato-spc-knitting',
    authorId:'u-2', status:'published', readingTime:7, commentCount:11, viewCount:3900,
    publishedAt:'2026-06-19T09:00:00Z', relatedDiscussionIds:['disc-spc-knitting'],
  }),
  createArticle({
    id:'art-reactive-dye-batch', slug:'reactive-dye-batch-consistency',
    title:'Inside the Batch Sheet: How Dyehouses Are Closing the Colour Consistency Gap',
    category:'Dyeing', tags:['Dyeing','Colour Matching','Reactive Dyes'],
    heroImageUrl:'https://picsum.photos/seed/prato-dye-house/700/880', imageSeed:'prato-dye-house',
    authorId:'u-1', status:'published', readingTime:10, commentCount:17, viewCount:5300,
    publishedAt:'2026-06-16T09:00:00Z', relatedDiscussionIds:['disc-colorconsistency'],
    relatedExpertIds:['exp-chiara'],
  }),
  createArticle({
    id:'art-rapier-tech', slug:'rapier-loom-fine-count-cotton',
    title:'Why Fine-Count Cotton Is Still Breaking Rapier Looms in 2026',
    category:'Weaving', tags:['Weaving','Rapier Looms','Yarn Quality'],
    heroImageUrl:'https://picsum.photos/seed/prato-rapier-loom/700/880', imageSeed:'prato-rapier-loom',
    authorId:'u-2', status:'published', readingTime:8, commentCount:13, viewCount:4600,
    publishedAt:'2026-06-15T09:00:00Z', relatedDiscussionIds:['disc-warpbreaks'],
    relatedExpertIds:['exp-paolo'],
  }),
  createArticle({
    id:'art-stenter-finishing', slug:'stenter-finishing-energy-gsm',
    title:'The Stenter Frame Trade-Off: Energy Savings Without Losing GSM',
    category:'Finishing', tags:['Finishing','Energy Efficiency','Stenter'],
    heroImageUrl:'https://picsum.photos/seed/prato-stenter-finishing/700/880', imageSeed:'prato-stenter-finishing',
    authorId:'u-1', status:'published', readingTime:7, commentCount:8, viewCount:2900,
    publishedAt:'2026-06-13T09:00:00Z', relatedDiscussionIds:['disc-stenter-energy'],
    relatedExpertIds:['exp-anna'],
  }),
  createArticle({
    id:'art-microfiber-shedding', slug:'microfiber-shedding-construction',
    title:'The Quiet Fix for Microfiber Shedding Nobody Wants to Pay For',
    category:'Sustainability', tags:['Sustainability','Microfiber Shedding','Water Treatment'],
    heroImageUrl:'https://picsum.photos/seed/prato-microfiber-filter/700/880', imageSeed:'prato-microfiber-filter',
    authorId:'u-2', status:'published', readingTime:9, commentCount:26, viewCount:8100, isFeatured:true,
    publishedAt:'2026-06-10T09:00:00Z', relatedDiscussionIds:['disc-waterreuse'],
    relatedExpertIds:['exp-davide'], pollId:'poll-microfiber',
  }),
  createArticle({
    id:'art-pilling-standards', slug:'pilling-test-lab-variance',
    title:'Why Two Accredited Labs Can Disagree on the Same Pilling Sample',
    category:'Laboratory Testing', tags:['Lab Testing','Pilling','ISO 12945'],
    heroImageUrl:'https://picsum.photos/seed/prato-lab-testing/700/880', imageSeed:'prato-lab-testing',
    authorId:'u-1', status:'published', readingTime:6, commentCount:7, viewCount:2400,
    publishedAt:'2026-06-12T09:00:00Z', relatedDiscussionIds:['disc-pilling-lab'],
    relatedExpertIds:['exp-sofia'],
  }),
  createArticle({
    id:'art-nearshoring-numbers', slug:'nearshoring-landed-cost-2026',
    title:'We Ran the Landed-Cost Numbers on Nearshoring. The Answer Was Not Simple.',
    category:'Supply Chain', tags:['Supply Chain','Nearshoring','Landed Cost'],
    heroImageUrl:'https://picsum.photos/seed/prato-supply-chain/700/880', imageSeed:'prato-supply-chain',
    authorId:'u-2', status:'published', readingTime:12, commentCount:34, viewCount:9700, isFeatured:true,
    publishedAt:'2026-06-09T09:00:00Z', relatedDiscussionIds:['disc-nearshoring'],
    relatedExpertIds:['exp-marta'],
  }),
  createArticle({
    id:'art-predictive-maintenance', slug:'predictive-maintenance-looms-sensors',
    title:'Which Loom Sensors Actually Pay for Themselves Within a Year',
    category:'Maintenance', tags:['Maintenance','Predictive Maintenance','Looms'],
    heroImageUrl:'https://picsum.photos/seed/prato-loom-sensors/700/880', imageSeed:'prato-loom-sensors',
    authorId:'u-1', status:'published', readingTime:8, commentCount:15, viewCount:3700,
    publishedAt:'2026-06-20T09:00:00Z', relatedDiscussionIds:['disc-predictive-maint'],
    relatedExpertIds:['exp-marco'],
  }),
  createArticle({
    id:'art-ai-inspection', slug:'ai-fabric-inspection-cameras-roi',
    title:'AI Fabric Inspection Cameras: What the First Adopters Actually Got Back',
    category:'Textile Technology', tags:['AI','Defect Detection','Automation'],
    heroImageUrl:'https://picsum.photos/seed/prato-ai-inspection/700/880', imageSeed:'prato-ai-inspection',
    authorId:'u-2', status:'published', readingTime:10, commentCount:29, viewCount:7900,
    publishedAt:'2026-06-22T09:00:00Z', relatedDiscussionIds:['disc-ai-inspection-cams'],
    relatedExpertIds:['exp-renzo','exp-paolo'],
  }),
];
