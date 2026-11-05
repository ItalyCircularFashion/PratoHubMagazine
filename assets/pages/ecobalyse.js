/* ============================================================
   ECOBALYSE PAGE CONTROLLER — PH-33B dashboard UX
   assets/pages/ecobalyse.js
   ============================================================ */

import { mountBreadcrumbs } from '../services/navigation.service.js';
import { simulateTextileImpact, buildDefaultMaterials, buildMaterialShareArray, validateProduct } from '../services/ecobalyse.service.js';

const productPreset = {
  tshirt: 0.15,
  jeans: 0.8,
  sweater: 0.4,
  shirt: 0.25,
};

function el(id) {
  return document.getElementById(id);
}

function setText(id, text) {
  const node = el(id);
  if (node) node.textContent = text;
}

function setHtml(id, html) {
  const node = el(id);
  if (node) node.innerHTML = html;
}

function clampInputs() {
  const mass = el('ecoMass');
  const quantity = el('ecoRefs');
  const price = el('ecoPrice');
  if (mass) mass.value = String(Math.max(Number(mass.min || 0), Math.min(Number(mass.max || 4000), Number(mass.value || 0.15))) || 0.15);
  if (quantity) quantity.value = String(Math.max(Number(quantity.min || 0), Math.min(Number(quantity.max || 10000000), Number(quantity.value || 100000))) || 100000);
  if (price) price.value = String(Math.max(Number(price.min || 0), Math.min(Number(price.max || 50000), Number(price.value || 10))) || 10);
}

function clearResults() {
  ['ecoScore','ecoResultsInner','ecoLoading','ecoError','ecoNotes'].forEach(id => setHtml(id, ''));
  const section = el('results');
  if (section) section.hidden = true;
}

function renderResultIndicator(label, value, unit) {
  const safeValue = value == null ? '-' : value;
  const unitLabel = unit ? ` <span class="eco-unit">${unit}</span>` : '';
  return `<div class="eco-indicator"><div class="eco-indicator-label">${label}</div><div class="eco-indicator-value">${safeValue}${unitLabel}</div></div>`;
}

function setErrorHtml(message) {
  setHtml('ecoError', message ? `<div class="eco-error">${message}</div>` : '');
}

function setLoading(message) {
  setHtml('ecoLoading', message || '');
}

function renderPlaceholderIndicators() {
  const placeholders = [
    ['Cambiamento climatico', '—', 'kg CO₂e'],
    ['Ecotossicità', '—', 'CTUe'],
    ['Consumo idrico', '—', 'm³/unit'],
    ['Consumo risorse', '—', 'MJ/unit'],
    ['Uso del suolo', '—', 'm²/unit'],
    ['Acidificazione aria', '—', 'mol H⁺/unit'],
    ['Eutrofizzazione idrica', '—', 'kg PO₄e'],
  ];
  setHtml('ecoResultsInner', placeholders.map(([label, value, unit]) => renderResultIndicator(label, value, unit)).join(''));
}

async function runSimulation() {
  clampInputs();
  const productInput = el('ecoProduct');
  const massInput = el('ecoMass');
  const countrySpinning = el('ecoCountry');
  const business = el('ecoBusiness');
  const quantity = el('ecoQuantity');
  const price = el('ecoPrice');
  const upcycledCheckbox = el('ecoUpcycled');

  const materialsArray = Array.from(document.querySelectorAll('.eco-material-row')).map(row => ({
    id: String(row.dataset.materialId || '').trim(),
    name: String(row.dataset.materialName || '').trim(),
    share: Number(row.querySelector('.eco-share')?.value || 0) || 0,
  }));

  const payload = {
    product: validateProduct(productInput?.value),
    mass: Number(massInput?.value || 0) || 0.15,
    materials: buildMaterialShareArray(materialsArray),
    countrySpinning: el('ecoCountry') ? String(el('ecoCountry').value) : 'IT',
    business: business ? String(business.value || '').trim() : 'large-business-without-services',
    numberOfReferences: Number(quantity?.value || 0) || 1000,
    price: Number(price?.value || 0) || 10,
    upcycled: Boolean(upcycledCheckbox?.checked),
    durability: Number(el('ecoDurability')?.value || 0.67) || 0.67,
    physicalDurability: Number(el('ecoPhysicalDurability')?.value || '') || undefined,
    countryDyeing: el('ecoCountryDyeing')?.value || undefined,
    countryFabric: el('ecoCountryFabric')?.value || undefined,
    countryMaking: el('ecoCountryMaking')?.value || undefined,
    fabricProcess: el('ecoFabricProcess')?.value || undefined,
    dyingProcessType: el('ecoDyingProcessType')?.value || undefined,
    makingComplexity: el('ecoMakingComplexity')?.value || undefined,
    makingWaste: el('ecoMakingWaste')?.value !== '' ? Number(el('ecoMakingWaste').value) : undefined,
    makingDeadStock: el('ecoMakingDeadStock')?.value !== '' ? Number(el('ecoMakingDeadStock').value) : undefined,
    fading: Boolean(el('ecoFading')?.checked),
    airTransportRatio: el('ecoAirTransport')?.value !== '' ? Number(el('ecoAirTransport').value) : undefined,
    surfaceMass: el('ecoSurfaceMass')?.value !== '' ? Number(el('ecoSurfaceMass').value) : undefined,
    yarnSize: el('ecoYarnSize')?.value || undefined,
  };

  setErrorHtml('');
  setLoading('Sto calcolando...');
  const resultsSection = el('results');
  if (resultsSection) resultsSection.hidden = false;
  renderPlaceholderIndicators();

  try {
    const data = await simulateTextileImpact(payload);
    setLoading('');

    const score = data.globalWarming != null ? Number(data.globalWarming) : null;
    const scoreLabel = score != null ? Number(score).toLocaleString('it-IT') : 'N/A';
    const scoreUnit = data.globalWarmingUnit || 'kg CO₂e';
    setHtml('ecoScore', `${scoreLabel}<span class="eco-unit">${scoreUnit}</span>`);

    const blocks = [];
    const add = (label, value, unit = '') => {
      if (value == null) return;
      blocks.push(renderResultIndicator(label, value, unit));
    };
    add('Ecotossicità', data.ecotoxicity, 'CTUe');
    add('Consumo idrico', data.waterConsumption, 'm³/unit');
    add('Consumo risorse', data.resourceConsumption, 'MJ/unit');
    add('Uso del suolo', data.landUse, 'm²/unit');
    add('Acidificazione aria', data.airAcidification, 'mol H⁺/unit');
    add('Eutrofizzazione idrica', data.waterEutrophication, 'kg PO₄e');
    setHtml('ecoResultsInner', blocks.join(''));

    if (data.lifeCycle && typeof renderChainExplorer === 'function') renderChainExplorer(data.lifeCycle, data.transport);
    if (payload.materials && payload.materials.length && typeof renderMaterialExplorer === 'function') renderMaterialExplorer(payload.materials, data);

    const notes = [];
    if (payload.upcycled) notes.push('Upcycling attivo: può ridurre l’impatto puntuale riconosciuto dal modello LCA base.');
    if (!payload.materials || payload.materials.length === 0) notes.push('Nessuna quota materiale significativa indicata: verifica le percentuali.');
    if (payload.countrySpinning && payload.countrySpinning !== 'IT') notes.push('La filiera internazionale può modificare trasporto e fase di filatura.');

    if (notes.length) {
      setHtml('ecoNotes', `<ul class="eco-notes">${notes.map(n => `<li>${n}</li>`).join('')}</ul>`);
    } else {
      setHtml('ecoNotes', '');
    }
  } catch (error) {
    setLoading('');
    const message = error?.message || 'Impossibile calcolare l’impatto. Riprova più tardi.';
    setErrorHtml(message);
    setHtml('ecoNotes', '');
  }
}

function bindProductPreset() {
  const productInput = el('ecoProduct');
  const massInput = el('ecoMass');
  if (!productInput || !massInput) return;

  productInput.addEventListener('change', () => {
    const key = String(productInput.value || '').toLowerCase();
    const preset = productPreset[key];
    if (preset) {
      massInput.value = String(preset);
      massInput.setAttribute('aria-describedby', 'ecoMassHint');
    }
  });
}

function buildMaterialRows() {
  const container = el('ecoMaterialRows');
  if (!container) return;

  const defaults = buildDefaultMaterials();
  container.innerHTML = '';

  defaults.forEach(item => {
    const row = document.createElement('div');
    row.className = 'eco-material-row';
    row.dataset.materialId = item.id;
    row.dataset.materialName = item.name;
    row.innerHTML = `
      <label class="eco-material-label">${item.icon} ${item.name}</label>
      <input class="eco-share" type="number" min="0" max="100" value="${item.share}" placeholder="0" aria-label="Percentuale ${item.name}">
      <output class="eco-share-output">${item.share}%</output>
    `;
    container.appendChild(row);
  });

  container.addEventListener('input', event => {
    const input = event.target.closest('.eco-share');
    if (!input) return;
    const value = Math.max(0, Math.min(100, Number(input.value) || 0));
    const output = input.parentElement.querySelector('.eco-share-output');
    if (output) output.textContent = value + '%';
  });
}

function updateShareSummary() {
  const summary = el('ecoShareSummary');
  if (!summary) return;
  const rows = Array.from(document.querySelectorAll('.eco-material-row'));
  const total = rows.reduce((sum, row) => sum + (Number(row.querySelector('.eco-share')?.value) || 0), 0);

  const bars = rows.map(row => {
    const share = Math.max(0, Math.min(100, Number(row.querySelector('.eco-share')?.value) || 0));
    return `<div class="eco-share-bar"><span>${row.dataset.materialName || 'Materiale'}</span><div class="eco-bar"><div class="eco-bar-fill" style="width:${share}%"></div></div><span class="eco-bar-value">${share}%</span></div>`;
  }).join('');
  summary.innerHTML = `${bars}<div class="eco-share-total">Totale indicato: ${total}%</div>`;
}

function bindSummaryLoop() {
  const container = document.querySelector('.eco-material-usage');
  if (!container) return;
  container.addEventListener('input', updateShareSummary);
  updateShareSummary();
}

function initStepper() {
  const buttons = document.querySelectorAll('.eco-step-btn');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const target = el(targetId);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initReset() {
  const reset = el('ecoReset');
  if (!reset) return;
  reset.addEventListener('click', () => {
    clearResults();
    el('ecoForm')?.reset();
    buildMaterialRows();
    bindSummaryLoop();
    clampInputs();
  });
}

mountBreadcrumbs('ecoBreadcrumbs', [
  { label: 'Home', href: 'index.html' },
  { label: 'Simulatore Impatto Tessile' },
]);

bindProductPreset();
if (el('ecoSimulate')) el('ecoSimulate').addEventListener('click', runSimulation);

buildMaterialRows();
bindSummaryLoop();
initStepper();
initReset();
clampInputs();
setLoading('');
setErrorHtml('');
if (el('results')) el('results').hidden = true;
if (el('ecoMain')) el('ecoMain').classList.add('is-ready');

function renderMaterialExplorer(materials = [], data = {}) {
  const explorer = el('ecoMaterialsExplorer');
  const rows = el('ecoMaterialsExplorerRows');
  if (!explorer || !rows) return;
  explorer.style.display = 'block';
  rows.innerHTML = materials.map((item, idx) => {
    const name = item.name || item.id;
    const country = item.country || el('ecoCountry')?.value || '—';
    const impact = data.lifeCycle?.rawMaterials ? `${Number(data.lifeCycle.rawMaterials[idx]).toLocaleString('it-IT')} Pts` : '—';
    return `<div class="eco-explorer-row">
      <div class="eco-explorer-cell">${name}</div>
      <div class="eco-explorer-cell">${country}</div>
      <div class="eco-explorer-cell">${Number(item.share * 100).toLocaleString('it-IT')}%</div>
      <div class="eco-explorer-cell">${impact}</div>
    </div>`;
  }).join('');
}

function renderChainExplorer(lifeCycle = {}, transport = {}) {
  const explorer = el('ecoChainExplorer');
  const rows = el('ecoStageRows');
  if (!explorer || !rows) return;
  explorer.style.display = 'block';
  const stages = [
    { key: 'rawMaterials', label: 'Materie prime', mass: '—', distance: '—' },
    { key: 'spinning', label: 'Filatura', mass: '—', distance: transport.distanceSpinning || el('ecoCountry')?.value || '—' },
    { key: 'fabric', label: 'Tessitura/Tricottura', mass: '—', distance: transport.distanceFabric || '—' },
    { key: 'making', label: 'Confezione', mass: '—', distance: transport.distanceMaking || '—' },
    { key: 'use', label: 'Uso', mass: '—', distance: '—' },
    { key: 'endOfLife', label: 'Fine vita', mass: '—', distance: '—' },
  ];
  rows.innerHTML = stages.map(stage => {
    const score = lifeCycle[stage.key] != null ? Number(lifeCycle[stage.key]).toLocaleString('it-IT') + ' Pts' : '—';
    return `<div class="eco-chain-row">
      <div>
        <div class="eco-chain-name">${stage.label}</div>
        <div class="eco-chain-meta">Massa: ${stage.mass} · Distanza stimata: ${stage.distance}</div>
      </div>
      <div class="eco-chain-score">${score}<span>Impatto</span></div>
    </div>`;
  }).join('');;
}
