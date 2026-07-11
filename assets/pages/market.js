/* ============================================================
import { initReveal, initChipFilters, initNewsletterForm, initPagination, initSearchBars, wireSearchFilter, wireSortSelect, wireChipFilter, wireChipCategoryFilter, initVoteControls } from '../services/interaction.service.js';
import { mountMarketGrid, commodities } from '../services/market.service.js';
import { mountBreadcrumbs, navigateTo, navigateBack } from '../services/navigation.service.js';
import { companies } from '../data/companies.data.js';
   MARKET.JS — page-specific composition for market.html.
   ============================================================ */

const companies = companies || [];

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