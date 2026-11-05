/* Magazine composition from the supplied central datasets, not duplicated cards. */
(function(){
  const D=FDM.data;
  const mount=(id,nodes)=>{const target=document.getElementById(id);if(target)target.replaceChildren(...nodes);};
  mount('agendaRail',D.articles.slice(0,6).map(a=>{
    const n=renderArticleAsNewsCard(a);n.classList.add('agenda-card');n.dataset.category=a.category;return n;
  }));
  mount('newsGrid',D.articles.slice(0,5).map(renderArticleAsNewsCard));
  mount('discList',D.discussions.slice(0,5).map(d=>renderDiscussionRow(d,FDM.knowledgeGraph.findUser(d.authorId))));
  mount('qGrid',D.questions.slice(0,4).map(q=>adaptQuestionForCard(q,FDM.knowledgeGraph.findUser(q.expertId))));
  mount('eventsRail',D.events.slice(0,4).map(e=>renderEventCard(adaptEventForCard(e))));
  mount('picksStrip',D.articles.slice(5,9).map(renderArticleAsNewsCard));
  FDM.market.mountMarketGrid('marketGrid');
  const group=document.querySelector('#agenda .chips');
  if(group){group.replaceChildren(...['All',...new Set(D.articles.slice(0,6).map(a=>a.category))].map(t=>{const b=document.createElement('button');b.type='button';b.className='chip'+(t==='All'?' active':'');b.textContent=t;return b;}));
    FDM.interaction.wireChipFilter('#agenda .chips','#agendaRail','.agenda-card','category');}
  const f=D.articles[0],body=document.querySelector('.featured-body');
  if(f&&body){body.querySelector('h3').innerHTML='<a href="article.html?id='+encodeURIComponent(f.id)+'">'+FDM.safeText(f.title)+'</a>';body.querySelector('p').textContent=f.subtitle||'Articolo dimostrativo dal materiale del magazine.';}
  document.querySelectorAll('.continue-cell .lnk').forEach((p,i)=>{const a=document.createElement('a');a.href=['discussions.html','community.html','questions.html'][i];a.textContent=p.textContent;p.replaceWith(a);});
})();
