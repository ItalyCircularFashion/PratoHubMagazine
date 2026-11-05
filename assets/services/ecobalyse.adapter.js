/* ============================================================
   ECOBALYSE INTEGRATION ADAPTER — PH-32C skeleton
   assets/services/ecobalyse.adapter.js
   ============================================================ */

const MODE_LOCAL = 'local';
const MODE_PROXY = 'proxy';

let currentProvider = MODE_LOCAL;

export function setProvider(mode) {
  if (mode === MODE_PROXY || mode === MODE_LOCAL) {
    currentProvider = mode;
  }
}

export function getProvider() {
  return currentProvider;
}

export function mapPayload(input = {}) {
  const safeCount = Number(input.numberOfReferences);
  const safePrice = Number(input.price);
  const safeMass = Number(input.mass);

  const materials = Array.isArray(input.materials)
    ? input.materials.filter(m => m && m.id && Number(m.share || 0) > 0).map(m => ({ id: String(m.id).trim(), share: Number(m.share) / 100 }))
    : [];

  return {
    product: input.product ? String(input.product).trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-') : '',
    mass: Number.isFinite(safeMass) && safeMass > 0 ? safeMass : 0.15,
    materials,
    countrySpinning: input.countrySpinning ? String(input.countrySpinning).trim() : 'IT',
    business: input.business ? String(input.business).trim() : 'large-business-without-services',
    numberOfReferences: Number.isFinite(safeCount) && safeCount > 0 ? safeCount : 1000,
    price: Number.isFinite(safePrice) && safePrice >= 0 ? safePrice : 10,
    upcycled: Boolean(input.upcycled),
  };
}

export function mapResponse(data = {}) {
  const impacts = data.impacts || {};
  return {
    globalWarming: impacts.cch ?? data.globalWarming ?? null,
    ecotoxicity: impacts.etf ?? null,
    waterConsumption: impacts.wtu ?? null,
    resourceConsumption: impacts.fru ?? null,
    landUse: impacts.ldu ?? null,
    airAcidification: impacts.acd ?? null,
    waterEutrophication: impacts.fwe ?? null,
    durability: data.durability ?? null,
    physicalDurability: data.physicalDurability ?? null,
    daysOfWear: data.daysOfWear ?? null,
    useNbCycles: data.useNbCycles ?? null,
    raw: data,
  };
}

export function handleApiError(error) {
  const status = error?.status;
  if (status === 401) {
    return { type: 'auth', message: 'Servizio temporaneamente non disponibile.' };
  }
  if (status === 429) {
    return { type: 'rate_limit', message: 'Troppe richieste. Riprova tra poco.' };
  }
  if (status === 400) {
    return { type: 'validation', message: error?.body || 'Parametri non validi.' };
  }
  return { type: 'unknown', message: error?.message || 'Impossibile contattare il servizio Ecobalyse.' };
}

export function getFallbackResult(payload) {
  return {
    globalWarming: null,
    ecotoxicity: null,
    waterConsumption: null,
    resourceConsumption: null,
    landUse: null,
    airAcidification: null,
    waterEutrophication: null,
    description: 'Modalità offline: risultati non disponibili.',
    offline: true,
    payload,
  };
}

export async function simulateImpact(input = {}) {
  const payload = mapPayload(input);

  if (getProvider() === MODE_PROXY) {
    // Future proxy implementation goes here.
    // Do not add token/URL/credentials in this file.
    return getFallbackResult(payload);
  }

  return getFallbackResult(payload);
}
