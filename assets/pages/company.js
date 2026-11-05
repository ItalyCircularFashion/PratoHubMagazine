/* ============================================================
import { mount as mountGallery } from '../components/gallery.component.js';
import { findArticle, findDiscussion, findQuestion, findEvent, findPoll, findCompany, findUser, getRelatedForCompany, getRelatedForArticle as getRelatedForArticle_kg, getRelatedForDiscussion, getRelatedForQuestion, findExpert, findCommodity } from '../services/knowledge-graph.service.js';
import { mountBreadcrumbs, navigateTo, navigateBack } from '../services/navigation.service.js';
import { companies } from '../data/companies.data.js';
   COMPANY.JS — page-specific composition for company.html.
   Reads ?id= from the URL, falls back to the first company.
   Pure orchestration — no rendering or business logic lives here.
   ============================================================ */

const urlId = new URLSearchParams(window.location.search).get('id');
const company = findCompany(urlId) || companies[0]; if(!findCompany(urlId)){ console.warn('[company] fallback a primo record demo'); }

if(!company){
  document.getElementById('coHero').appendChild(renderErrorState('Company not found.'));
} else {
  renderCompanyPage(company);
}

function show(id){ const el = document.getElementById(id); if(el) el.style.display = ''; }
function set(id, html){ const el = document.getElementById(id); if(el) el.innerHTML = html; }
function append(id, node){ const el = document.getElementById(id); if(el) el.appendChild(node); }
function mktEl(tagName, cls, html){ const n = document.createElement(tagName); if(cls) n.className = cls; if(html) n.innerHTML = html; return n; }

function renderCompanyPage(co){

  // ── Page title ──
  document.title = co.name + ' — Forum della Moda';

  // ── Breadcrumbs ──
  mountBreadcrumbs('coBreadcrumbs', [
    { label:'Home', href:'index.html' },
    { label:'Market', href:'market.html' },
    { label:'Companies', href:'market.html#directory' },
    { label:co.name },
  ]);

  // ── Hero ──
  document.getElementById('coLogo').innerHTML =
    `<img src="${co.logoUrl}" alt="${co.name}">`;

  set('coSpecBadge', `<span class="eyebrow" style="display:inline-flex;">${co.specialization}</span> <span class="company-badge ${co.datasetType==='REAL'?'is-real':'is-demo'}">${co.datasetType==='REAL'?'REAL':'DEMO'}</span>${co.datasetType!=='REAL'?' <span class="small" style="font-size:12px">Dati dimostrativi — non azienda reale</span>':''}`);
  set('coName', co.name);
  set('coMeta', [
    co.city && co.district && co.district !== co.city
      ? `&#x1F4CD; ${co.city}, ${co.district}`
      : co.city ? `&#x1F4CD; ${co.city}` : '',
    co.foundedYear ? `Est. ${co.foundedYear}` : '',
    co.employeeRange ? `${co.employeeRange} employees` : '',
    co.legalForm || '',
  ].filter(Boolean).map(s => `<span>${s}</span>`).join('<span class="dot"></span>'));

  set('coDesc', co.description);

  // ── Hero CTAs ──
  const actionsEl = document.getElementById('coActions');
  if(co.website && co.website !== '#'){
    const wb = document.createElement('a');
    wb.href = co.website; wb.target = '_blank'; wb.rel = 'noopener noreferrer';
    wb.className = 'btn btn-primary'; wb.textContent = 'Visit Website \u2197';
    actionsEl.appendChild(wb);
  }
  if(co.vatNumber || co.name) actionsEl.appendChild(renderVerifyCompanyLink(co));

  // ── Stats ──
  document.getElementById('coStats').appendChild(renderStatStrip([
    co.foundedYear ? { value: 2026 - co.foundedYear, label:'Years Active' } : null,
    co.certifications.length  ? { value: co.certifications.length,  label:'Certifications' } : null,
    co.exportMarkets.length   ? { value: co.exportMarkets.length,   label:'Export Markets' } : null,
    co.technologies.length    ? { value: co.technologies.length,    label:'Technologies' } : null,
  ].filter(Boolean)));

  // ── About / history ──
  if(co.history){
    const sec = document.getElementById('coAbout');
    sec.innerHTML = `<div class="co-section-title">About</div><div class="article-body" style="font-size:15.5px; line-height:1.8; color:var(--charcoal); max-width:680px;">${co.history}</div>`;
    show('coAbout');
  }

  // ── Timeline ──
  if(co.timeline && co.timeline.length){
    append('coTimelineContent', renderTimeline(co.timeline));
    show('coTimeline');
  }

  // ── Product sectors ──
  if(co.productSectors && co.productSectors.length){
    const sec = document.getElementById('coProducts');
    sec.innerHTML = `<div class="co-section-title">Product Sectors</div><div class="co-tag-list">${co.productSectors.map(p=>`<span class="tag" style="font-size:12.5px; padding:6px 14px;">${p}</span>`).join('')}</div>`;
    show('coProducts');
  }

  // ── Technologies ──
  if(co.technologies && co.technologies.length){
    const sec = document.getElementById('coTechnologies');
    sec.innerHTML = `<div class="co-section-title">Technologies</div><div class="co-tag-list">${co.technologies.map(t=>`<span class="tag" style="font-size:12.5px; padding:6px 14px;">${t}</span>`).join('')}</div>`;
    show('coTechnologies');
  }

  // ── Certifications ──
  if(co.certifications && co.certifications.length){
    const sec = document.getElementById('coCertifications');
    sec.innerHTML = `<div class="co-section-title">Certifications</div><div class="co-cert-list">${co.certifications.map(c=>`<span class="co-cert">${c}</span>`).join('')}</div>`;
    show('coCertifications');
  }

  // ── Export markets ──
  if(co.exportMarkets && co.exportMarkets.length){
    const sec = document.getElementById('coExport');
    sec.innerHTML = `<div class="co-section-title">Export Markets</div><div class="co-export-grid">${co.exportMarkets.map(m=>`<span class="co-export-badge">&#x1F30D; ${m}</span>`).join('')}</div>`;
    show('coExport');
  }

  // ── Sustainability ──
  if(co.sustainabilityHighlights && co.sustainabilityHighlights.length){
    const sec = document.getElementById('coSustainability');
    sec.innerHTML = `<div class="co-section-title">Sustainability</div><div class="co-sustainability-list">${co.sustainabilityHighlights.map(h=>`<div class="co-sustainability-item">${h}</div>`).join('')}</div>`;
    show('coSustainability');
  }

  // ── Gallery (lazy, reuses galleryComponent) ──
  if(co.galleryImages && co.galleryImages.length){
    show('coGallery');
    document.getElementById('coGallery').insertAdjacentHTML('beforeend', '<div class="co-section-title" style="margin-bottom:14px;">Gallery</div>');
    document.getElementById('coGallery').insertAdjacentHTML('beforeend', '<div id="coGalleryInner" class="article-gallery"></div>');
    mountGallery('coGalleryInner', co.galleryImages);
  }

  // ── Reading progress against main column ──
  const progressEl = document.getElementById('readingProgress');
  const mainCol = document.getElementById('coMainContent');
  if(progressEl && mainCol){
    const updateProgress = () => {
      const rect = mainCol.getBoundingClientRect();
      const total = mainCol.offsetHeight - window.innerHeight;
      const pct = total > 0 ? Math.round(Math.min(Math.max(-rect.top, 0), total) / total * 100) : 0;
      progressEl.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, {passive:true});
    updateProgress();
  }

  // ── Knowledge Graph: sidebar ──
  const related = getRelatedForCompany(co);

  append('coVerify', renderVerifyCompanyLink(co));
  if(co.vatNumber)
    document.getElementById('coVerify').insertAdjacentHTML('afterbegin',
      `<div style="font-size:12px; color:var(--stone); margin-bottom:10px;">VAT: ${co.vatNumber} &nbsp;&#x7C;&nbsp; REA: ${co.rea||'N/A'}</div>`);

  // verifica separata (identità / informazioni / pubblicazione)
  const verEl=document.getElementById('coVerify'); if(verEl && co.verification){ const v=co.verification; verEl.insertAdjacentHTML('beforeend', `<div style="font-size:12px;color:var(--stone);margin-top:8px">Identità: ${v.identity||''} · Info: ${v.information||''} · Pubblicazione: ${v.publishEligibility||''} (allowed:${co.publish?.allowed===true})</div>`);} 
  mountKgPanel('coExperts', '', related.experts, renderUserCard, 'No experts linked to this company yet.');
  mountKgPanel('coDiscussions', '', related.discussions, renderKgDiscussionItem, 'No linked discussions yet.');
  mountKgPanel('coQuestions', '', related.questions, renderKgQuestionItem, 'No linked questions yet.');
  mountKgPanel('coEvents', '', related.events,
    ev => renderEventCard(adaptEventForCard(ev)), 'No upcoming events linked to this company.');

  // ── Related articles (full-width grid) ──
  if(related.articles.length){
    document.getElementById('coArticles').append(...related.articles.map(renderArticleAsNewsCard));
  } else {
    document.getElementById('coArticles').appendChild(
      renderEmptyState('No editorial coverage yet for this company.'));
  }
}