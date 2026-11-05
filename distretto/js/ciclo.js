/**
 * ciclo.js
 * Ciclo del cardato: anello animato in sei fasi, cliccabile e con pausa.
 *
 * Dati: window.PH (vedi data.js). Nessuna dipendenza esterna.
 */
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$, cite = PH.cite, fmt = PH.fmt, rm = PH.rm, root = PH.root;

  PH.initCiclo = function () {
    var L=$('#loopsvg'),C=D.cardato,cx=280,cy=210,R=140,pos=function(i) {
      var a=(-90+60*i)*Math.PI/180;
      return [cx+R*Math.cos(a),cy+R*Math.sin(a)]
    };
    var g='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="var(--line)" stroke-width="4" stroke-dasharray="2 7" stroke-linecap="round"/>'+ '<circle id="arc" cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="var(--dye)" stroke-width="4" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" transform="rotate(-90 '+cx+' '+cy+')"/>'+ '<text x="'+cx+'" y="'+(cy+6)+'" text-anchor="middle" class="lc">Cardato</text>';
    C.forEach(function(s,i) {
      var p=pos(i),side=i===0?'middle':i===3?'middle':i<3?'start':'end',lx=i===0||i===3?p[0]:p[0]+(i<3?36:-36),ly=i===0?p[1]-38:i===3?p[1]+48:p[1]+5;
      g+='<g class="nd" data-i="'+i+'" tabindex="0" role="button" aria-label="'+PH.esc(s.t)+'"><circle class="hit" cx="'+p[0]+'" cy="'+p[1]+'" r="48"/><circle cx="'+p[0]+'" cy="'+p[1]+'" r="24"/><text class="num" x="'+p[0]+'" y="'+(p[1]+6)+'" text-anchor="middle">'+(i+1)+'</text><text class="lb" x="'+lx+'" y="'+ly+'" text-anchor="'+side+'">'+PH.esc(s.n)+'</text></g>'
    });
    L.innerHTML=g+'<circle id="bead" r="9" cx="'+cx+'" cy="'+(cy-R)+'"/>';
    var f=0,play=!rm,last=0,vis=false,act=-1,arc=$('#arc'),bead=$('#bead');
    function show(i) {
      act=i;
      [].forEach.call(L.querySelectorAll('.nd'),function(n,j) {
        n.classList.toggle('on',j===i);
        n.setAttribute('aria-pressed',j===i);
      });
      $('#loopinfo').innerHTML='<small>Fase '+(i+1)+' di '+C.length+'</small><h3>'+PH.esc(C[i].t)+'</h3><p>'+PH.esc(C[i].d)+'</p><cite>'+cite(C[i].s)+'</cite>'
    }
    function draw() {
      var a=(-90+360*f)*Math.PI/180;
      bead.setAttribute('cx',cx+R*Math.cos(a));
      bead.setAttribute('cy',cy+R*Math.sin(a));
      arc.setAttribute('stroke-dashoffset',1-f);
      var i=Math.floor(f*C.length)%C.length;
      if(i!==act)show(i)
    }
    function tick(t) {
      if(play&&vis)f=(f+Math.min(Math.max(t-last,0),100)/18000)%1;
      last=t;
      if(vis)draw();
      requestAnimationFrame(tick)
    }
    function setPlay(v) {
      play=v;
      $('#loopinfo').parentElement.setAttribute('aria-live',v?'off':'polite');
      $('#loopbtn').textContent=v?'Pausa':'Riprendi'
    }
    if('IntersectionObserver' in window)new IntersectionObserver(function(e) {
      vis=e[0].isIntersecting
    }).observe(L);
    else vis=true;
    L.addEventListener('click',function(e) {
      var n=e.target.closest('.nd');
      if(!n)return;
      f=(+n.dataset.i)/C.length+.001;
      setPlay(false);
      draw()
    });
    L.addEventListener('keydown',function(e) {
      if(e.key==='Enter'||e.key===' ') {
        e.preventDefault();
        var n=e.target.closest('.nd');
        if(n)n.dispatchEvent(new Event('click',{bubbles:true}))
      }
    });
    $('#loopbtn').addEventListener('click',function() {
      setPlay(!play)
    });
    setPlay(play);
    draw();
    requestAnimationFrame(tick);
  };
})(window.PH);
