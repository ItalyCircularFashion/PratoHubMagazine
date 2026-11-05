import { chromium } from '@playwright/test';
import { writeFile, mkdir } from 'node:fs/promises';
const out=process.env.TEST_ARTIFACTS||'test-results/smoke';await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,headless:true,args:['--no-sandbox']});
const pages=['index.html','news.html','article.html','discussions.html','thread.html','questions.html','question.html','events.html','community.html','market.html','aziende.html','company.html?id=mario-bellucci','notifications.html','progetto.html','demo.html'];
const report=[];
for(const width of [1440,920,390,320]){
 const context=await browser.newContext({viewport:{width,height:900},locale:'it-IT',reducedMotion:'reduce'});
 for(const path of pages){
  const p=await context.newPage(),errors=[],failed=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()});});
  const response=await p.goto((process.env.SITE_BASE||'http://127.0.0.1:8765/PratoHubMagazine/')+path,{waitUntil:'networkidle'});await p.waitForFunction(()=>document.documentElement.dataset.siteReady==='true'||['progetto.html','demo.html'].some(n=>location.pathname.endsWith(n)));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(100);
  const data=await p.evaluate(()=>({title:document.title,h1:[...document.querySelectorAll('h1')].map(n=>n.textContent.trim()),overflow:document.documentElement.scrollWidth>innerWidth,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,text:document.body.innerText.length,missingImg:[...document.images].filter(n=>n.complete&&!n.naturalWidth).map(n=>n.src),navLinks:document.querySelectorAll('#primaryNav a').length}));
  report.push({path,width,status:response.status(),errors,failed,...data});
  if(['index.html','aziende.html'].includes(path))await p.screenshot({path:`${out}/${path.split('.')[0]}-${width}.png`});
  console.log(JSON.stringify(report.at(-1)));await p.close();
 }
 await context.close();
}
await browser.close();await writeFile(out+'/smoke.json',JSON.stringify(report,null,2));
const flagged=report.filter(r=>r.errors.length||r.failed.length||r.overflow||r.status!==200||r.missingImg.length);
console.log('SMOKE_RESULT',flagged.length,'flagged of',report.length);process.exitCode=flagged.length?1:0;
