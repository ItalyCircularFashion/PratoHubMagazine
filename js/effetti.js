// ============================================================
// js/effetti.js — PratoHub · thread e reveal
// ============================================================
// 1) Barra d'anteprima fissa (top) che resiste con lo scroll.
// 2) Reveal delle .rv in vista al passare del cursore.
// Silenziente se l'utente ha "riduci animazioni" attivo.
// ============================================================
(function (PH) {
  'use strict';
  var D = PH, root = PH.root, rm = PH.rm;

  PH.initEffetti = function () {
    if (rm) { root.classList.remove('js'); return; }
    root.classList.add('js');
    threadTick();
    revealOnScroll();
  };

  function threadTick() {
    var th = document.getElementById('thread');
    if (!th) return;
    (function tick() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      th.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
      requestAnimationFrame(tick);
    })();
  }

  function revealOnScroll() {
    var els = (document.querySelectorAll) ? document.querySelectorAll('.rv') : [];
    (function tick() {
      els.forEach(function (el) {
        if (el.classList.contains('in')) return;
        var r = el.getBoundingClientRect();
        if (r.top <= window.innerHeight - 80 && r.bottom >= 0) el.classList.add('in');
      });
      requestAnimationFrame(tick);
    })();
  }
})(window.PH);
