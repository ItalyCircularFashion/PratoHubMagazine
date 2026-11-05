/* Shared behavior for the rebuilt archive edition. No backend or credential collection. */
(function(){
 const nav=document.getElementById('primaryNav'),toggle=document.querySelector('.menu-toggle');
 if(toggle&&nav){
  const close=()=>{nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Apri menu');};
  toggle.addEventListener('click',()=>{const open=!nav.classList.contains('is-open');nav.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Chiudi menu':'Apri menu');});
  nav.addEventListener('click',e=>{if(e.target.closest('a'))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){close();toggle.focus();}});
  nav.querySelectorAll('a').forEach(a=>{if(a.pathname===location.pathname)a.setAttribute('aria-current','page');});
 }
 FDM.interaction.initReveal();FDM.interaction.initChipFilters();FDM.interaction.initSearchBars();
 document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.chip[role=button]')){e.preventDefault();e.target.click();}});
 document.querySelectorAll('.pagination').forEach(n=>n.remove());
 document.querySelectorAll('input').forEach(n=>{if(!n.labels?.length&&!n.getAttribute('aria-label'))n.setAttribute('aria-label',n.placeholder||'Ricerca');});
 document.querySelectorAll('select:not([aria-label])').forEach(n=>n.setAttribute('aria-label','Ordina o filtra i risultati'));
 document.querySelectorAll('a[href="#"]').forEach(n=>{n.href='progetto.html#servizi';});
 document.querySelectorAll('a[target="_blank"]').forEach(n=>n.rel='noopener noreferrer');
 document.querySelectorAll('img').forEach(n=>{n.decoding='async';if(!n.closest('.hero'))n.loading='lazy';});
 if(['aziende','company'].includes(document.body.dataset.page)){
  const banner=document.querySelector('.demo-notice');if(banner){banner.className='real-data-note';banner.textContent='Aziende reali, informazioni da siti ufficiali. Le schede riportano le fonti e la data di consultazione; non sono visure camerali né attestazioni di certificazioni.';}
 }
 if(location.pathname.endsWith('/index.html')||location.pathname.endsWith('/')){
  const marker=document.getElementById('featured');if(marker){const box=document.createElement('section');box.className='distretto-callout';box.innerHTML='<span class="eyebrow">Distretto di Prato</span><h2>Le persone, i luoghi e il ciclo della lana.</h2><p>Numeri con fonti e periodi dichiarati, il ciclo del cardato, il territorio, la storia, il glossario e le aziende: la nuova sezione approfondisce il distretto oltre il magazine.</p><a class="btn btn-line" href="distretto/">Esplora il Distretto di Prato →</a>';marker.after(box);}
 }
 // Detail templates must not display another article\'s static story.
 const artId=new URLSearchParams(location.search).get('id')||'art-tariff-spreadsheet';
 if(document.getElementById('articleTitle')){
  const article=FDM.knowledgeGraph.findArticle(artId),body=document.getElementById('articleBodyContent');
  if(article&&artId!=='art-tariff-spreadsheet'&&body){body.replaceChildren();const h=document.createElement('h2');h.textContent='Scheda editoriale';const p=document.createElement('p');p.textContent=article.subtitle||'Il pacchetto originale contiene il titolo e i metadati di questo articolo, ma non un testo integrale. Questa è una scheda dimostrativa, non un reportage pubblicato.';body.append(h,p);document.getElementById('articleToc')?.replaceChildren();}
  if(article)document.title=article.title+' — PratoHub Magazine';
 }
 document.documentElement.dataset.siteReady='true';
})();
