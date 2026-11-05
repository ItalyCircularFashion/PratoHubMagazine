(function(){
 const D=FDM.data.events,I=FDM.interaction,months={JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11};
 FDM.navigation.mountBreadcrumbs('evBreadcrumbs',[{label:'Home',href:'index.html'},{label:'Events'}]);
 const counts=document.getElementById('evStats');counts?.append(renderStatStrip([{value:D.length,label:'Eventi dimostrativi'}]));
 const group=document.getElementById('evTypeChips');if(group)group.replaceChildren(...['All',...new Set(D.map(e=>e.type))].map(t=>el('<button type="button" class="chip'+(t==='All'?' active':'')+'">'+FDM.safeText(t)+'</button>')));
 document.getElementById('evGrid').replaceChildren(...D.map(e=>{const n=renderEventCardFull(e);n.dataset.date=Date.UTC(2026,months[e.month]??0,Number(e.day));return n;}));
 I.wireSearchFilter('#evSearch','#evGrid','.event-card-full');I.wireChipFilter('#evTypeChips','#evGrid','.event-card-full','type');
 I.wireSortSelect('#evSort','#evGrid',{date:(a,b)=>a.dataset.date-b.dataset.date,alpha:(a,b)=>a.dataset.title.localeCompare(b.dataset.title)});
})();
