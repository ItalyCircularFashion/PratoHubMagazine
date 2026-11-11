// ============================================================
// js/musei.js — PratoHub · musei e eventi
// ============================================================
// Legge PH.musei e PH.eventi, riempie #musei e #eventi.
// Nessuna dipendenza esterna.
// ============================================================
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$;

  PH.initMusei = function () {
    var mu = $('#musei');
    if (mu) {
      if (!D.musei.length) {
        mu.innerHTML = '<p class="note">Nessun museo caricato: inserisci PH.musei in data.js.</p>';
      } else {
        mu.innerHTML = D.musei.map(function (m) {
          return '<div class="cert"><em>' + escapeHtml(m.n) + '</em>' +
            '<p>' + escapeHtml(m.t || '') + '</p>' +
            (m.d ? '<p>' + escapeHtml(m.d) + '</p>' : '') + '</div>';
        }).join('');
      }
    }

    var ev = $('#eventi');
    if (ev) {
      if (!D.eventi.length) {
        ev.innerHTML = '<p class="note">Nessun evento caricato: inserisci PH.eventi in data.js.</p>';
      } else {
        ev.innerHTML = D.eventi.map(function (e) {
          return '<li><b>' + escapeHtml(e.t) + '</b>' +
            (e.q ? ' <span class="when">' + escapeHtml(e.q) + '</span>' : '') +
            ' <small>' + escapeHtml(e.d || '') + '</small></li>';
        }).join('');
      }
    }
  };
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]);
    });
  }
})(window.PH);
