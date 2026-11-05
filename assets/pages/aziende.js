/* AZIENDE.JS — directory B2B PUBLIC (DEMO synthetic only, REAL allowlist vuota) */
import { renderCompanyCard } from '../components/company-card.component.js';
import { TX_MACROAREE, B2B_SECTORS } from '../data/taxonomy.tx.js';
import { companiesSynthetic, companiesRealAllowlist } from '../data/companies.synthetic.js';
import { mountBreadcrumbs } from '../services/navigation.service.js';
import { companies as legacyDemo } from '../data/companies.data.js';

const params = new URLSearchParams(window.location.search);
const q = (params.get('q')||'').trim();
const tx = params.get('tx')||'';
const sector = params.get('sector')||'';
const sort = params.get('sort')||'name';
const set = params.get('set')||'synthetic'; // synthetic | legacy-dem | real

mountBreadcrumbs('azBreadcrumbs', [{label:'Home',href:'index.html'},{label:'Directory'}]);

const statsEl = document.getElementById('azStats');
if(statsEl){
  statsEl.innerHTML = `<span><strong>${companiesSynthetic.length}</strong> DEMO synthetic</span><span class="dot"></span><span><strong>${legacyDemo.length}</strong> DEMO legacy (archivio)</span><span class="dot"></span><span><strong>${companiesRealAllowlist.length}</strong> REAL pubblicabili</span>`;
}

function applyFilters(list){
  let out = [...list];
  if(q){
    const needle = q.toLowerCase();
    out = out.filter(c => `${c.name} ${c.city} ${c.specialization} ${(c.certifications||[]).join(' ')} ${(c.productSectors||[]).join(' ')}`.toLowerCase().includes(needle));
  }
  if(tx){
    out = out.filter(c => (c.texCodes||[]).some(t => t.code.startsWith(tx)));
  }
  if(sector){
    out = out.filter(c => (c.sectorsB2B||[]).includes(sector));
  }
  if(sort==='name') out.sort((a,b)=>(a.name||'').localeCompare(b.name||''));
  if(sort==='city') out.sort((a,b)=>(a.city||'').localeCompare(b.city||''));
  return out;
}

function render(list){
  const grid = document.getElementById('azGrid');
  grid.innerHTML='';
  const filtered = applyFilters(list);
  if(!filtered.length){
    grid.innerHTML = '<p class="empty">Nessuna azienda corrisponde ai filtri. <button type="button" id="azClear">Azzera filtri</button></p>';
    document.getElementById('azClear')?.addEventListener('click', ()=>{ location.href='aziende.html'; });
    return;
  }
  filtered.forEach(c=> grid.appendChild(renderCompanyCard(c)));
}

// TX chips
const txWrap = document.getElementById('azTxChips');
if(txWrap){
  const all = document.createElement('a'); all.className='chip'+(tx===''?' active':''); all.href=`aziende.html?q=${encodeURIComponent(q)}&sector=${encodeURIComponent(sector)}&sort=${encodeURIComponent(sort)}&set=${encodeURIComponent(set)}`; all.textContent='Tutte';
  txWrap.appendChild(all);
  TX_MACROAREE.forEach(m=>{
    const a=document.createElement('a'); a.className='chip'+(tx===m.code?' active':'');
    a.href=`aziende.html?q=${encodeURIComponent(q)}&tx=${encodeURIComponent(m.code)}&sector=${encodeURIComponent(sector)}&sort=${encodeURIComponent(sort)}&set=${encodeURIComponent(set)}`;
    a.textContent=`${m.code} ${m.label}`;
    txWrap.appendChild(a);
  });
}
// Sector chips
const secWrap=document.getElementById('azSectorChips');
if(secWrap){
  const all=document.createElement('a'); all.className='chip'+(sector===''?' active':''); all.href=`aziende.html?q=${encodeURIComponent(q)}&tx=${encodeURIComponent(tx)}&sort=${encodeURIComponent(sort)}&set=${encodeURIComponent(set)}`; all.textContent='Tutti i settori';
  secWrap.appendChild(all);
  B2B_SECTORS.forEach(s=>{
    const a=document.createElement('a'); a.className='chip'+(sector===s?' active':'');
    a.href=`aziende.html?q=${encodeURIComponent(q)}&tx=${encodeURIComponent(tx)}&sector=${encodeURIComponent(s)}&sort=${encodeURIComponent(sort)}&set=${encodeURIComponent(set)}`;
    a.textContent=s; secWrap.appendChild(a);
  });
  const searchEl=document.getElementById('azSearch');
  if(searchEl){ searchEl.value=q; }
}

const data = set==='legacy-demo' ? legacyDemo.map(c=>({...c, datasetType:'DEMO', verification:{identity:'DEMO', information:'DEMO', publishEligibility:'DEMO_FORBIDDEN'}, publish:{allowed:false, reason:'Legacy DEMO archivio.'}})) : (set==='real' ? companiesRealAllowlist : companiesSynthetic);
render(data);

// search form (GET)
const form=document.getElementById('azSearchForm');
if(form){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const val=document.getElementById('azSearch').value.trim();
    location.href=`aziende.html?q=${encodeURIComponent(val)}&tx=${encodeURIComponent(tx)}&sector=${encodeURIComponent(sector)}&sort=${encodeURIComponent(sort)}&set=${encodeURIComponent(set)}`;
  });
}
