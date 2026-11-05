/**
 * aziende.js
 * Imprese reali con fonti esplicite; filtro e ordinamento condivisi con il CSV.
 *
 * Dati: window.PH (vedi data.js). Nessuna dipendenza esterna.
 */
(function (PH) {
  'use strict';
  var D = PH, $ = PH.$, cite = PH.cite, fmt = PH.fmt, rm = PH.rm, root = PH.root;

  PH.initAziende = function () {
    var esc=PH.esc, stato={categoria:'Tutte',filtro:'',ordine:'originale'};
    $('#warn').textContent=D.aziende.length+' imprese reali con fonti consultate. Le schede riportano solo le informazioni indicate nelle fonti; non sono visure camerali e non attestano certificazioni in corso. I campi non riscontrati restano non indicati. Elenco non esaustivo.';
    var cats=['Tutte'].concat(D.aziende.map(function(a) {
      return a.c || 'Non indicata'
    }).filter(function(c,i,a) {
      return a.indexOf(c)===i
    }));
    $('#filters').innerHTML=cats.map(function(c,i) {
      return '<button type="button" data-cat="'+esc(c)+'" aria-pressed="'+(i===0)+'">'+esc(c)+'</button>'
    }).join('');
    PH.aziendeVisibili=function() {
      var parole=PH.norm(stato.filtro).split(/\s+/).filter(Boolean);
      var elenco=D.aziende.filter(function(a) {
        var testo=PH.norm([a.n,a.c||'',a.m||'',PH.companyNote(a)].join(' '));
        return (stato.categoria==='Tutte'||(a.c||'Non indicata')===stato.categoria) && parole.every(function(p) { return testo.indexOf(p)!==-1; });
      });
      if(stato.ordine!=='originale')elenco.sort(function(a,b) { return a.n.localeCompare(b.n,'it')*(stato.ordine==='az'?1:-1); });
      return elenco;
    }
    function draw() {
      var v=PH.aziendeVisibili();
      $('#companies').innerHTML=v.map(function(a) {
        return '<li id="'+esc(PH.companyId(a))+'" tabindex="-1"><span class="tag">Con fonti</span><h3>'+esc(a.n)+'</h3><em>'+esc(a.c||'Categoria non indicata')+' · '+esc(a.m||'Comune non indicato')+'</em><p>'+esc(PH.companyNote(a))+'</p><small>Fonti: '+(a.v||[]).map(function(k) { return cite(k); }).join(' · ')+'</small>'+(a.recordId?'<p><a href="../company.html?id='+encodeURIComponent(a.recordId)+'">Scheda nel Magazine →</a></p>':'')+'</li>';
      }).join('') || '<li>Nessuna azienda corrisponde ai filtri.</li>';
      $('#an').textContent=v.length+' aziende su '+D.aziende.length+'. Il CSV aziende rispecchia questo elenco.';
      [].forEach.call($('#filters').children,function(b) { b.setAttribute('aria-pressed',b.dataset.cat===stato.categoria); });
    }
    PH.mostraAzienda=function(id) {
      stato.categoria='Tutte';stato.filtro='';$('#af').value='';draw();
      var target=document.getElementById(id);
      if(target) { target.focus({preventScroll:true});target.scrollIntoView({behavior:'instant',block:'start'}); }
    };
    draw();
    $('#filters').addEventListener('click',function(e) {
      var b=e.target.closest('button');
      if(!b)return;
      stato.categoria=b.dataset.cat;draw();
    });
    $('#af').addEventListener('input',function() { stato.filtro=this.value;draw(); });
    $('#asort').addEventListener('change',function() { stato.ordine=this.value;draw(); });
    $('#areset').addEventListener('click',function() {
      stato.categoria='Tutte';stato.filtro='';stato.ordine='originale';$('#af').value='';$('#asort').value='originale';draw();
    });
    if(location.hash.indexOf('#azienda-')===0)PH.mostraAzienda(location.hash.slice(1));
  };
})(window.PH);
