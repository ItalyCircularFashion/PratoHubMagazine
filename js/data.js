/**
 * data.js — dati per PratoHub V2 (placeholder di test)
 *
 * Sostituire i valori [DA INSERIRE] con i dati verificati.
 * Struttura: v2/schema → dati in trejs per le scenze.
 */

// ============================================================
// 1. STATISTICHE
// ============================================================
export const stats = [
  { id: 'imprese',     label: 'Imprese (anni 90)',       value: 7463 },
  { id: 'addetti',     label: 'Addetti (2021)',           value: 46481 },
  { id: 'export',      label: 'Export (mld € 2021)',      value: 1168 },
  { id: 'riciclo',     label: 'Tessuti riciclati',        value: 842 },
];

// ============================================================
// 2. CARDATO (fasi)
// ============================================================
export const cardato = [
  { step: 1, title: 'Cardatura',      desc: 'Sfilatura dei lanoli', color: '#c81d62' },
  { step: 2, title: 'Tornitura',      desc: 'Rendimento del filato', color: '#0f7f6e' },
  { step: 3, title: 'Stop',           desc: 'Controllo qualità',     color: '#1b2a52' },
  { step: 4, title: 'Filato',         desc: 'Spino e filo',          color: '#b06a1a' },
  { step: 5, title: 'Vegetazione',    desc: 'Tenuta del filato',     color: '#0f7f6e' },
  { step: 6, title: 'Pieno',          desc: 'Tessitura del telaio', color: '#c81d62' },
];

// ============================================================
// 3. COMUNI (territorio)
// ============================================================
export const comuni = [
  { name: 'Prato',       pop: '211.95', role: 'centro',       color: '#c81d62' },
  { name: 'Gambettola',  pop: '25.84',  role: 'bottega',      color: '#0f7f6e' },
  { name: 'San Piero a Ponti', pop: '22.98', role: 'archeologia', color: '#1b2a52' },
  { name: 'Belmonte',    pop: '20.17',  role: 'medievale',    color: '#b06a1a' },
  { name: 'Alto Reno',   pop: '12.54',  role: 'conca',        color: '#0f7f6e' },
  { name: 'Paraco',      pop: '6.71',   role: 'valle',        color: '#b06a1a' },
  { name: 'Laghè',       pop: '5.03',   role: 'riserva',      color: '#c81d62' },
];

// ============================================================
// 4. AZIENDE (sample)
// ============================================================
export const aziende = [
  { name: 'Piatti',   sector: 'cuoio',   founded: '1952', city: 'Prato' },
  { name: 'San Martino', sector: 'telaio', founded: '1948', city: 'Prato' },
  { name: 'Rinascente', sector: 'macellazione', founded: '1880', city: 'Prato' },
  { name: 'Crocetti',   sector: 'salume', founded: '1889', city: 'Prato' },
  { name: 'Cantucci',   sector: 'panificazione', founded: '1925', city: 'Prato' },
  { name: 'Dolci',      sector: 'cuoio',   founded: '1912', city: 'Prato' },
  { name: 'Musei',       sector: 'cuoio',   founded: '1960', city: 'Prato' },
  { name: 'Lana',       sector: 'telaio', founded: '1975', city: 'Prato' },
  { name: 'Vetri',      sector: 'vetro',   founded: '1930', city: 'Prato' },
];

// ============================================================
// 5. DATI STATISTICHE (per il grafico 3D)
// ============================================================
export const dati = {
  years: ['2017', '2019', '2021', '2023'],
  imprese: [7463, 7253, 7193, 7018],
  addetti: [46481, 46540, 46481, null],
  export:  [1050, 1240, 1168, null],
};

// ============================================================
// 6. FONTI
// ============================================================
export const sources = [
  { id: 'istat',    label: 'Istat — Residenza e condizioni di salute', url: 'https://www.istat.it' },
  { id: 'confindussile', label: 'Confindussile Toscana — Distretti', url: 'https://www.confindussile.toscana.it' },
  { id: 'reDigitale', label: 'Redazione — dati interni', url: '#' },
];
