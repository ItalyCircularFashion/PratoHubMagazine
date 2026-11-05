(function(){
  const D=FDM.data.discussions,I=FDM.interaction,c=document.getElementById('discListContainer');
  FDM.navigation.mountBreadcrumbs('discBreadcrumbs',[{label:'Home',href:'index.html'},{label:'Discussions'}]);
  document.getElementById('discStats').append(renderStatStrip([{value:D.length,label:'Discussioni dimostrative'}]));
  document.getElementById('createDiscussionCta').textContent='Pubblicazione condivisa non attiva. Puoi provare le risposte locali nelle discussioni.';
  const cats=[...new Set(D.map(d=>d.category))];
  const g=document.getElementById('discCategoryChips');g.replaceChildren(...['All',...cats].map(t=>el('<button type="button" class="chip'+(t==='All'?' active':'')+'">'+FDM.safeText(t)+'</button>')));
  document.getElementById('discTopics').replaceChildren();
  function render(){c.replaceChildren(...D.map(d=>{
    const n=renderDiscussionRow(d,FDM.knowledgeGraph.findUser(d.authorId));n.dataset.id=d.id;return n;
  }));}
  render();I.wireSearchFilter('#discSearch','#discListContainer','.disc-row');I.wireChipFilter('#discCategoryChips','#discListContainer','.disc-row','category');
  I.wireSortSelect('#discSort','#discListContainer',{votes:(a,b)=>b.dataset.votes-a.dataset.votes,replies:(a,b)=>b.dataset.replies-a.dataset.replies,updated:(a,b)=>b.dataset.updated-a.dataset.updated,newest:(a,b)=>b.dataset.created-a.dataset.created});
  const views=document.getElementById('discViewChips');views?.addEventListener('click',e=>{
    const b=e.target.closest('.chip');if(!b)return;const mode=b.textContent.trim().toLowerCase();
    views.querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===b));
    I.setFilter('#discListContainer','.disc-row','mode',n=>mode==='trending'?Number(n.dataset.votes)>=150:mode==='following'?FDM.session.isFollowing('discussion',n.dataset.id):mode==='solved'?n.textContent.includes('Solved'):true);
  });
})();
