(function(){
  const D=FDM.data,I=FDM.interaction;
  FDM.navigation.mountBreadcrumbs('commBreadcrumbs',[{label:'Home',href:'index.html'},{label:'Community'}]);
  document.getElementById('commStats').append(renderStatStrip([{value:D.experts.length,label:'Profili dimostrativi'},{value:D.discussions.length,label:'Discussioni di esempio'}]));
  document.getElementById('joinCta').textContent='Profili e reputazioni di esempio. Nessun account personale e nessuna iscrizione.';
  const tags=[...new Set(D.experts.flatMap(e=>e.expertise))].sort();
  document.getElementById('expertAreaChips').replaceChildren(...['All',...tags].map(t=>el('<button type="button" class="chip'+(t==='All'?' active':'')+'">'+FDM.safeText(t)+'</button>')));
  document.getElementById('expertGrid').replaceChildren(...D.experts.map(u=>{const n=renderUserCard(u);n.dataset.expertise=u.expertise.join('|');return n;}));
  I.wireSearchFilter('#expertSearch','#expertGrid','.user-card');I.wireChipFilter('#expertAreaChips','#expertGrid','.user-card','expertise');
  document.getElementById('commDiscussions').append(...D.discussions.slice(0,5).map(d=>renderDiscussionRow(d,FDM.knowledgeGraph.findUser(d.authorId))));
  document.getElementById('commQuestions').append(...D.questions.slice(0,4).map(q=>adaptQuestionForCard(q,FDM.knowledgeGraph.findUser(q.expertId))));
  document.getElementById('leaderboardList').append(...[...D.experts,...D.staff].sort((a,b)=>b.reputation-a.reputation).map((u,i)=>renderLeaderboardRow(u,i+1)));
})();
