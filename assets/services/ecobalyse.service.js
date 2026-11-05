/* ============================================================
   ECOBALYSE SERVICE — PH-33C data contract alignment
   assets/services/ecobalyse.service.js
   ============================================================ */

import { simulateImpact, mapPayload, handleApiError, getFallbackResult } from './ecobalyse.adapter.js';

/**
 * Validate a single material entry.
 * Returns true if the entry has a non-empty id and a valid positive share percentage.
 */
function isValidMaterialEntry(entry = {}) {
  const id = String(entry.id || '').trim();
  const share = Number(entry.share);
  return id.length > 0 && Number.isFinite(share) && share > 0;
}

/**
 * Validate the complete simulation input.
 * Performs lightweight checks before payload mapping.
 */
export function validateSimulationInput(input = {}) {
  const product = String(input.product || '').trim();
  const materials = Array.isArray(input.materials) ? input.materials.filter(isValidMaterialEntry) : [];

  if (!product) {
    const error = new Error('Campo obbligatorio mancante: prodotto.');
    error.status = 400;
    throw error;
  }

  if (materials.length === 0) {
    const error = new Error('Inserisci almeno una quota materiale valida > 0%.');
    error.status = 400;
    throw error;
  }

  return true;
}

/**
 * Build a normalized PratoHub input object from raw values.
 * This bridges page controller values to the Ecobalyse data contract.
 */
export function buildSimulationInput({
  product,
  mass,
  materials,
  countrySpinning,
  business,
  numberOfReferences,
  price,
  upcycled,
  durability,
  physicalDurability,
  countryDyeing,
  countryFabric,
  countryMaking,
  fabricProcess,
  dyingProcessType,
  makingComplexity,
  makingWaste,
  makingDeadStock,
  fading,
  airTransportRatio,
  printing,
  surfaceMass,
  yarnSize,
  trims,
  disabledSteps,
} = {}) {
  return {
    product: product ? String(product).trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-') : '',
    mass: Number(mass) || 0.15,
    materials: Array.isArray(materials) ? materials.filter(isValidMaterialEntry).map(m => ({ id: String(m.id).trim(), share: Number(m.share || 0) })) : [],
    countrySpinning: countrySpinning ? String(countrySpinning).trim() : 'IT',
    business: business ? String(business).trim() : 'large-business-without-services',
    numberOfReferences: Number(numberOfReferences) || 1000,
    price: Number(price) || 10,
    upcycled: Boolean(upcycled),
    durability: Number(durability) || null,
    physicalDurability: Number(physicalDurability) || null,
    countryDyeing: countryDyeing ? String(countryDyeing).trim() : undefined,
    countryFabric: countryFabric ? String(countryFabric).trim() : undefined,
    countryMaking: countryMaking ? String(countryMaking).trim() : undefined,
    fabricProcess: fabricProcess ? String(fabricProcess).trim() : undefined,
    dyingProcessType: dyingProcessType ? String(dyingProcessType).trim() : undefined,
    makingComplexity: makingComplexity ? String(makingComplexity).trim() : undefined,
    makingWaste: makingWaste !== undefined && makingWaste !== null && makingWaste !== '' ? Number(makingWaste) : undefined,
    makingDeadStock: makingDeadStock !== undefined && makingDeadStock !== null && makingDeadStock !== '' ? Number(makingDeadStock) : undefined,
    fading: Boolean(fading),
    airTransportRatio: airTransportRatio !== undefined && airTransportRatio !== null && airTransportRatio !== '' ? Number(airTransportRatio) : undefined,
    printing: printing || undefined,
    surfaceMass: surfaceMass !== undefined && surfaceMass !== null && surfaceMass !== '' ? Number(surfaceMass) : undefined,
    yarnSize: yarnSize !== undefined && yarnSize !== null && yarnSize !== '' ? String(yarnSize).trim() : undefined,
    trims: Array.isArray(trims) ? trims.filter(Boolean) : undefined,
    disabledSteps: Array.isArray(disabledSteps) ? disabledSteps.filter(Boolean) : undefined,
  };
}

/**
 * Run textile impact simulation through the controlled adapter layer.
 * No direct production API calls from this module.
 */
export async function simulateTextileImpact(input = {}) {
  const normalized = buildSimulationInput(input);
  validateSimulationInput(normalized);

  try {
    return await simulateImpact(normalized);
  } catch (error) {
    const mapped = handleApiError(error);
    const fallback = getFallbackResult(normalized);
    fallback.description = mapped.message || fallback.description;
    fallback.errorType = mapped.type;
    return fallback;
  }
}

export function buildDefaultMaterials() {
  return [
    { id: '62a4d6fb-3276-4ba5-93a3-889ecd3bff84', name: 'Cotone', share: 100, icon: '🧵' },
    { id: 'recycled-poly', name: 'Poliestere riciclato', share: 0, icon: '♻️' },
    { id: 'wool', name: 'Lana', share: 0, icon: '🐑' },
    { id: 'recycled-cashmere', name: 'Cashmere riciclato', share: 0, icon: '🧶' },
    { id: 'linen', name: 'Lino', share: 0, icon: '🌿' },
    { id: 'hemp', name: 'Canapa', share: 0, icon: '🌱' },
  ];
}

export function buildMaterialShareArray(inputs = []) {
  return inputs
    .filter(item => item && item.id && Number(item.share || 0) > 0)
    .map(item => ({ id: item.id, share: Number(item.share) / 100 }));
}

export function validateProduct(value) {
  if (!value) return '';
  return String(value).trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
}
