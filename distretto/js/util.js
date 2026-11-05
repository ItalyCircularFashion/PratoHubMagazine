/**
 * util.js
 * Funzioni condivise da tutti i moduli: selettore, formato delle variazioni,
 * citazione delle fonti e preferenza "riduci animazioni".
 */
(function (PH) {
  'use strict';

  PH.root = document.documentElement;
  PH.rm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Primo elemento che corrisponde al selettore CSS. */
  PH.$ = function (selector) {
    return document.querySelector(selector);
  };

  /** Variazione percentuale con segno: 2.7 diventa "+2,7%", -25.2 diventa "−25,2%". */
  PH.fmt = function (n) {
    return (n > 0 ? '+' : n < 0 ? '\u2212' : '') + Math.abs(n).toString().replace('.', ',') + '%';
  };

  /** I dati restano testo, anche quando un redattore inserisce markup o virgolette. */
  PH.esc = function (value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  };
  PH.safeUrl = function (value) {
    try {
      var url = new URL(String(value));
      return /^https?:$/.test(url.protocol) && !url.username && !url.password ? url.href : '';
    } catch (error) { return ''; }
  };
  PH.link = function (url, label) {
    var href = PH.safeUrl(url);
    return href ? '<a href="' + PH.esc(href) + '" target="_blank" rel="noopener noreferrer">' + PH.esc(label) + '</a>' : PH.esc(label);
  };
  /** Link alla fonte; la data dell'articolo non sostituisce il periodo del dato. */
  PH.cite = function (key, year) {
    var s = PH.sources[key];
    return (s ? PH.link(s.u, s.n) : 'Fonte non indicata') + (year ? ' · ' + PH.esc(year) : '');
  };
  PH.norm = function (value) {
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  };
  PH.companyId = function (a) {
    return 'azienda-' + PH.norm(a.n).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };
  PH.companyNote = function (a) {
    return a.f || 'Attività descritta nel sito ufficiale; non costituisce verifica camerale né attestazione di certificazioni.';
  };

  /** Numero con il punto delle migliaia: 3110 diventa "3.110". */
  PH.mig = function (n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
})(window.PH);
