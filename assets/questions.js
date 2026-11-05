(function(){
  const D=FDM.data.questions,I=FDM.interaction;
  FDM.navigation.mountBreadcrumbs('qBreadcrumbs',[{label:'Home',href:'index.html'},{label:'Questions'}]);
  document.getElementById('qStats').append(renderStatStrip([{value:D.length,label:'Domande dimostrative'},{value:D.filter(q=>q.accepted).length,label:'Con risposta accettata'}]));
  document.getElementById('askQuestionCta').textContent='Le risposte sono una dimostrazione locale, non vengono pubblicate.';
  document.getElementById('qTopics').replaceChildren();
  function chips(id,values){document.getElementById(id).replaceChildren(...['All',...values].map(t=>el('<button type="button" class="chip'+(t==='All'?' active':'')+'">'+FDM.safeText(t)+'</button>')));}
  chips('qCategoryChips',[...new Set(D.map(q=>q.category))]);
  chips('qExpertChips',[...new Set(D.map(q=>FDM.knowledgeGraph.findUser(q.expertId)?.nickname).filter(Boolean))]);
  document.getElementById('qGridContainer').replaceChildren(...D.map(q=>adaptQuestionForCard(q,FDM.knowledgeGraph.findUser(q.expertId))));
  I.wireSearchFilter('#qSearch','#qGridContainer','.q-card');
  ['Category','Difficulty','Expert'].forEach(t=>I.wireChipFilter('#q'+t+'Chips','#qGridContainer','.q-card',t.toLowerCase()));
  I.wireSortSelect('#qSort','#qGridContainer',{votes:(a,b)=>b.dataset.votes-a.dataset.votes,answers:(a,b)=>b.dataset.answers-a.dataset.answers,newest:(a,b)=>b.dataset.created-a.dataset.created});
  const group=document.getElementById('qStatusChips');group?.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;const mode=b.textContent.trim().toLowerCase();group.querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===b));I.setFilter('#qGridContainer','.q-card','status',n=>mode==='all'||(mode==='accepted'?!!n.querySelector('.accepted'):!n.querySelector('.accepted')));});
})();
