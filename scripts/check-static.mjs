import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, join, dirname, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
const root=resolve(import.meta.dirname,'..'),errors=[],files=[];
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){if(e.name.startsWith('.')||['node_modules','dist','docs','tests','test-results'].includes(e.name)||e.name.includes('.bak'))continue;const p=join(dir,e.name);if(e.isDirectory())await walk(p);else files.push(p);}}
await walk(root);
let js=0,links=0;
for(const p of files){
 if(/\.(?:m?js)$/.test(p)){const r=spawnSync(process.execPath,['--check',p],{encoding:'utf8'});js++;if(r.status)errors.push(relative(root,p)+': '+r.stderr);}
 if(!p.endsWith('.html'))continue;
 const text=await readFile(p,'utf8');
 if((text.match(/<h1\b/gi)||[]).length!==1)errors.push(relative(root,p)+': deve contenere un h1');
 const ids=[...text.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);if(new Set(ids).size!==ids.length)errors.push(relative(root,p)+': id duplicati');
 for(const m of text.matchAll(/\b(?:src|href)="([^"]*)"/g)){
  const href=m[1];if(!href||/^(https?:|data:|tel:|mailto:|#)/.test(href))continue;
  const name=decodeURIComponent(href.split(/[?#]/)[0]);if(!name)continue;
  const target=name.startsWith('/PratoHubMagazine/')?join(root,name.slice('/PratoHubMagazine/'.length)):resolve(dirname(p),name);
  try{const s=await stat(target);if(s.isDirectory())await stat(join(target,'index.html'));links++;}catch{errors.push(relative(root,p)+': risorsa mancante '+href);}
 }
}
const sources=files.filter(p=>p.endsWith('.js')||p.endsWith('.html')||p.endsWith('.json'));
for(const p of sources){const s=await readFile(p,'utf8');if(/ghp_[A-Za-z0-9]{20}|-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----|DEMO — Azienda tessile|IT00112233440/.test(s))errors.push(relative(root,p)+': token vietato o società fittizia');}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`STATIC PASS: ${js} script controllati, ${links} riferimenti locali risolti, un h1 per pagina, nessuna azienda sintetica rilevata.`);
