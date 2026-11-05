/* ============================================================
   MARKET.JS — page-specific composition for market.html.
   ============================================================ */
import { initReveal, initChipFilters, initNewsletterForm, initPagination, initSearchBars, wireSearchFilter, wireSortSelect, wireChipFilter, wireChipCategoryFilter, initVoteControls } from '../services/interaction.service.js';
import { mountMarketGrid, commodities } from '../services/market.service.js';
import { mountBreadcrumbs } from '../services/navigation.service.js';
import { companies } from '../data/companies.data.js';

const companiesList = companies || [];

mountBreadcrumbs('mktBreadcrumbs', [
  { label:'Home', href:'index.html' },
  { label:'Market' },
]);

// ---- Stats ----
const certSet = new Set(companies.flatMap(c => c.certifications));
const specSet = new Set(companies.map(c => c.specialization));
document.getElementById('mktStats').appendChild(renderStatStrip([
  { value:companies.length,       label:'Companies Listed' },
  { value:specSet.size,           label:'Specializations' },
  { value:certSet.size,           label:'Certifications' },
  { value:commodities.length, label:'Market Indicators' },
]));

// ---- Company grid ----
document.getElementById('coGrid').append(...companies.map(renderCompanyCard));

// ---- Search: matches name, city, specialization, certifications, technologies ----
wireSearchFilter('#coSearch', '#coGrid', '.company-card');

// ---- Specialization chip filter (data-specialization attribute) ----
// "All" chip needs text "all" — but the chips say "Spinning", "Weaving", etc.
// wireChipFilter compares chip text against data-specialization; "All" matches because chipText === 'all' branch.
wireChipFilter('#coSpecChips', '#coGrid', '.company-card', 'specialization');

// ---- Certification chip filter (data-certifications attribute contains the cert) ----
document.querySelectorAll('#coCertChips .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const wanted = chip.textContent.trim().toLowerCase();
    document.querySelectorAll('#coGrid .company-card').forEach(card => {
      const certs = card.dataset.certifications || '';
      card.style.display = (wanted === 'all certifications' || certs.includes(wanted)) ? '' : 'none';
    });
  });
});

// Seed official certification options derived from Textile Exchange, bluesign, ZDHC and ISO listings.
(function buildCertificationChips(){
  const seed = [
    ['GOTS','Textile Exchange / GOTS'],
    ['GRS','Textile Exchange / GRS'],
    ['RCS','Textile Exchange / RCS'],
    ['ZDHC','ZDHC Roadmap to Zero'],
    ['Bluesign','bluesign SYSTEM PARTNER'],
    ['ISO 9001','ISO 9001'],
    ['ISO 14001','ISO 14001'],
    ['Oeko-Tex 100','Oeko-Tex 100'],
    ['OEKO-TEX','OEKO-TEX Standard 100'],
    ['amfori BSCI','amfori BSCI'],
    ['EN 11612 FR','EN 11612 FR'],
    ['ISO 27001','ISO 27001'],
    ['Accredia LAB 1427','Accredia LAB 1427'],
    ['ISO/IEC 17025','ISO/IEC 17025'],
  ];
  const container = document.getElementById('coCertChips');
  if(!container) return;
  const frag = document.createDocumentFragment();
  frag.appendChild(Object.assign(document.createElement('div'), {className:'chip active', textContent:'All Certifications'}));
  seed.forEach(([label]) => {
    frag.appendChild(Object.assign(document.createElement('div'), {className:'chip', textContent:label}));
  });
  container.appendChild(frag);
})();

// ---- Sort ----
// Employee range encodes as first number for numeric sort.
function empNum(str){ return parseInt((str||'0').replace(/[^0-9]/,'')) || 0; }
wireSortSelect('#coSort', '#coGrid', {
  name:      (a,b) => (a.dataset.title||'').localeCompare(b.dataset.title||''),
  founded:   (a,b) => Number(a.dataset.founded||0) - Number(b.dataset.founded||0),
  employees: (a,b) => Number(b.dataset.employees||0) - Number(a.dataset.employees||0),
});
// founded/employees need those data attributes — add them via a post-render pass
document.querySelectorAll('#coGrid .company-card').forEach(card => {
  const company = companies.find(c => card.href && card.href.includes(c.id));
  if(company){
    card.dataset.founded   = company.foundedYear  || 9999;
    card.dataset.employees = empNum(company.employeeRange);
  }
});

// ---- Market grid (existing commodity engine) ----
mountMarketGrid('marketGrid');

document.getElementById('mktMeta').innerHTML =
  `<span>Updated 2 min ago</span><span class="dot"></span><span>Sample data — live feed ready</span>`;