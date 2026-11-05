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

  /** Valore base e unità: miliardi e milioni confrontabili solo nella stessa grandezza. */
  function misura(testo, indicatore) {
    var m = /^([\d.,]+)/.exec(testo);
    var numero=m ? parseFloat(m[1].replace(/\./g, '').replace(',', '.')) : null;
    if(numero!==null)numero*= /mld/.test(testo)?1e9:/mln/.test(testo)?1e6:1;
    var unita=/%/.test(testo)?'Percentuale':/€/.test(testo)?'Euro':/\bt\b/.test(testo)?'Tonnellate':/\bm\b/.test(testo)?'Metri':/imprese|aziende/.test(indicatore)?'Imprese':/addetti/.test(indicatore)?'Addetti':'Conteggi';
    return {numero:numero,unita:unita};
  }

  /** Unisce cifre chiave, variazioni e residenti in un unico elenco di righe. */
  function costruisci() {
    var r = [];
    function add(tipo, ind, val, num, per, fonte, unita) {
      r.push({ tipo: tipo, ind: ind, val: val, num: num, per: per, fonte: fonte, fonteN: D.sources[fonte] ? D.sources[fonte].n : 'Fonte non indicata', unita:unita });
    }
    D.stats.forEach(function (x) { var m=misura(x.v,x.l);add('Cifra chiave', x.l, x.v, m.numero, x.y || 'Periodo del dato non indicato nella fonte', x.s,m.unita); });
    D.variazioni.forEach(function (x) { add('Variazione', x.l, fmt(x.v), x.v, x.p, x.s,'Percentuale'); });
    D.comuni.forEach(function (x) { add('Residenti', 'Residenti a ' + x.n, PH.mig(x.p), x.p, '1 gennaio 2025', 'tt','Residenti'); });
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
        if(col.num && a.unita!==b.unita)return a.unita.localeCompare(b.unita,'it');
        var x = col.num ? a.num : a[col.k], y = col.num ? b.num : b[col.k];
        if (x === null && y === null) return 0;
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
        '<button type="button" data-k="' + c.k + '"' + (c.num ? ' title="Valori raggruppati per unità, senza confronto tra grandezze diverse"' : '') + '>' + c.t + (attivo ? (stato.dir > 0 ? ' ▲' : ' ▼') : '') + '</button></th>';
    }).join('') + '</tr>';
    $('#tab tbody').innerHTML = v.map(function (r) {
      return '<tr><td>' + PH.esc(r.tipo) + '</td><td>' + PH.esc(r.ind) + '</td><td class="n">' + PH.esc(r.val) + '</td><td>' + PH.esc(r.per) + '</td>' +
        '<td>' + PH.cite(r.fonte) + '</td></tr>';
    }).join('');
    $('#tn').textContent = v.length + ' righe su ' + righe.length + '. Valore: ordinamento all’interno di ogni unità; grandezze diverse non sono confrontabili.';
    if(!v.length)$('#tab tbody').innerHTML='<tr><td colspan="5">Nessun dato corrisponde al filtro.</td></tr>';
  }

  /** Neutralizza formule Excel, preservando valori numerici e percentuali con segno. */
  function cella(c) {
    var s=String(c == null ? '' : c);
    var numero=/^[+\-−]?(?:\d+(?:[.,]\d+)*)(?:%|\s*%)?$/.test(s);
    if(/^[\s\u0000-\u001f]*[=+@-]/.test(s) && !numero)s="'"+s;
    return '"'+s.replace(/"/g,'""')+'"';
  }
  /** Virgolette raddoppiate, BOM per Excel; stessa protezione per entrambi i CSV. */
  function inCsv(matrice) {
    return '\ufeff' + matrice.map(function (riga) {
      return riga.map(cella).join(';');
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
    $('#treset').addEventListener('click',function() { stato.filtro='';stato.col='tipo';stato.dir=1;$('#tf').value='';disegna(); });

    $('#csvd').addEventListener('click', function () {
      var testa = [COLONNE.map(function (c) { return c.t; }).concat('Link alla fonte')];
      scarica('pratohub-dati', testa.concat(visibili().map(function (r) {
        return [r.tipo, r.ind, r.val, r.per, r.fonteN, D.sources[r.fonte] ? D.sources[r.fonte].u : ''];
      })));
    });

    $('#csva').addEventListener('click', function () {
      var testa = [['Nome', 'Categoria', 'Comune', 'Stato', 'Descrizione', 'Fonti']];
      scarica('pratohub-aziende', testa.concat(PH.aziendeVisibili().map(function (a) {
        var fonti = (a.v || []).map(function (k) { return D.sources[k].u; }).join(' | ');
        return [a.n, a.c || 'Non indicata', a.m || 'Non indicato', 'Con fonti; non verifica camerale né certificazione', PH.companyNote(a), fonti];
      })));
    });
  };
})(window.PH);
