/**
 * identita.js
 * Identita visiva: scelta del tessuto nell'apertura (colora tutto il sito) e foto facoltative.
 *
 * Dati: window.PH (vedi data.js). Nessuna dipendenza esterna.
 */
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$, cite = PH.cite, fmt = PH.fmt, rm = PH.rm, root = PH.root;

  PH.initIdentita = function () {
    var P=[{n:'Tartan',b:'repeating-linear-gradient(90deg,rgba(200,29,98,.85) 0 14px,transparent 14px 56px),repeating-linear-gradient(0deg,rgba(27,42,82,.9) 0 14px,transparent 14px 56px),repeating-linear-gradient(45deg,#c4ccd8 0 3px,#dde2e9 3px 6px)'}, {n:'Spina di pesce',s:'24px',b:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Crect width='24' height='24' fill='%23dde2e9'/%3E%3Cpath d='M0 12L12 0l12 12M0 24L12 12l12 12' fill='none' stroke='%231b2a52' stroke-width='6'/%3E%3Cpath d='M0 6L6 0M18 0l6 6M0 18l6-6M18 12l6 6' stroke='%23c81d62' stroke-width='2'/%3E%3C/svg%3E\")"}, {n:'Saia',b:'repeating-linear-gradient(45deg,#1b2a52 0 5px,#c81d62 5px 7px,#dde2e9 7px 14px)'}, {n:'Gessato',b:'repeating-linear-gradient(90deg,#1b2a52 0 21px,#cfd6e4 21px 22px,#1b2a52 22px 43px,#c81d62 43px 44px)'}];
    var sw=$('#swatch');
    function setPat(i) {
      root.style.setProperty('--pat',P[i].b);
      root.style.setProperty('--ps',P[i].s||'auto');
      sw.dataset.n='n. '+(i+1)+' '+P[i].n;
      sw.setAttribute('aria-label','Campione di tessuto: '+P[i].n);
      sw.classList.remove('wv');
      void sw.offsetWidth;
      sw.classList.add('wv');
      [].forEach.call($('#pick').children,function(b,j) {
        b.setAttribute('aria-pressed',j===i)
      })
    }
    $('#pick').innerHTML=P.map(function(p) {
      return '<button type="button">'+p.n+'</button>'
    }).join('');
    $('#pick').addEventListener('click',function(e) {
      var b=e.target.closest('button');
      if(b)setPat([].indexOf.call(this.children,b))
    });
    setPat(0);
    [].forEach.call(document.querySelectorAll('[data-foto]'),function(f) {
      var x=D.foto&&D.foto[f.dataset.foto];
      if(!x || !x.src || !x.cred)return;
      var im=new Image();
      im.alt=x.alt;
      im.loading='lazy';
      im.decoding='async';
      im.onload=function() {
        f.appendChild(im);
        if(x.cred) {
          var c=document.createElement('figcaption');
          c.textContent=x.cred;
          f.appendChild(c)
        }
        f.hidden=false
      };
      im.src=x.src
    });
  };
})(window.PH);
