/**
 * contenuti.js
 * Sezioni che si limitano a mostrare i dati: fonti, cronologia, certificazioni, articoli, glossario.
 *
 * Dati: window.PH (vedi data.js). Nessuna dipendenza esterna.
 */
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$, cite = PH.cite, fmt = PH.fmt, rm = PH.rm, root = PH.root;

  PH.initContenuti = function () {
    $('#sources').innerHTML=Object.keys(D.sources).map(function(k) {
      return '<li>'+cite(k)+'</li>'
    }).join('');
    $('#timeline').innerHTML=D.storia.map(function(x) {
      return '<li><b>'+PH.esc(x.y)+'</b><h3>'+PH.esc(x.t)+'</h3><p>'+PH.esc(x.d)+'</p><small>'+cite(x.s)+'</small></li>'
    }).join('');
    $('#certs').innerHTML=D.certs.map(function(x) {
      return '<div class="cert"><h3>'+PH.esc(x.n)+'</h3><em>'+PH.esc(x.t)+'</em><p>'+PH.esc(x.d)+'</p>'+(x.s?'<small>'+cite(x.s)+'</small>':'<small>Fonte bibliografica non indicata</small>')+'</div>'
    }).join('');
    $('#articoli').innerHTML=D.articoli.map(function(x) {
      return '<li>'+PH.link(D.sources[x.s]&&D.sources[x.s].u,x.t)+'<span>'+PH.esc(x.d)+'</span></li>'
    }).join('');
    $('#gloss').innerHTML=D.glossario.map(function(x) {
      return '<div><dt>'+PH.esc(x.t)+'</dt><dd>'+PH.esc(x.d)+'</dd></div>'
    }).join('');
  };
})(window.PH);
