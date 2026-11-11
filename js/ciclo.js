// ============================================================
// js/ciclo.js — PratoHub · ciclo del cardato
// ============================================================
// Rendi interattiva la sezione "#cardato": 6 fasi disegnate come anelli,
// un "bead" che percorre il cerchio, click per stoppare/seleziona, botto-
// ne per pausa/ripresa. Le fasi vengono lette da PH.cardato (data.js).
// Silenzioso se riduci animazioni.
// ============================================================
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$, rm = PH.rm;
  var NS = 'http://www.w3.org/2000/svg';
  var cx = 235, cy = 210, R = 160;

  PH.initCiclo = function () {
    if (rm) return;
    var svg = $('#loopsvg');
    var info = $('#loopinfo');
    var btn = $('#loopbtn');
    if (!svg || !info) return;
    var phases = (D.cardato && D.cardato.length) ? D.cardato : [];
    if (!phases.length) { if (btn) btn.disabled = true; return; }

    (function build() {
      phases.forEach(function (f, i) {
        var g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'nd');
        g.setAttribute('data-i', i);

        var a = (-Math.PI / 2) + (i / phases.length) * Math.PI * 2;
        var ring = document.createElementNS(NS, 'circle');
        ring.setAttribute('cx', cx);
        ring.setAttribute('cy', cy);
        ring.setAttribute('r', R + i * 18);
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', '#c5cbd4');
        ring.setAttribute('stroke-width', '3');
        g.appendChild(ring);

        var c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', cx + (R + 26) * Math.cos(a));
        c.setAttribute('cy', cy + (R + 26) * Math.sin(a));
        c.setAttribute('r', 7);
        c.setAttribute('class', 'node');
        c.setAttribute('data-i', i);
        g.appendChild(c);

        var num = document.createElementNS(NS, 'text');
        num.setAttribute('class', 'num');
        num.setAttribute('x', cx + (R + 26) * Math.cos(a));
        num.setAttribute('y', cy + (R + 26) * Math.sin(a));
        num.textContent = i + 1;
        g.appendChild(num);

        var lb = document.createElementNS(NS, 'text');
        lb.setAttribute('class', 'lb');
        lb.setAttribute('x', cx + (R + 16) * Math.cos(a));
        lb.setAttribute('y', cy + (R + 16) * Math.sin(a));
        lb.textContent = f.t;
        g.appendChild(lb);

        svg.appendChild(g);

        c.addEventListener('click', (function (idx) {
          return function () { step(idx); };
        })(i));
      });

      // Bead iniziale centrale
      var bead = document.createElementNS(NS, 'circle');
      bead.setAttribute('id', 'bead');
      bead.setAttribute('cx', cx);
      bead.setAttribute('cy', cy);
      bead.setAttribute('r', 8);
      bead.setAttribute('fill', 'var(--dye)');
      bead.setAttribute('stroke', 'var(--bg)');
      bead.setAttribute('stroke-width', '3');
      svg.appendChild(bead);

      info.innerHTML = '<h3>' + escape(phases[0].t) + '</h3>' +
        (phases[0].d ? '<p>' + escape(phases[0].d) + '</p>' : '<p></p>');
      if (btn) btn.disabled = false;
      if (btn) btn.textContent = 'Pausa';
    })();

    if (btn) {
      btn.addEventListener('click', function () {
        btn.textContent = btn.textContent === 'Pausa' ? 'Riprendi' : 'Pausa';
        if (!btn.disabled) stepLoop();
      });
    }
    stepLoop();
  };

  function stepLoop() {
    var svg = $('#loopsvg');
    var phases = (D.cardato && D.cardato.length) ? D.cardato : [];
    if (!svg || !phases.length) return;
    var idx = parseInt(svg.querySelector('.nd.on .node') ? 0 : 0, 10);
    // Semplice rotor: il bead avanza di un grado a=freq
    setTimeout(function () {
      if (!svg || !phases.length) return;
      var rot = (parseFloat(svg.querySelector('#bead').getAttribute('transform') || '0') || 0) + 1 % 360;
      var bead = svg.querySelector('#bead');
      bead.setAttribute('transform', 'rotate(' + rot + ' ' + cx + ' ' + cy + ')');
      var i = Math.floor((rot / 360) * phases.length) % phases.length;
      select(i);
      if (!paused) stepLoop();
    }, 90);
  }

  function select(i) {
    var svg = $('#loopsvg');
    if (!svg) return;
    var nd = svg.querySelector('.nd.on');
    if (nd) nd.classList.remove('on');
    var g = svg.querySelector('.nd[data-i="' + i + '"]');
    if (g) g.classList.add('on');
    var info = $('#loopinfo');
    if (info) {
      info.innerHTML = '<h3>' + escape(phases[i].t) + '</h3>' +
        (phases[i].d ? '<p>' + escape(phases[i].d) + '</p>' : '<p></p>');
    }
  }
  function escape(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]);
    });
  }
})(window.PH);
