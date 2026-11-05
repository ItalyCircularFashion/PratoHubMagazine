/**
 * grafico.js
 * Grafico a barre divergenti con le variazioni recenti (addetti, produzione, export).
 *
 * Dati: window.PH (vedi data.js). Nessuna dipendenza esterna.
 */
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$, cite = PH.cite, fmt = PH.fmt, rm = PH.rm, root = PH.root;

  PH.initGrafico = function () {
    var max=Math.max.apply(null,D.variazioni.map(function(x) {
      return Math.abs(x.v)
    }));
    $('#chart').innerHTML=D.variazioni.map(function(x) {
      var w=Math.max(Math.abs(x.v)/max*50,.6),pos=x.v>0;
      return '<div class="row"><div class="lab"><strong>'+PH.esc(x.l)+'</strong> <span>'+PH.esc(x.p)+'</span> <small>'+cite(x.s)+'</small></div>'+ '<div class="track" aria-hidden="true"><i class="bar '+(pos?'up':'dn')+'" style="width:'+w+'%;'+(pos?'left':'right')+':50%"></i></div>'+ '<div class="val '+(pos?'up':'dn')+'">'+fmt(x.v)+'</div></div>'
    }).join('');
  };
})(window.PH);
