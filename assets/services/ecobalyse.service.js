/* ============================================================
   ECOBALYSE SERVICE
   assets/services/ecobalyse.service.js
   ============================================================ */

const API_BASE = 'https://ecobalyse.beta.gouv.fr';

async function postJSON(path, body = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (response.status === 404) {
    return { notFound: true, status: response.status };
  }
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    const error = new Error(`Ecobalyse API error: ${response.status}`);
    error.status = response.status;
    error.body = text;
    throw error;
  }
  return response.json();
}

export async function simulateTextileImpact({ product, mass, materials, countrySpinning, business, numberOfReferences = 1000, price = 10, upcycled = false } = {}) {
  const safeCount = Number(numberOfReferences);
  const safePrice = Number(price);
  const safeMass = Number(mass);

  if (!product || !Array.isArray(materials) || materials.length === 0) {
    const error = new Error('Parametri mancanti: seleziona prodotto e materiali.');
    error.status = 400;
    throw error;
  }

  const payload = {
    business: business || 'large-business-without-services',
    countrySpinning: countrySpinning || 'IT',
    mass: Number.isFinite(safeMass) && safeMass > 0 ? safeMass : 0.15,
    materials,
    numberOfReferences: Number.isFinite(safeCount) && safeCount > 0 ? safeCount : 1000,
    price: Number.isFinite(safePrice) && safePrice >= 0 ? safePrice : 10,
    product,
    upcycled: Boolean(upcycled),
  };

  return postJSON('/api/textile/simulator', payload);
}

export function buildDefaultMaterials() {
  return [
    { id: 'cotton', name: 'Cotone', share: 100, icon: '🧵' },
    { id: 'recycled-polyester', name: 'Poliestere riciclato', share: 0, icon: '♻️' },
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
