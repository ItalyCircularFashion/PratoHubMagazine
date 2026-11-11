// ============================================================
// js/racconto.js — PratoHub · narrazione a scorrimento
// ============================================================
// Il blocco "#beats" scorre insieme allo scroll: ogni "beat" (ici 1..n)
// slide verticalmente e si illumina quando è in primo piano.
// Silenzioso se riduci animazioni.
// ============================================================
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$, rm = PH.rm;

  PH.initRacconto = function () {
    if (rm) return;
    var story = document.querySelector('.story');
    if (!story) return;
    var beats = document.querySelectorAll('.story .beats li');
    var n = (beats.length && beats.length < 12) ? beats.length : 6;
    story.style.setProperty('--n', n);
    story.classList.add('sc');

    // Ogni beat si posiziona in verticale; il "corrente" si illumina.
    (function place() {
      [].forEach.call(beats, function (li, i) {
        li.style.transform = 'translateY(' + (i * 100) + '%)';
      });
    })();

    var current = -1;
    var tick = function () {
      var p = document.documentElement.scrollTop;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var target = h > 0 ? Math.min(n - 1, Math.floor((p / h) * n)) : 0;
      [].forEach.call(beats, function (li, i) {
        li.classList.toggle('on', i === target);
      });
      if (target !== current) {
        current = target;
        var p2 = document.querySelector('.cue');
        if (p2) p2.textContent = (target + 1) + ' di ' + n;
      }
      requestAnimationFrame(tick);
    };
    tick();
  };
})(window.PH);
