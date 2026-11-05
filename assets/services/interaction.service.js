/* Shared, composable filters. A filter never resets another active filter. */
window.FDM=window.FDM||{};
(function(){
  const states=new Map();
  function state(selector,item){
    const container=typeof selector==='string'?document.querySelector(selector):selector;
    if(!container)return null;
    if(!states.has(container)){
      const summary=document.createElement('p');summary.className='result-count';summary.setAttribute('role','status');container.before(summary);
      const empty=document.createElement('p');empty.className='filter-empty';empty.textContent='Nessun risultato. Modifica o azzera i filtri.';container.after(empty);
      states.set(container,{container,item,filters:new Map(),summary,empty});
    }
    return states.get(container);
  }
  function apply(s){
    if(!s)return;
    const items=[...s.container.querySelectorAll(s.item)];let n=0;
    items.forEach(el=>{const show=[...s.filters.values()].every(fn=>fn(el));el.hidden=!show;el.style.display=show?'':'none';if(show)n++;});
    s.summary.textContent=n+' risultati su '+items.length;s.empty.hidden=n!==0;
  }
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  function wireSearchFilter(formSelector,containerSelector,item){
    const form=document.querySelector(formSelector),s=state(containerSelector,item);if(!form||!s)return;
    const input=form.querySelector('input');if(!input)return;
    const run=()=>{const words=norm(input.value).trim().split(/\s+/).filter(Boolean);s.filters.set('search',el=>words.every(w=>norm(el.textContent).includes(w)));apply(s);};
    input.addEventListener('input',run);form.addEventListener('submit',e=>{e.preventDefault();run();});run();
  }
  function setFilter(container,item,key,predicate){const s=state(container,item);if(!s)return;s.filters.set(key,predicate);apply(s);}
  function wireChipFilter(groupSelector,containerSelector,item,attr){
    const group=document.querySelector(groupSelector),s=state(containerSelector,item);if(!group||!s)return;
    group.addEventListener('click',e=>{
      const chip=e.target.closest('.chip');if(!chip)return;
      group.querySelectorAll('.chip').forEach(c=>{c.classList.toggle('active',c===chip);c.setAttribute('aria-pressed',String(c===chip));});
      const wanted=norm(chip.dataset.value||chip.textContent).trim();
      const all=['all','tutte','tutti','all experts','all companies','all certifications'].includes(wanted);
      s.filters.set(groupSelector,node=>all||norm(node.dataset[attr]).split('|').some(v=>v===wanted));apply(s);
    });apply(s);
  }
  function wireSortSelect(selector,containerSelector,compareFns){
    const select=document.querySelector(selector),container=document.querySelector(containerSelector);if(!select||!container)return;
    const run=()=>{const fn=compareFns[select.value];if(fn)[...container.children].sort(fn).forEach(el=>container.append(el));};select.addEventListener('change',run);run();
  }
  function initVoteControls(){document.addEventListener('click',e=>{
    const b=e.target.closest('.vote-btn');if(!b||b.disabled)return;
    const c=b.closest('.vote-control');const {targetType,targetId}=c.dataset;if(!targetType||!targetId)return;
    const delta=FDM.session.castVote(targetType,targetId,b.dataset.dir),count=c.querySelector('.vote-count');count.textContent=Number(count.textContent)+delta;
    c.querySelectorAll('.vote-btn').forEach(n=>n.classList.toggle('is-active',FDM.session.getVoteState(targetType,targetId)===n.dataset.dir));
  });}
  function initChipFilters(){document.querySelectorAll('.chip:not(button)').forEach(n=>{n.setAttribute('role','button');n.tabIndex=0;n.setAttribute('aria-pressed',String(n.classList.contains('active')));});}
  function initSearchBars(){document.querySelectorAll('.search-bar').forEach(f=>f.addEventListener('submit',e=>e.preventDefault()));}
  function initReveal(){document.querySelectorAll('.reveal').forEach(n=>n.classList.add('is-visible'));}
  function initNewsletterForm(){}function initPagination(){}
  FDM.interaction={wireSearchFilter,wireChipFilter,wireChipCategoryFilter:(g,c,i)=>wireChipFilter(g,c,i,'category'),wireSortSelect,setFilter,initReveal,initChipFilters,initSearchBars,initVoteControls,initNewsletterForm,initPagination};
  initVoteControls();
})();
