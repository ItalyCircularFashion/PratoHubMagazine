/* ============================================================
   JSON UTILITIES — Ecobalyse advanced workspace
   assets/utils/json-download.js
   ============================================================ */

const HISTORY_KEY = 'pratohub.ecobalyse.history';
const HISTORY_LIMIT = 20;

export function buildPayloadFromForm() {
  const productInput = document.getElementById('ecoProduct');
  const massInput = document.getElementById('ecoMass');
  const countrySpinning = document.getElementById('ecoCountry');
  const business = document.getElementById('ecoBusiness');
  const quantity = document.getElementById('ecoQuantity');
  const price = document.getElementById('ecoPrice');
  const upcycledCheckbox = document.getElementById('ecoUpcycled');

  const materialRows = Array.from(document.querySelectorAll('.eco-material-row')).map(row => ({
    id: String(row.dataset.materialId || '').trim(),
    name: String(row.dataset.materialName || '').trim(),
    share: Number(row.querySelector('.eco-share')?.value || 0) || 0,
  }));

  const payload = {
    product: productInput ? String(productInput.value || '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-') : '',
    mass: Number(massInput?.value || 0) || 0.15,
    materials: materialRows.filter(m => m.id && Number(m.share || 0) > 0).map(m => ({ id: m.id, share: Number(m.share) / 100 })),
    countrySpinning: countrySpinning ? String(countrySpinning.value) : 'IT',
    business: business ? String(business.value || '').trim() : 'large-business-without-services',
    numberOfReferences: Number(quantity?.value || 0) || 1000,
    price: Number(price?.value || 0) || 10,
    upcycled: Boolean(upcycledCheckbox?.checked),
  };

  return payload;
}

export function validatePayload(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') return ['Configurazione non valida.'];
  if (!payload.product) errors.push(' prodotto mancante.');
  if (!Array.isArray(payload.materials)) errors.push(' materials non è un array.');
  if (typeof payload.mass !== 'number' || Number.isNaN(payload.mass)) errors.push(' massa non numerica.');
  if (typeof payload.price !== 'number' || Number.isNaN(payload.price)) errors.push(' prezzo non numerico.');
  if (typeof payload.numberOfReferences !== 'number' || Number.isNaN(payload.numberOfReferences)) errors.push(' numero di riferimenti non numerico.');
  return errors;
}

export function downloadJSON(payload, filename = 'simulation.json') {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Impossibile leggere il file.'));
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);
        resolve(json);
      } catch {
        reject(new Error('File JSON non valido.'));
      }
    };
    reader.readAsText(file);
  });
}

export async function copyJSONToClipboard(payload) {
  const text = JSON.stringify(payload, null, 2);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
}

export function encodeSharePayload(payload) {
  try {
    const json = JSON.stringify(payload);
    return btoa(unescape(encodeURIComponent(json)));
  } catch {
    return '';
  }
}

export function decodeSharePayload(encoded) {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const items = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(items)) return [];
    return items.slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
}

export function saveHistory(items) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, HISTORY_LIMIT)));
  } catch {
    // ignore quota/readonly storage errors silently
  }
}

export function pushHistoryEntry(entry) {
  const items = getHistory();
  const record = {
    date: new Date().toISOString(),
    product: entry?.product,
    score: entry?.score,
    mass: entry?.mass,
    materials: entry?.materials,
    payload: entry?.payload,
  };
  items.unshift(record);
  if (items.length > HISTORY_LIMIT) items.length = HISTORY_LIMIT;
  saveHistory(items);
  return items;
}
