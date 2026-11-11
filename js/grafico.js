// ============================================================
// js/grafico.js — PratoHub · variazioni del periodo
// ============================================================
// Legge PH.variazioni e costruisce #chart (barre orizzontali con
// segno, locale e percentuale). Nessuna dipendenza esterna.
// ============================================================
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$, fmt = PH.fmt;

  PH.initGrafico = function () {
    var chart = $('#chart');
    if (!chart) return;
    if (!D.variazioni.length) {
      chart.innerHTML = '<p class="note">Nessuna variazione caricata: inserisci PH.variazioni in data.js.</p>';
      return;
    }
    chart.innerHTML = '<div class="row"><div class="lab">' +
      '<span>Periodo vs anno precedente</span></div>' +
      '<div class="track"></div></div>' +
      D.variazioni.map(function (x) {
        var pct = Math.max(0, Math.min(100, parseFloat(x.v)));
        var cls = pct >= 0 ? 'up' : 'dn';
        var w = Math.max(2, Math.abs(pct) * 2.2) + '%';
        return '<div class="row"><div class="lab">' +
          '<span>' + escapeHtml(x.l) + '</span></div>' +
          '<div class="track"><div class="bar ' + cls + '" style="width:' + w + '"></div></div>' +
          '<div class="val ' + cls + '">' + fmt(x.v) + '</div></div>';
      }).join('');
  };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]);
    });
  }
})(window.PH);
