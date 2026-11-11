/**
 * territorio.js
 * Mappa schematica dei sette comuni (cerchi proporzionali ai residenti) ed elenco collegato.
 *
 * Dati: window.PH (vedi data.js). Nessuna dipendenza esterna.
 */
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$, cite = PH.cite, fmt = PH.fmt, rm = PH.rm, root = PH.root;

  PH.initTerritorio = function () {
    var NS='http://www.w3.org/2000/svg',map=$('#map'),pr=D.comuni[0].p,tot=0;
    map.innerHTML='<path d="M235 38 C 225 70 215 85 205 112 C 200 140 205 165 200 195" fill="none" stroke="var(--line)" stroke-width="3" stroke-dasharray="2 5" stroke-linecap="round"/><text x="238" y="150" font-size="11" fill="var(--mute)" font-style="italic">Bisenzio</text>';
    function pick(n) {
      [].forEach.call(document.querySelectorAll('[data-c]'),function(e) {
        e.classList.toggle('on',e.dataset.c===n)
      })
    }
    D.comuni.forEach(function(c) {
      tot+=c.p;
      var r=46*Math.sqrt(c.p/pr);
      map.insertAdjacentHTML('beforeend','<g data-c="'+c.n+'" tabindex="0"><circle cx="'+c.x+'" cy="'+c.y+'" r="'+r.toFixed(1)+'"/><text x="'+c.x+'" y="'+(c.y+r+14)+'" text-anchor="middle">'+c.n+'</text></g>')
    });
    var nA=function(n) {
      return D.aziende.filter(function(a) {
        return a.m===n
      }).length
    };
    $('#comuni').innerHTML='<p class="tot"><b>'+PH.mig(tot)+'</b> residenti nei sette comuni, <b>'+Math.round(pr/tot*100)+'%</b> a Prato. '+cite('tt')+'</p>'+D.comuni.map(function(c) {
      return '<div class="com" data-c="'+c.n+'" tabindex="0"><h3>'+c.n+' <span>'+PH.mig(c.p)+'</span></h3><p>'+c.r+' '+cite(c.s)+'</p>'+(nA(c.n)?'<small>'+nA(c.n)+' aziende nell’elenco preliminare</small>':'')+'</div>'
    }).join('');
    ['mouseover','focusin','click'].forEach(function(ev) {
      document.querySelector('.terr').addEventListener(ev,function(e) {
        var t=e.target.closest('[data-c]');
        if(t)pick(t.dataset.c)
      })
    });
  };
})(window.PH);
