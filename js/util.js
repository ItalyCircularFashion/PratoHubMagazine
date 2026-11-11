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
    return (n > 0 ? '+' : '\u2212') + Math.abs(n).toString().replace('.', ',') + '%';
  };

  /** Link alla fonte (chiave di PH.sources) con anno facoltativo. */
  PH.cite = function (key, year) {
    var s = PH.sources[key];
    return '<a href="' + s.u + '" target="_blank" rel="noopener">' + s.n + '</a>' + (year ? ', ' + year : '');
  };

  /** Numero con il punto delle migliaia: 3110 diventa "3.110". */
  PH.mig = function (n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
})(window.PH);
