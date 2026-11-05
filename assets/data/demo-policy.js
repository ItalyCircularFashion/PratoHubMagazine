/* Editorial fixtures are isolated from the documented real-company directory. */
(function(){
  const D=window.FDM.data;
  [...(D.staff||[]),...(D.experts||[])].forEach(u=>{u.nickname='demo.'+u.nickname;u.email='';u.company='';u.companyId=null;});
  (D.events||[]).forEach(e=>{e.registration='';e.isDemo=true;});
  (D.articles||[]).forEach(a=>{a.updatedAt=a.publishedAt||'2026-06-26T00:00:00Z';a.citations=[];a.relatedCompanyIds=[];});
  ['discussions','questions','events'].forEach(key=>(D[key]||[]).forEach(x=>{x.relatedCompanyIds=[];}));
})();
