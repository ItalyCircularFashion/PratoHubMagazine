/**
 * ricerca.js
 * Ricerca unica su aziende, glossario, certificazioni, storia, comuni, musei,
 * eventi, articoli, cifre, fasi del cardato e fonti.
 * Si apre con il pulsante in alto o premendo "/" (fuori dalle caselle di testo).
 */
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$;
  var voci = null;

  /** Minuscolo e senza accenti, così "tintoria" trova anche "Tintòria". */
  function norm(s) {
    return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  /** Costruisce l'indice una sola volta: una voce per ogni elemento dei dati. */
  function indice() {
    var out = [];
    function add(tipo, titolo, testo, href) {
      out.push({ tipo: tipo, titolo: titolo, testo: testo, href: href, t: norm(titolo), k: norm(titolo + ' ' + testo) });
    }
    D.aziende.forEach(function (a) {
      add('Azienda', a.n, PH.companyNote(a) + ' ' + (a.c||'') + ' ' + (a.m||''), '#' + PH.companyId(a));
    });
    D.glossario.forEach(function (x) { add('Glossario', x.t, x.d, '#glossario'); });
    D.certs.forEach(function (x) { add('Certificazione', x.n, x.t + ' ' + x.d, '#certificazioni'); });
    D.articoli.forEach(function (x) { add('Articolo', x.t, x.d, '#certificazioni'); });
    D.storia.forEach(function (x) { add('Storia', x.y + ' ' + x.t, x.d, '#storia'); });
    D.comuni.forEach(function (x) { add('Comune', x.n, x.r + ' ' + PH.mig(x.p) + ' residenti', '#territorio'); });
    D.musei.forEach(function (x) { add('Museo', x.n, x.t + ' ' + x.d, '#turismo'); });
    D.eventi.forEach(function (x) { add('Evento', x.t, x.q + ' ' + x.d, '#turismo'); });
    D.cardato.forEach(function (x) { add('Ciclo del cardato', x.t, x.d, '#cardato'); });
    D.stats.forEach(function (x) { add('Cifra', x.v + ' ' + x.l, '', '#numeri'); });
    Object.keys(D.sources).forEach(function (k) { add('Fonte', D.sources[k].n, '', '#fonti'); });
    return out;
  }

  /** Voci che contengono tutte le parole cercate; il titolo pesa più del testo. */
  function cerca(testo) {
    var parole = norm(testo).split(/\s+/).filter(Boolean);
    if (!parole.length) return [];
    return voci
      .map(function (v) {
        var ok = parole.every(function (p) { return v.k.indexOf(p) !== -1; });
        var inTitolo = parole.filter(function (p) { return v.t.indexOf(p) !== -1; }).length;
        return { v: v, punti: ok ? 1 + inTitolo : 0 };
      })
      .filter(function (r) { return r.punti > 0; })
      .sort(function (a, b) { return b.punti - a.punti; })
      .map(function (r) { return r.v; });
  }

  function mostra(testo) {
    var trovate = cerca(testo), lista = $('#cris');
    $('#cn').textContent = !testo.trim() ? '' : trovate.length ? trovate.length + ' risultati' + (trovate.length > 30 ? ', mostro i primi 30' : '') : 'Nessun risultato';
    lista.innerHTML = trovate.slice(0, 30).map(function (v) {
      var anteprima = v.testo.length > 110 ? v.testo.slice(0, 110) + '…' : v.testo;
      return '<li><a href="' + PH.esc(v.href) + '"><span class="tag">' + PH.esc(v.tipo) + '</span><strong>' + PH.esc(v.titolo) + '</strong>' +
        (anteprima ? '<span class="ant">' + PH.esc(anteprima) + '</span>' : '') + '</a></li>';
    }).join('');
  }

  PH.initRicerca = function () {
    var dlg = $('#cerca'), campo = $('#q');
    voci = indice();

    function apri() {
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      campo.select();
    }
    function chiudi() {
      if (dlg.close) dlg.close(); else dlg.removeAttribute('open');
    }

    $('#cbtn').addEventListener('click', apri);
    $('#cx').addEventListener('click', chiudi);
    campo.addEventListener('input', function () { mostra(campo.value); });
    // Un clic su un risultato porta alla sezione e chiude la finestra.
    $('#cris').addEventListener('click', function (e) {
      var a=e.target.closest('a');
      if(!a)return;
      var id=a.getAttribute('href').slice(1);
      chiudi();
      if(id.indexOf('azienda-')===0) {
        e.preventDefault();
        history.replaceState(null,'','#'+id);
        PH.mostraAzienda(id);
      } else {
        requestAnimationFrame(function() {
          var target=document.getElementById(id);
          if(target) { target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.scrollIntoView({behavior:PH.rm?'instant':'smooth'}); }
        });
      }
    });
    // Un clic sullo sfondo scuro chiude la finestra.
    dlg.addEventListener('click', function (e) { if (e.target === dlg) chiudi(); });
    document.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase();
      if (e.key === '/' && tag !== 'input' && tag !== 'textarea' && tag !== 'select' && !e.target.isContentEditable && !e.metaKey && !e.ctrlKey && !dlg.open) {
        e.preventDefault();
        apri();
      }
    });
  };
})(window.PH);
