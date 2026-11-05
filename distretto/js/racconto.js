/**
 * racconto.js
 * Apertura narrativa a scorrimento: sei frasi che compaiono mentre si scende, con un filo che si disegna.
 *
 * Dati: window.PH (vedi data.js). Nessuna dipendenza esterna.
 */
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$, cite = PH.cite, fmt = PH.fmt, rm = PH.rm, root = PH.root;

  PH.initRacconto = function () {
    $('#beats').innerHTML=D.racconto.map(function(x) {
      return '<li><small>'+PH.esc(x.k)+'</small><p>'+PH.esc(x.t)+'</p>'+(x.s?'<cite>'+cite(x.s)+'</cite>':'')+'</li>'
    }).join('');
    var st=document.querySelector('.story'),N=D.racconto.length,mq=matchMedia('(min-width: 768px)');
    if(!rm) {
      function mode() {
        st.classList.toggle('sc',mq.matches);
        st.style.setProperty('--n',N);
        if(!mq.matches)[].forEach.call($('#beats').children,function(li) { li.inert=false;li.removeAttribute('aria-hidden'); });
      }
      var sp=function() {
        if(!mq.matches)return;
        var r=st.getBoundingClientRect(),tot=st.offsetHeight-innerHeight,p=Math.min(Math.max(-r.top/tot,0),1),i=Math.min(Math.floor(p*N),N-1);
        [].forEach.call($('#beats').children,function(li,j) {
          li.classList.toggle('on',j===i);
          li.inert=j!==i;
          li.setAttribute('aria-hidden',j!==i)
        });
        st.style.setProperty('--o',(1-p).toFixed(3))
      };
      addEventListener('scroll',sp,{passive:true});
      addEventListener('resize',function() { mode();sp(); });
      mode();
      sp()
    }
  };
})(window.PH);
