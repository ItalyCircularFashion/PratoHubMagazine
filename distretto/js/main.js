/**
 * main.js
 * Avvia i moduli uno alla volta. Ogni modulo e isolato da try/catch:
 * se uno fallisce, gli altri continuano a funzionare e l'errore finisce in console.
 */
(function (PH) {
  'use strict';

  var ordine = ['initNumeri', 'initGrafico', 'initAziende', 'initTerritorio', 'initMusei', 'initContenuti', 'initRicerca', 'initTabella', 'initIdentita', 'initRacconto', 'initCiclo', 'initEffetti'];

  ordine.forEach(function (nome) {
    try {
      PH[nome]();
    } catch (errore) {
      console.error('PratoHub, modulo ' + nome + ':', errore);
    }
  });
})(window.PH);
