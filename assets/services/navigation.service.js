/* ============================================================
   NAVIGATION SERVICE
   assets/services/navigation.service.js
   ============================================================ */
window.FDM = window.FDM || {};

function initHeaderScroll(){
  const header = document.getElementById('siteHeader');
  if(!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}
function initFolioRail(){
  const folioLabels = document.querySelectorAll('.folio-label');
  if(!folioLabels.length) return;
  const sections = [...folioLabels].map(l => document.getElementById(l.dataset.for)).filter(Boolean);
  const folioIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const label = document.querySelector(`.folio-label[data-for="${entry.target.id}"]`);
      if(label) label.classList.toggle('is-active', entry.isIntersecting);
    });
  }, {threshold:.5});
  sections.forEach(s => folioIO.observe(s));
}
/** Renders a breadcrumb trail. `trail` = [{label, href}, ...], last item has no href. */
function renderBreadcrumbs(trail){
  return trail.map((step, i) => {
    const isLast = i === trail.length - 1;
    const sep = i > 0 ? '<span class="sep">/</span>' : '';
    if(isLast) return `${sep}<span class="current">${step.label}</span>`;
    return `${sep}<a href="${step.href}">${step.label}</a>`;
  }).join('');
}
function mountBreadcrumbs(targetId, trail){
  const el = document.getElementById(targetId);
  if(el) el.innerHTML = renderBreadcrumbs(trail);
}

FDM.navigation = { initHeaderScroll, initFolioRail, renderBreadcrumbs, mountBreadcrumbs };

initHeaderScroll();
initFolioRail();
