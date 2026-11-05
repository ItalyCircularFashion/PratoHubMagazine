// SYNTHETIC DEMO dataset — PratoHubMagazine PUBLIC Directory (NO real data)
// Nessuna P.IVA fittizia: vatNumber/rea sempre null. Ogni record è DEMO, publish.allowed=false.
// Cubre TX-01..TX-12 e categorie B2B: filatura, tessitura, tintoria, maglieria, confezione, taglio, stireria/QC, terzisti, fornitori, laboratori.
import { createCompany } from '../models/company.model.js';

export const DEMO_SYNTHETIC_VERSION = 'synthetic-2026-11-05';
export const companiesSynthetic = [

  createCompany({
    id: 'demo-filatura-cardata-001', name: 'Filatura Esempio Cardata Demo S.r.l.',
    city: 'Prato', district: 'PO', legalForm: 'S.r.l.', website: null, vatNumber: null, rea: null,
    specialization: 'Filatura cardata (demo)', description: 'Prof. demo: filatura cardata conto terzi, filati misto lana per maglieria e tessitura. Dati inventati per layout.',
    datasetType: 'DEMO',
    verification: {identity: 'DEMO', information: 'DEMO', publishEligibility: 'DEMO_FORBIDDEN'},
    publish: {allowed: false, reason: 'Dataset DEMO sintetico, non pubblicabile come reale.'},
    sources: [{type: 'WEBSITE', url: 'https://example.com/filatura-esempio-cardata-demo'}],
    texCodes: [{code: 'TX-02.01.01', label: 'Filatura cardata', confidence: 'HIGH', source: 'https://example.com/taxonomy'}],
    sectorsB2B: ['filati', 'terzisti'], productSectors: ['Filatura cardata'], technologies: ['Carding'],
  }),

  createCompany({
    id: 'demo-tessitura-operati-001', name: 'Tessitura Esempio Operati Demo S.p.A.',
    city: 'Prato', district: 'PO', legalForm: 'S.p.A.', website: null, vatNumber: null, rea: null,
    specialization: 'Tessitura ortogonale (demo)', description: 'Prof. demo: tessitura di tessuti operati/jacquard per abbigliamento. Dati inventati.',
    datasetType: 'DEMO',
    verification: {identity: 'DEMO', information: 'DEMO', publishEligibility: 'DEMO_FORBIDDEN'},
    publish: {allowed: false, reason: 'Dataset DEMO sintetico.'},
    sources: [{type: 'WEBSITE', url: 'https://example.com/tessitura-esempio-demo'}],
    texCodes: [{code: 'TX-06.01.02', label: 'Produzione di tessuti operati', confidence: 'HIGH', source: 'https://example.com/taxonomy'}],
    sectorsB2B: ['tessitura', 'tessile'], productSectors: ['Jacquard', 'Operati'], technologies: ['Rapier'],
  }),

  createCompany({
    id: 'demo-tintoria-pezza-001', name: 'Tintoria Esempio Pezza Demo S.r.l.',
    city: 'Prato', district: 'PO', legalForm: 'S.r.l.', website: null, vatNumber: null, rea: null,
    specialization: 'Tintura in pezza (demo)', description: 'Prof. demo: tintoria e finissaggio tessuti in pezza. Dati inventati.',
    datasetType: 'DEMO',
    verification: {identity: 'DEMO', information: 'DEMO', publishEligibility: 'DEMO_FORBIDDEN'},
    publish: {allowed: false, reason: 'Dataset DEMO sintetico.'},
    sources: [{type: 'WEBSITE', url: 'https://example.com/tintoria-esempio-demo'}],
    texCodes: [{code: 'TX-04.01.03', label: 'Tintura in pezza', confidence: 'HIGH', source: 'https://example.com/taxonomy'}],
    sectorsB2B: ['tintoria-finissaggio'], productSectors: ['Tintura', 'Finissaggio'],
  }),

  createCompany({
    id: 'demo-maglieria-smacchina-001', name: 'Maglieria Esempio Demo S.r.l.',
    city: 'Prato', district: 'PO', legalForm: 'S.r.l.', website: null, vatNumber: null, rea: null,
    specialization: 'Smacchinatura (demo)', description: 'Prof. demo: smacchinatura di pannelli per maglieria finezza 7gg. Dati inventati.',
    datasetType: 'DEMO',
    verification: {identity: 'DEMO', information: 'DEMO', publishEligibility: 'DEMO_FORBIDDEN'},
    publish: {allowed: false, reason: 'Dataset DEMO sintetico.'},
    sources: [{type: 'WEBSITE', url: 'https://example.com/maglieria-esempio-demo'}],
    texCodes: [{code: 'TX-07.01.01', label: 'Smacchinatura', confidence: 'HIGH', source: 'https://example.com/taxonomy'}],
    sectorsB2B: ['maglieria'], productSectors: ['Maglieria'],
  }),

  createCompany({
    id: 'demo-confezione-taglio-001', name: 'Confezioni Esempio Taglio Demo S.r.l.',
    city: 'Prato', district: 'PO', legalForm: 'S.r.l.', website: null, vatNumber: null, rea: null,
    specialization: 'Taglio industriale (demo)', description: 'Prof. demo: taglio industriale e confezione conto terzi. Dati inventati.',
    datasetType: 'DEMO',
    verification: {identity: 'DEMO', information: 'DEMO', publishEligibility: 'DEMO_FORBIDDEN'},
    publish: {allowed: false, reason: 'Dataset DEMO sintetico.'},
    sources: [{type: 'WEBSITE', url: 'https://example.com/confezioni-esempio-demo'}],
    texCodes: [{code: 'TX-10.01.01', label: 'Taglio industriale', confidence: 'HIGH', source: 'https://example.com/taxonomy'}],
    sectorsB2B: ['confezione', 'taglio-modellistica', 'terzisti'], productSectors: ['Confezione'],
  }),

  createCompany({
    id: 'demo-controllo-qualita-001', name: 'Controllo Esempio Qualità Demo S.r.l.',
    city: 'Prato', district: 'PO', legalForm: 'S.r.l.', website: null, vatNumber: null, rea: null,
    specialization: 'Controllo tessuto finito (demo)', description: 'Prof. demo: controllo qualità e riparazione tessuti, rammendo. Dati inventati.',
    datasetType: 'DEMO',
    verification: {identity: 'DEMO', information: 'DEMO', publishEligibility: 'DEMO_FORBIDDEN'},
    publish: {allowed: false, reason: 'Dataset DEMO sintetico.'},
    sources: [{type: 'WEBSITE', url: 'https://example.com/controllo-esempio-demo'}],
    texCodes: [{code: 'TX-09.01.01', label: 'Controllo tessuto finito', confidence: 'HIGH', source: 'https://example.com/taxonomy'}],
    sectorsB2B: ['stireria-qc'], productSectors: ['Controllo qualità'],
  }),

  createCompany({
    id: 'demo-cernita-riciclo-001', name: 'Recupero Esempio Cernita Demo S.r.l.',
    city: 'Prato', district: 'PO', legalForm: 'S.r.l.', website: null, vatNumber: null, rea: null,
    specialization: 'Cernita materiali post-consumo (demo)', description: 'Prof. demo: cernita e selezione materiali tessili post-consumo. Dati inventati.',
    datasetType: 'DEMO',
    verification: {identity: 'DEMO', information: 'DEMO', publishEligibility: 'DEMO_FORBIDDEN'},
    publish: {allowed: false, reason: 'Dataset DEMO sintetico.'},
    sources: [{type: 'WEBSITE', url: 'https://example.com/recupero-esempio-demo'}],
    texCodes: [{code: 'TX-01.01.01', label: 'Cernita materiali post-consumo', confidence: 'HIGH', source: 'https://example.com/taxonomy'}],
    sectorsB2B: ['tessile', 'fornitori-servizi'], productSectors: ['Recupero', 'Cernita'],
  }),

  createCompany({
    id: 'demo-fornitori-logistica-001', name: 'Fornitori Esempio Logistica Demo S.r.l.',
    city: 'Prato', district: 'PO', legalForm: 'S.r.l.', website: null, vatNumber: null, rea: null,
    specialization: 'Commercio all\u2019ingrosso tessuti (demo)', description: 'Prof. demo: commercio all\u2019ingrosso tessuti e logistica distrettuale. Dati inventati.',
    datasetType: 'DEMO',
    verification: {identity: 'DEMO', information: 'DEMO', publishEligibility: 'DEMO_FORBIDDEN'},
    publish: {allowed: false, reason: 'Dataset DEMO sintetico.'},
    sources: [{type: 'WEBSITE', url: 'https://example.com/fornitori-esempio-demo'}],
    texCodes: [{code: 'TX-12.01.01', label: 'Commercio all\u2019ingrosso tessuti', confidence: 'HIGH', source: 'https://example.com/taxonomy'}],
    sectorsB2B: ['fornitori-servizi'], productSectors: ['Commercio'],
  }),

];

// REAL allowlist: intenzionalmente vuota finché non approvata l'esportazione delle 91.
export const companiesRealAllowlist = [];
