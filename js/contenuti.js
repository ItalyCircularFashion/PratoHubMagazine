// ============================================================
// js/contenuti.js — PratoHub · certificazioni, storia, cardato, glossario
// ============================================================
// Legge PH.certs, PH.articoli, PH.storia, PH.cardato, PH.glossario.
// Nessuna dipendenza esterna.
// ============================================================
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$;

  PH.initContenuti = function () {
    certs();
    articoli();
    storia();
    cardato();
    glossario();
  };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]);
    });
  }

  function certs() {
    var c = $('#certs');
    if (c) {
      if (!D.certs.length) {
        c.innerHTML = '<p class="note">Nessuna certificazione caricata: inserisci PH.certs in data.js.</p>';
      } else {
        c.innerHTML = D.certs.map(function (x) {
          return '<div class="cert"><em>' + escapeHtml(x.n) + '</em>' +
            '<p>' + escapeHtml(x.t || '') + '</p>' +
            (x.d ? '<p>' + escapeHtml(x.d) + '</p>' : '') + '</div>';
        }).join('');
      }
    }
  }

  function articoli() {
    var a = $('#articoli');
    if (a) {
      if (!D.articoli.length) {
        a.innerHTML = '<p class="note">Nessun articolo caricato: inserisci PH.articoli in data.js.</p>';
      } else {
        a.innerHTML = D.articoli.map(function (x) {
          return '<li><a href="#certificazioni">' + escapeHtml(x.t) + '</a>' +
            (x.d ? ' <span>' + escapeHtml(x.d) + '</span>' : '') + '</li>';
        }).join('');
      }
    }
  }

  function storia() {
    var t = $('#timeline');
    if (t) {
      if (!D.storia.length) {
        t.innerHTML = '<p class="note">Nessun dato storico caricato: inserisci PH.storia in data.js.</p>';
      } else {
        t.innerHTML = D.storia.map(function (x) {
          return '<li><b>' + escapeHtml(x.y) + '</b>' +
            '<h3>' + escapeHtml(x.t) + '</h3>' +
            (x.d ? '<p>' + escapeHtml(x.d) + '</p>' : '<p></p>') +
            '<small>' + escapeHtml(x.d) + '</small>' +
            '</li>';
        }).join('');
      }
    }
  }

  function cardato() {
    var svg = $('#loopsvg');
    var info = $('#loopinfo');
    if (svg && D.cardato.length) {
      var parts = D.cardato.map(function (x, i) {
        return '<circle cx="235" cy="210" r="' + (70 + i * 22) + '" fill="none" stroke="#c5cbd4" stroke-width="3"/>';
      }).join('');
      svg.innerHTML = '<path d="M235 38 C 225 70 215 85 205 112 C 200 140 205 165 200 195" fill="none" stroke="#c5cbd4" stroke-width="3" stroke-dasharray="2 5" stroke-linecap="round"/>' +
        '<text x="238" y="150" font-size="11" fill="#4b5873" font-style="italic">Bisenzio</text>' + parts;
    }
    if (info) {
      info.innerHTML = D.cardato.length ? '<h3>' + escapeHtml(D.cardato[0] ? D.cardato[0].t : 'Fase 1') + '</h3>' : '';
    }
  }

  function glossario() {
    var g = $('#gloss');
    if (g) {
      if (!D.glossario.length) {
        g.innerHTML = '<p class="note">Nessun termine caricato: inserisci PH.glossario in data.js.</p>';
      } else {
        g.innerHTML = D.glossario.map(function (x) {
          return '<dl><dt>' + escapeHtml(x.t) + '</dt><dd>' + escapeHtml(x.d) + '</dd></dl>';
        }).join('');
      }
    }
  }
})(window.PH);
