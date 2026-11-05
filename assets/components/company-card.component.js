/* Company card — costruttore puro, escaping via textContent (niente innerHTML da user-data) */
function esc(s){ return String(s??'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
export function renderCompanyCard(co){
  const link = document.createElement('a');
  link.href = `company.html?id=${encodeURIComponent(co.id)}&set=${encodeURIComponent(co.datasetType||'DEMO')}`;
  link.className = 'company-card';
  link.dataset.title = co.name||'';
  link.dataset.id = co.id||'';
  link.dataset.type = co.datasetType||'DEMO';
  const txs = (co.texCodes||[]).map(t=>t.code).join(',');
  link.dataset.tex = txs;
  link.dataset.sectors = (co.sectorsB2B||[]).join(',');
  link.dataset.search = `${co.name||''} ${co.city||''} ${co.specialization||''} ${(co.certifications||[]).join(' ')} ${(co.productSectors||[]).join(' ')}`.toLowerCase();
  // badge datasetType
  const badge = document.createElement('span');
  badge.className = 'company-badge ' + ((co.datasetType==='REAL') ? 'is-real' : 'is-demo');
  badge.textContent = (co.datasetType==='REAL') ? 'REAL' : 'DEMO';
  // body children
  const body = document.createElement('div');
  body.className='company-card-body';
  const name = document.createElement('div'); name.className='company-card-name'; name.textContent = co.name||'';
  const loc = document.createElement('div'); loc.className='company-card-location'; loc.textContent = co.city ? `📍 ${co.city}${co.district? ', '+co.district:''}` : '';
  const desc = document.createElement('p'); desc.className='company-card-desc'; desc.textContent = co.description||'';
  const meta = document.createElement('div'); meta.className='company-card-meta';
  const txSpan = document.createElement('span'); txSpan.textContent = (co.texCodes&&co.texCodes[0]) ? `${co.texCodes[0].code} · ${co.texCodes[0].label}` : (co.specialization||'');
  if(txSpan.textContent) meta.appendChild(txSpan);
  body.append(badge, name, loc, desc, meta);
  link.appendChild(body);
  return link;
}
