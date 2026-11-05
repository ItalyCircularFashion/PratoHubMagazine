(function(){
 const params=new URLSearchParams(location.search),id=params.get('id');
 const co=id?FDM.data.companies.find(c=>c.id===id):FDM.data.companies[0];
 const set=(id,text)=>{const n=document.getElementById(id);if(n)n.textContent=text;};
 if(!co){set('coName','Azienda non trovata');set('coDesc','Il collegamento non corrisponde a una scheda pubblicata. Torna alla directory.');return;}
 document.title=co.name+' — PratoHub Magazine';
 FDM.navigation.mountBreadcrumbs('coBreadcrumbs',[{label:'Home',href:'index.html'},{label:'Aziende',href:'aziende.html'},{label:co.name}]);
 set('coName',co.name);set('coSpecBadge',co.specialization);set('coMeta',co.city||'Comune non riportato nella fonte consultata');set('coDesc',co.description);
 const mark=document.createElement('span');mark.className='company-initial';mark.setAttribute('aria-hidden','true');mark.textContent=co.name.split(/\s+/).slice(0,2).map(x=>x[0]).join('');document.getElementById('coLogo').replaceChildren(mark);
 const actions=document.getElementById('coActions'),a=document.createElement('a');a.href=co.website;a.target='_blank';a.rel='noopener noreferrer';a.className='btn btn-primary';a.textContent='Sito ufficiale ↗';actions.replaceChildren(a);
 document.getElementById('coStats').replaceChildren();
 ['coAbout','coTimeline','coProducts','coTechnologies','coCertifications','coExport','coSustainability','coGallery'].forEach(id=>{const n=document.getElementById(id);if(n)n.hidden=true;});
 const main=document.getElementById('coMainContent'),note=document.createElement('section');note.className='real-data-note';
 const h=document.createElement('h2');h.textContent='Informazioni e fonti';note.append(h);
 const text=document.createElement('p');text.textContent='Scheda compilata da pagine pubbliche del sito ufficiale, consultate il '+co.checkedAt+'. La consultazione documenta le informazioni riportate: non equivale a visura camerale, audit o verifica di certificazioni.';note.append(text);
 const ul=document.createElement('ul');ul.className='sources-list';
 co.sources.forEach(s=>{const li=document.createElement('li'),link=document.createElement('a');link.href=s.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=s.label;li.append(link);ul.append(li);});note.append(ul);
 const absent=document.createElement('p');absent.textContent='Fatturato, addetti, capacità produttive, P.IVA e certificazioni non sono pubblicati in questa scheda: non sono stati aggiunti valori presunti.';note.append(absent);main.prepend(note);
 ['coVerify','coExperts','coDiscussions','coQuestions','coEvents'].forEach(id=>{const n=document.getElementById(id);if(n)n.textContent='Nessuna associazione documentata.';});
 const related=document.getElementById('coArticles');if(related)related.textContent='Nessuna copertura editoriale attribuita automaticamente a questa azienda.';
})();
