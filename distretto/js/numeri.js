/**
 * numeri.js
 * Cifre chiave e le sei fasi del ciclo produttivo.
 *
 * Dati: window.PH (vedi data.js). Nessuna dipendenza esterna.
 */
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$, cite = PH.cite, fmt = PH.fmt, rm = PH.rm, root = PH.root;

  PH.initNumeri = function () {
    $('#stats').innerHTML=D.stats.map(function(x,i) {
      return '<div class="stat'+(i===0?' big':'')+'"><b>'+PH.esc(x.v)+'</b><span>'+PH.esc(x.l)+'</span><small>'+cite(x.s,x.y||'Periodo del dato non indicato nella fonte')+'</small></div>'
    }).join('');
    $('#steps').innerHTML=D.steps.map(function(x) {
      return '<li><h3>'+PH.esc(x.t)+'</h3><p>'+PH.esc(x.d)+'</p></li>'
    }).join('');
  };
})(window.PH);
