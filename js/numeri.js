// ============================================================
// js/numeri.js — PratoHub · numero delle cifre
// ============================================================
// Legge PH.stats e riempie #stats. Nessuna dipendenza esterna.
// ============================================================
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$, cite = PH.cite;

  PH.initNumeri = function () {
    var stats = $('#stats');
    if (!stats) return;
    if (!D.stats.length) {
      stats.innerHTML = '<p class="note">Nessun dato caricato: inserisci le voci in data.js.</p>';
      return;
    }
    stats.innerHTML = D.stats.map(function (x) {
      return '<div class="stat"><b>' + escapeHtml(x.v) + '</b>' +
        '<span>' + escapeHtml(x.l) + '</span>' +
        '<small>' + (x.y ? escapeHtml(x.y) : '') + ' · ' + cite(x.s) + '</small>' +
        '</div>';
    }).join('');
  };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]);
    });
  }
})(window.PH);
