(function(){
 const D=FDM.data.companies,I=FDM.interaction;
 FDM.navigation.mountBreadcrumbs('mktBreadcrumbs',[{label:'Home',href:'index.html'},{label:document.body.dataset.page==='aziende'?'Aziende':'Market'}]);
 const grid=document.getElementById('coGrid');
 if(grid){
  grid.replaceChildren(...D.map(renderCompanyCard));
  const group=document.getElementById('coSpecChips');if(group)group.replaceChildren(...['All',...new Set(D.map(c=>c.specialization))].map(t=>el('<button type="button" class="chip'+(t==='All'?' active':'')+'">'+FDM.safeText(t)+'</button>')));
  const cert=document.getElementById('coCertChips');if(cert)cert.closest('.filter-group')?.remove();
  I.wireSearchFilter('#coSearch','#coGrid','.company-card');I.wireChipFilter('#coSpecChips','#coGrid','.company-card','specialization');
  I.wireSortSelect('#coSort','#coGrid',{name:(a,b)=>a.dataset.title.localeCompare(b.dataset.title,'it'),alpha:(a,b)=>a.dataset.title.localeCompare(b.dataset.title,'it'),city:(a,b)=>a.dataset.city.localeCompare(b.dataset.city,'it')});
 }
 const stats=document.getElementById('mktStats');if(stats)stats.replaceChildren(renderStatStrip([{value:D.length,label:'Aziende con fonti ufficiali'},{value:FDM.market.commodities.length,label:'Indicatori dimostrativi'}]));
 FDM.market.mountMarketGrid('marketGrid');
 const meta=document.getElementById('mktMeta');if(meta)meta.textContent='Dati e serie sintetiche del pacchetto originale · nessun aggiornamento live';
 const summary=document.getElementById('mktSummary');if(summary)summary.textContent='Questa sezione dimostra la visualizzazione degli indicatori. Numeri, variazioni e grafici non sono quotazioni di mercato e non vanno usati per decisioni commerciali.';
})();
