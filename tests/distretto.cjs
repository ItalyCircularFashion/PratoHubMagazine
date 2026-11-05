const {chromium}=require('@playwright/test');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const OUT=process.env.TEST_ARTIFACTS||require('path').join(__dirname,'../test-results/distretto'),URLBASE=process.env.DISTRETTO_BASE||'http://127.0.0.1:8765/PratoHubMagazine/distretto/';
const published=JSON.parse(fs.readFileSync(require('path').join(__dirname,'fixtures/companies.expected.json'),'utf8'));
const results=[],errors=[],net=[];
function ok(label,condition,detail){assert.ok(condition,label+': '+JSON.stringify(detail));results.push({label,pass:true,...(detail===undefined?{}:{detail})});}
function eq(label,a,b){assert.deepEqual(a,b,label);results.push({label,pass:true});}
function csv(s){let out=[],row=[],cell='',quoted=false;s=s.replace(/^\ufeff/,'');for(let i=0;i<s.length;i++){let c=s[i];if(c==='"'){if(quoted&&s[i+1]==='"'){cell+='"';i++}else quoted=!quoted;}else if(c===';'&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&s[i+1]==='\n')i++;row.push(cell);out.push(row);row=[];cell='';}else cell+=c;}row.push(cell);out.push(row);return out;}
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']});
try{
 const ctx=await browser.newContext({viewport:{width:1365,height:900},locale:'it-IT',acceptDownloads:true});
 const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});p.on('response',r=>{if(r.status()>=400)net.push({url:r.url(),status:r.status()})});p.on('requestfailed',r=>net.push({url:r.url(),error:r.failure()?.errorText}));
 async function load(){await p.goto(URLBASE);await p.waitForFunction(()=>window.PH&&document.querySelectorAll('#companies li[id]').length===12);await p.waitForTimeout(1400);}
 async function download(selector,name){const wait=p.waitForEvent('download');await p.locator(selector).click();const d=await wait;const dest=path.join(OUT,name);await d.saveAs(dest);const raw=fs.readFileSync(dest);ok(name+' UTF8 BOM',raw.subarray(0,3).equals(Buffer.from([239,187,191])));return csv(raw.toString('utf8'));}
 await load();
 eq('8 KPI',await p.locator('#stats .stat').count(),8);eq('12 imprese reali',await p.locator('#companies li[id]').count(),12);eq('23 righe dati',await p.locator('#tab tbody tr').count(),23);
 eq('14 moduli originali caricati',await p.locator('script[src^="js/"]').count(),14);
 for(const [selector,count] of Object.entries({'#steps li':6,'#beats li':6,'#loopsvg .nd':6,'#map g':7,'#comuni .com':7,'#timeline li':9,'#certs .cert':9,'#articoli li':4,'#gloss dt':15,'#musei .cert':4,'#eventi li':3}))eq('modulo popolato '+selector,await p.locator(selector).count(),count);
 eq('tutti i frammenti di navigazione esistono',await p.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(id=>!document.getElementById(id))),[]);
 eq('link esterni isolati noopener',await p.locator('a[target="_blank"]').evaluateAll(es=>es.every(a=>a.rel.split(' ').includes('noopener'))),true);
 eq('nessuna dipendenza JS esterna',await p.locator('script[src^="http"]').count(),0);
 eq('3 foto assenti: zero richieste',await p.evaluate(()=>performance.getEntriesByType('resource').filter(x=>/img\/(bisenzio|campolmi|mumat)/.test(x.name)).length),0);
 ok('dato 22000 tonnellate storico 2010',await p.locator('.stat').filter({hasText:'22.000'}).innerText().then(t=>/2010/.test(t)&&/storico/.test(t)));
 ok('periodo dato CR esplicito',await p.locator('.stat').first().innerText().then(t=>/Periodo del dato non indicato nella fonte/.test(t)));
 ok('Museo 1975 fonte istituzionale',await p.locator('#timeline').innerText().then(t=>t.includes('1975')&&!t.includes('1997')));
 eq('nessuna Verificata nelle schede',await p.locator('#companies .tag').allTextContents(),Array(12).fill('Con fonti'));
 const expected=published.map(c=>c.name);
 eq('nomi array PH.aziende',await p.evaluate(()=>PH.aziende.map(a=>a.n)),expected);
 ok('fonti e categorie effettive',await p.evaluate(()=>PH.aziende.every(a=>a.v.length&&a.v.every(k=>PH.safeUrl(PH.sources[k].u)))));
 eq('sedi corrette e non indicate',await p.evaluate(()=>Object.fromEntries(PH.aziende.map(a=>[a.n,a.m]))),Object.fromEntries(published.map(c=>[c.name,c.city])));
 const cats=await p.locator('#filters button').allTextContents();
 for(const c of cats){await p.locator('#filters button').filter({hasText:new RegExp('^'+c+'$')}).click();let got=await p.evaluate(()=>[...document.querySelectorAll('#companies h3')].map(x=>x.textContent));let exp=await p.evaluate(c=>PH.aziende.filter(a=>c==='Tutte'||a.c===c).map(a=>a.n),c);eq('filtro categoria '+c,got,exp);}
 await p.locator('#areset').click();await p.locator('#af').fill('BÌAGIOLI');eq('ricerca aziende senza accenti',await p.locator('#companies h3').allTextContents(),['Filati Biagioli Modesto']);
 await p.locator('#af').fill('nessun-risultato-xyz');ok('stato vuoto aziende',await p.locator('#companies').innerText().then(t=>t.includes('Nessuna azienda')));
 let empty=await download('#csva','aziende-empty.csv');eq('CSV vuoto sola intestazione',empty.length,1);
 await p.locator('#areset').click();await p.locator('#filters button[data-cat="Filati"]').click();await p.locator('#asort').selectOption('za');
 let shown=await p.locator('#companies h3').allTextContents();eq('sort aziende ZA',shown,published.filter(c=>c.specialization==='Filati').map(c=>c.name).sort((a,b)=>b.localeCompare(a,'it')));
 let aCsv=await download('#csva','aziende-filati-ZA.csv');eq('CSV aziende rispetta filtro e ordine',aCsv.slice(1).map(r=>r[0]),shown);
 await p.locator('#asort').selectOption('az');eq('sort aziende AZ',await p.locator('#companies h3').allTextContents(),[...shown].reverse());
 await p.locator('#af').fill('pecci');await p.locator('#cbtn').click();await p.locator('#q').fill('Gruppo Colle');await p.locator('#cris a[href="#azienda-gruppo-colle"]').click();
 eq('ricerca globale chiude dialog',await p.locator('#cerca').evaluate(d=>d.open),false);
 eq('ricerca globale raggiunge scheda e focus',await p.evaluate(()=>document.activeElement.id),'azienda-gruppo-colle');eq('ricerca azzera filtro categoria',await p.locator('#filters [aria-pressed="true"]').innerText(),'Tutte');eq('ricerca azzera campo aziende',await p.locator('#af').inputValue(),'');
 ok('scheda trovata sotto header',await p.locator('#azienda-gruppo-colle').evaluate(e=>e.getBoundingClientRect().top>=document.querySelector('.top').getBoundingClientRect().bottom));
 await p.locator('#cbtn').click();await p.locator('#q').fill('insesistente-xyz');eq('ricerca globale vuota',await p.locator('#cn').innerText(),'Nessun risultato');await p.keyboard.press('Escape');
 await p.locator('#af').focus();await p.keyboard.type('/');eq('slash non intercetta input',await p.locator('#cerca').evaluate(d=>d.open),false);await p.locator('#areset').click();
 await p.locator('#tf').fill('Variazione');eq('filtro 8 variazioni',await p.locator('#tab tbody tr').count(),8);
 await p.locator('#tab button[data-k="val"]').click();let values=await p.locator('#tab tbody .n').allTextContents();eq('sort numerico crescente percentuali',values,['−25,2%','−5,2%','−4,4%','−4%','−2,9%','−2,5%','−1,1%','+2,7%']);
 await p.locator('#tab button[data-k="val"]').click();let desc=await p.locator('#tab tbody .n').allTextContents();eq('sort numerico decrescente',desc,[...values].reverse());
 let dCsv=await download('#csvd','dati-variazioni-DESC.csv');eq('CSV dati rispetta filtro e sort',dCsv.slice(1).map(r=>r[2]),desc);eq('percentuale positiva non distrutta',dCsv[1][2],'+2,7%');eq('percentuali negative non distrutte',dCsv.at(-1)[2],'−25,2%');
 await p.locator('#tf').fill('xyz-no-match');ok('stato vuoto dati',await p.locator('#tab tbody').innerText().then(t=>t.includes('Nessun dato')));eq('CSV dati vuoto', (await download('#csvd','dati-empty.csv')).length,1);
 await p.locator('#treset').click();eq('reset tabella 23 righe',await p.locator('#tab tbody tr').count(),23);
 for(const k of ['tipo','ind','per','fonteN']){await p.locator('#tab button[data-k="'+k+'"]').click();let asc=await p.locator('#tab tbody tr').allTextContents();await p.locator('#tab button[data-k="'+k+'"]').click();let rev=await p.locator('#tab tbody tr').allTextContents();ok('sort bidirezionale '+k,asc.length===rev.length&&asc.join('|')!==rev.join('|'));}
 await p.locator('#treset').click();await p.locator('#tab button[data-k="val"]').click();let tonnes=await p.locator('#tab tbody tr').evaluateAll(rs=>rs.filter(r=>/^(22\.000 t|5,8 mln t)$/.test(r.children[2].textContent)).map(r=>r.children[2].textContent));eq('unità tonnellate con fattori milioni',tonnes,['22.000 t','5,8 mln t']);
 await p.locator('#pick button').filter({hasText:'Gessato'}).click();eq('selettore tessuto e aria-pressed',await p.locator('#pick [aria-pressed="true"]').innerText(),'Gessato');ok('pattern aggiornato',await p.locator('#swatch').getAttribute('aria-label').then(t=>t.includes('Gessato')));
 await p.locator('#map [data-c="Cantagallo"]').focus();await p.keyboard.press('Enter');eq('mappa tastiera seleziona comune',await p.locator('#comuni [data-c="Cantagallo"]').getAttribute('aria-pressed'),'true');
 await p.locator('#loopsvg .nd[data-i="4"]').click();eq('ciclo clicca tessitura',await p.locator('#loopinfo h3').innerText(),'Tessitura');eq('ciclo pausa manuale',await p.locator('#loopbtn').innerText(),'Riprendi');
 await p.locator('#loopsvg .nd[data-i="2"]').focus();await p.keyboard.press('Space');eq('ciclo tastiera fase3',await p.locator('#loopinfo h3').innerText(),'Sfilacciatura');
 await p.locator('#loopbtn').click();eq('ciclo riprende',await p.locator('#loopbtn').innerText(),'Pausa');await p.locator('#loopbtn').click();
 await p.locator('#loopbtn').click();await p.locator('#loopsvg').scrollIntoViewIfNeeded();await p.waitForTimeout(250);let bead1=await p.locator('#bead').getAttribute('cx');await p.waitForTimeout(300);let bead2=await p.locator('#bead').getAttribute('cx');ok('ciclo animato avanza realmente',bead1!==bead2,{bead1,bead2});await p.locator('#loopbtn').click();
 await p.evaluate(()=>{let s=document.querySelector('.story');window.scrollTo({top:s.offsetTop+(s.offsetHeight-innerHeight)*.76,behavior:'instant'});});await p.waitForTimeout(80);eq('racconto scroll attiva tappa5',await p.locator('#beats li.on small').innerText(),'Fonte del 2010 · dato storico');
 await p.locator('#aziende').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(OUT,'desktop-aziende.png')});
 for(const width of [1365,820,768,390,320]){
  await p.setViewportSize({width,height:900});await p.waitForTimeout(250);
  let geo=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,navScroll:document.querySelector('nav').scrollWidth,navClient:document.querySelector('nav').clientWidth,tableScroll:document.querySelector('.tw').scrollWidth,tableClient:document.querySelector('.tw').clientWidth}));
  eq('no overflow pagina '+width,geo.scroll,geo.width);ok('tabella scroll controllato '+width,geo.tableScroll>=geo.tableClient,geo);
  if(width===320){let hits=await p.locator('.nd .hit,#map .hit').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().width));ok('target SVG >=44px mobile',Math.min(...hits)>=44,{min:Math.min(...hits)});}
 }
 await p.locator('#glossario').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(OUT,'mobile-320-glossario.png')});await p.locator('#aziende').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(OUT,'mobile-320-aziende.png')});
 await p.locator('#cbtn').click();await p.locator('#q').fill('lana');await p.screenshot({path:path.join(OUT,'mobile-320-ricerca.png')});let dlg=await p.locator('#cerca').evaluate(e=>({left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right,width:innerWidth}));ok('dialog resta nel viewport320',dlg.left>=0&&dlg.right<=dlg.width,dlg);await p.keyboard.press('Escape');
 await p.evaluate(()=>{window.scrollTo({top:0,behavior:'instant'});document.querySelector('nav').scrollLeft=0});await p.screenshot({path:path.join(OUT,'mobile-320-top.png')});
 // Test di sicurezza su fixture solo in memoria, mai nei dati pubblicati.
 await load();
 let security=await p.evaluate(()=>{PH.sources.__test={n:'<img src=x onerror="window.PWNED=1">',u:'javascript:alert(1)'};let el=document.createElement('div');el.id='test-cite';el.innerHTML=PH.cite('__test','<svg onload="window.PWNED=2">');document.body.append(el);return {links:el.querySelectorAll('a').length,images:el.querySelectorAll('img,svg').length,text:el.textContent,zero:PH.fmt(0)};});
 eq('cite blocca javascript URL',security.links,0);eq('cite escape testo e attributi',security.images,0);eq('zero percentuale senza segno meno',security.zero,'0%');
 await p.evaluate(()=>{let base=PH.aziende[0];['=1+1','+cmd','@SUM(A1)','-cmd','\t=2','+2,7%','-25.2'].forEach((n,i)=>PH.aziende.push({...base,n:n,f:'fixture sicurezza '+i}));document.querySelector('#af').value='fixture sicurezza';document.querySelector('#af').dispatchEvent(new Event('input'));});
 let sec=await download('#csva','security-fixtures.csv');let names=sec.slice(1).map(r=>r[0]);eq('CSV neutralizza = + @ - tabulazione',names.slice(0,5),["'=1+1","'+cmd","'@SUM(A1)","'-cmd","'\t=2"]);eq('CSV preserva numeri firmati',names.slice(5),['+2,7%','-25.2']);
 await p.evaluate(()=>{let a=PH.aziende[0];a.n='<img src=x onerror="window.PWNED=3">';a.f='<svg onload="window.PWNED=4">';document.querySelector('#af').value='';document.querySelector('#af').dispatchEvent(new Event('input'));});
 eq('render aziende escape markup',await p.locator('#companies img,#companies svg').count(),0);eq('nessuna esecuzione HTML iniettato',await p.evaluate(()=>window.PWNED||0),0);
 await load();await p.keyboard.press('Tab');eq('skip link primo Tab',await p.evaluate(()=>document.activeElement.className),'skip-link');await p.keyboard.press('Enter');eq('skip focus main',await p.evaluate(()=>document.activeElement.id),'top');
 await p.locator('#cbtn').focus();await p.keyboard.press('/');eq('scorciatoia slash apre dialog',await p.locator('#cerca').evaluate(d=>d.open),true);await p.keyboard.press('Escape');eq('Escape ripristina focus Cerca',await p.evaluate(()=>document.activeElement.id),'cbtn');
 // Link ritorno relativo alla root del project site, senza navigare pagine del parent.
 eq('ritorno Magazine subpath corretto',await p.locator('footer a').first().getAttribute('href'),'../index.html');
 for(const theme of ['light','dark']){
  const c=await browser.newContext({viewport:{width:390,height:844},locale:'it-IT',colorScheme:theme,reducedMotion:'reduce'});const q=await c.newPage();q.on('pageerror',e=>errors.push(theme+':'+e.message));await q.goto(URLBASE);await q.waitForTimeout(200);
  eq('reduced motion niente swatch animation '+theme,await q.locator('#swatch').evaluate(e=>getComputedStyle(e).animationName),'none');eq('reduced motion racconto statico '+theme,await q.locator('.story').evaluate(e=>e.classList.contains('sc')),false);eq('reduced motion ciclo fermo '+theme,await q.locator('#loopbtn').innerText(),'Riprendi');
  eq('reduced motion contenuti visibili '+theme,await q.locator('#stats .stat').evaluateAll(es=>es.every(e=>getComputedStyle(e).opacity==='1')),true);
  let contrast=await q.evaluate(()=>{function lum(s){let a=s.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*a[0]+.7152*a[1]+.0722*a[2]}function ratio(a,b){let x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}let num=document.querySelector('.nd.on .num'),circ=document.querySelector('.nd.on circle:not(.hit)'),badge=document.querySelector('#companies .tag'),body=getComputedStyle(document.body),tag=getComputedStyle(badge);return {body:ratio(body.color,body.backgroundColor),muted:ratio(getComputedStyle(document.querySelector('.lead')).color,body.backgroundColor),cycle:ratio(getComputedStyle(num).fill,getComputedStyle(circ).fill),badge:ratio(tag.color,tag.backgroundColor),badgeColors:[tag.color,tag.backgroundColor]};});
  ok('contrasto body/muted/badge AA '+theme,contrast.body>=4.5&&contrast.muted>=4.5&&contrast.badge>=4.5,contrast);ok('contrasto numeri ciclo AA '+theme,contrast.cycle>=4.5,contrast);
  await q.locator('#aziende').scrollIntoViewIfNeeded();await q.screenshot({path:path.join(OUT,'mobile-'+theme+'-aziende.png')});await c.close();
 }
 const nj=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}});const n=await nj.newPage();await n.goto(URLBASE);eq('no-JS fallback visibile',await n.locator('noscript').isVisible(),true);eq('no-JS niente overflow',await n.evaluate(()=>document.documentElement.scrollWidth),320);await nj.close();
 eq('errori runtime/console',errors,[]);eq('errori risorse locali',net.filter(r=>r.url.startsWith('http://127.0.0.1')),[]);
 fs.writeFileSync(path.join(OUT,'results.json'),JSON.stringify({status:'PASS',checks:results.length,results,errors,network:net},null,2));console.log(JSON.stringify({status:'PASS',checks:results.length,errors,network:net,artifacts:OUT},null,2));
}finally{await browser.close()}
})().catch(e=>{fs.writeFileSync(path.join(OUT,'results-failure.json'),JSON.stringify({status:'FAIL',completed:results.length,results,errors,net,error:e.stack},null,2));console.error(e.stack);process.exit(1)});
