/**
 * tabella.js
 * Tutte le cifre del sito in una tabella ordinabile e filtrabile, con
 * esportazione in CSV (separatore ";" e codifica UTF-8 con BOM, per aprirlo
 * direttamente in Excel in italiano). Il CSV rispecchia filtro e ordinamento.
 */
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$, fmt = PH.fmt;

  var COLONNE = [
    { k: 'tipo', t: 'Tipo' },
    { k: 'ind', t: 'Indicatore' },
    { k: 'val', t: 'Valore', num: 'num' },
    { k: 'per', t: 'Periodo' },
    { k: 'fonteN', t: 'Fonte' }
  ];
  var stato = { col: 'tipo', dir: 1, filtro: '' };
  var righe = [];

  /** Primo numero di un testo come "2,8 mld €" oppure "7.000" (null se manca). */
  function primoNumero(testo) {
    var m = /^([\d.,]+)/.exec(testo);
    return m ? parseFloat(m[1].replace(/\./g, '').replace(',', '.')) : null;
  }

  /** Unisce cifre chiave, variazioni e residenti in un unico elenco di righe. */
  function costruisci() {
    var r = [];
    function add(tipo, ind, val, num, per, fonte) {
      r.push({ tipo: tipo, ind: ind, val: val, num: num, per: per, fonte: fonte, fonteN: D.sources[fonte].n });
    }
    D.stats.forEach(function (x) { add('Cifra chiave', x.l, x.v, primoNumero(x.v), x.y || '', x.s); });
    D.variazioni.forEach(function (x) { add('Variazione', x.l, fmt(x.v), x.v, x.p, x.s); });
    D.comuni.forEach(function (x) { add('Residenti', 'Residenti a ' + x.n, PH.mig(x.p), x.p, '1 gennaio 2025', 'tt'); });
    return r;
  }

  function norm(s) {
    return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  /** Righe dopo filtro e ordinamento: sono le stesse che finiscono nel CSV. */
  function visibili() {
    var parole = norm(stato.filtro).split(/\s+/).filter(Boolean);
    var col = COLONNE.filter(function (c) { return c.k === stato.col; })[0];
    return righe
      .filter(function (r) {
        var t = norm([r.tipo, r.ind, r.val, r.per, r.fonteN].join(' '));
        return parole.every(function (p) { return t.indexOf(p) !== -1; });
      })
      .sort(function (a, b) {
        var x = col.num ? a.num : a[col.k], y = col.num ? b.num : b[col.k];
        if (x === null) return 1;
        if (y === null) return -1;
        return (x > y ? 1 : x < y ? -1 : 0) * stato.dir;
      });
  }

  function disegna() {
    var v = visibili();
    $('#tab thead').innerHTML = '<tr>' + COLONNE.map(function (c) {
      var attivo = c.k === stato.col;
      return '<th scope="col" aria-sort="' + (attivo ? (stato.dir > 0 ? 'ascending' : 'descending') : 'none') + '">' +
        '<button type="button" data-k="' + c.k + '">' + c.t + (attivo ? (stato.dir > 0 ? ' ▲' : ' ▼') : '') + '</button></th>';
    }).join('') + '</tr>';
    $('#tab tbody').innerHTML = v.map(function (r) {
      return '<tr><td>' + r.tipo + '</td><td>' + r.ind + '</td><td class="n">' + r.val + '</td><td>' + r.per + '</td>' +
        '<td><a href="' + D.sources[r.fonte].u + '" target="_blank" rel="noopener">' + r.fonteN + '</a></td></tr>';
    }).join('');
    $('#tn').textContent = v.length + ' righe su ' + righe.length + '.';
  }

  /** Righe di testo in un file CSV: virgolette raddoppiate, BOM per Excel. */
  function inCsv(matrice) {
    return '\ufeff' + matrice.map(function (riga) {
      return riga.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(';');
    }).join('\r\n');
  }

  function scarica(nome, matrice) {
    var blob = new Blob([inCsv(matrice)], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nome + '-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  PH.initTabella = function () {
    righe = costruisci();
    disegna();

    $('#tab').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-k]');
      if (!b) return;
      stato.dir = stato.col === b.dataset.k ? -stato.dir : 1;
      stato.col = b.dataset.k;
      disegna();
    });
    $('#tf').addEventListener('input', function () { stato.filtro = this.value; disegna(); });

    $('#csvd').addEventListener('click', function () {
      var testa = [COLONNE.map(function (c) { return c.t; }).concat('Link alla fonte')];
      scarica('pratohub-dati', testa.concat(visibili().map(function (r) {
        return [r.tipo, r.ind, r.val, r.per, r.fonteN, D.sources[r.fonte].u];
      })));
    });

    $('#csva').addEventListener('click', function () {
      var testa = [['Nome', 'Categoria', 'Comune', 'Stato', 'Descrizione', 'Fonti']];
      scarica('pratohub-aziende', testa.concat(D.aziende.map(function (a) {
        var fonti = (a.v || []).map(function (k) { return D.sources[k].u; }).join(' | ');
        return [a.n, a.c, a.m, a.v ? 'Verificata' : 'Da verificare', a.v ? a.f : a.d, fonti];
      })));
    });
  };
})(window.PH);
