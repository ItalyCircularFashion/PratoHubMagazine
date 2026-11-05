/**
 * effetti.js
 * Animazioni all'ingresso: comparsa progressiva, conteggio dei numeri e filo di avanzamento. Disattivate con "riduci animazioni".
 *
 * Dati: window.PH (vedi data.js). Nessuna dipendenza esterna.
 */
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$, cite = PH.cite, fmt = PH.fmt, rm = PH.rm, root = PH.root;

  PH.initEffetti = function () {
    function up(el) {
      var o=el.textContent,m=/^([\d.,]+)(.*)$/.exec(o);
      if(!m)return;
      var dec=(m[1].split(',')[1]||'').length,v=parseFloat(m[1].replace(/\./g,'').replace(',','.')),t0=null;
      function f(t) {
        t0=t0||t;
        var k=Math.min((t-t0)/1200,1),e=1-Math.pow(1-k,3);
        el.textContent=k<1?(v*e).toLocaleString('it-IT',{minimumFractionDigits:dec,maximumFractionDigits:dec})+m[2]:o;
        if(k<1)requestAnimationFrame(f)
      }
      requestAnimationFrame(f)
    }
    if(!rm&&'IntersectionObserver' in window) {
      root.classList.add('js');
      var io=new IntersectionObserver(function(es) {
        es.forEach(function(e) {
          if(!e.isIntersecting)return;
          var t=e.target;
          t.classList.add('in');
          if(t.classList.contains('stat'))up(t.querySelector('b'));
          io.unobserve(t)
        })
      },{threshold:.15});
      [].forEach.call(document.querySelectorAll('.stat,.steps li,.row,.timeline li,.cert,.com,.arts li,.gloss div'),function(el,i) {
        el.classList.add('rv');
        el.style.setProperty('--d',(i%6)*70+'ms');
        io.observe(el)
      });
      var th=document.createElement('div');
      th.className='thread';
      document.body.prepend(th);
      addEventListener('scroll',function() {
        th.style.transform='scaleX('+(root.scrollTop/((root.scrollHeight-root.clientHeight)||1))+')'
      },{passive:true})
    }
  };
})(window.PH);
