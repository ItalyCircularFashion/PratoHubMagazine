/**
 * musei.js
 * Musei, turismo industriale ed eventi (con stato "concluso" calcolato dalla data di oggi).
 *
 * Dati: window.PH (vedi data.js). Nessuna dipendenza esterna.
 */
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$, cite = PH.cite, fmt = PH.fmt, rm = PH.rm, root = PH.root;

  PH.initMusei = function () {
    $('#musei').innerHTML=D.musei.map(function(x) {
      return '<div class="cert"><h3>'+PH.esc(x.n)+'</h3><em>'+PH.esc(x.t)+'</em><p>'+PH.esc(x.d)+'</p><small>'+cite(x.s)+'</small></div>'
    }).join('');
    var oggi=new Date().toISOString().slice(0,10);
    $('#eventi').innerHTML=D.eventi.map(function(x) {
      var fin=x.fine&&x.fine<oggi;
      return '<li>'+PH.link(D.sources[x.s]&&D.sources[x.s].u,x.t)+' <b class="when'+(fin?' past':'')+'">'+PH.esc(x.q)+(fin?', concluso':'')+'</b><span>'+PH.esc(x.d)+'</span></li>'
    }).join('');
  };
})(window.PH);
