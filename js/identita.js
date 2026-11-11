// ============================================================
// js/identità.js — PratoHub · identità visiva
// ============================================================
// Fissa l'identità primaria della V4 (magento primario, verde accento,
// basi scure) sul root, al caricamento dei moduli. Il CSS tiene già i
// colori; qui li garantiamo coerenti fin dal primo frame.
// ============================================================
(function (PH) {
  'use strict';
  var root = PH.root;

  PH.initIdentita = function () {
    root.style.setProperty('--dye', 'rgb(200 29 98)');
    root.style.setProperty('--up', 'rgb(15 127 110)');
    root.style.setProperty('--band', 'rgb(27 42 82)');
    root.style.setProperty('--ink', '#14213d');
  };
})(window.PH);
