// ============================================================
// js/aziende.js — PratoHub · scheda aziende
// ============================================================
// Legge PH.aziende, costruisce filtri e schede, aiuta la ricerca.
// Nessuna dipendenza esterna.
// ============================================================
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$, cite = PH.cite;

  var categorie = [];

  function categorieUniche() {
    var set = {};
    D.aziende.forEach(function (a) {
      if (a.c && !set[a.c]) { set[a.c] = true; categorie.push(a.c); }
    });
    return categorie;
  }

  PH.initAziende = function () {
    categorie = categorieUniche();

    // Filtri
    var filters = $('#filters');
    if (filters) {
      filters.innerHTML = categorie.map(function (c) {
        return '<button type="button" data-c="' + escapeHtml(c) + '">' +
          escapeHtml(c) + ' <span class="cnt"></span></button>';
      }).join('');
      filters.querySelectorAll('button[data-c]').forEach(function (b) {
        b.addEventListener('click', function () {
          var on = b.getAttribute('aria-pressed') === 'true';
          b.setAttribute('aria-pressed', String(!on));
          disegna();
        });
      });
    }

    disegna();
  };

  function disegna() {
    var sel = [];
    var pressed = document.querySelectorAll('#filters button[aria-pressed=true]');
    pressed.forEach(function (b) { sel.push(b.getAttribute('data-c')); });

    var list = $('#companies');
    if (!list) return;
    if (!D.aziende.length) {
      list.innerHTML = '<p class="note">Nessuna azienda caricata: inserisci PH.aziende in data.js.</p>';
      return;
    }
    list.innerHTML = D.aziende.filter(function (a) {
        if (sel.length && !sel.includes(a.c)) return false;
        return true;
      }).map(function (a) {
        var fonti = (a.v || []).map(function (k) { return cite(k); }).join(' · ');
        return '<li><em>' + escapeHtml(a.f || '') + '</em>' +
          '<h3>' + escapeHtml(a.n) + '</h3>' +
          '<p>' + escapeHtml(a.d || a.f || '') + '</p>' +
          '<small>' + (a.m ? escapeHtml(a.m) : '') + ' · ' + (a.v ? 'verificata' : 'da verificare') + '</small>' +
          (fonti ? '<span class="tag">' + escapeHtml(fonti) + '</span>' : '') +
          '</li>';
      }).join('');
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]);
    });
  }
})(window.PH);
