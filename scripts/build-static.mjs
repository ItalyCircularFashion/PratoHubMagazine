import { readdir, copyFile, mkdir, rm, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
const root=resolve(import.meta.dirname,'..'),out=join(root,'dist');
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
const allowedRoot=['.nojekyll','favicon.svg','robots.txt','sitemap.xml'];
const roots=(await readdir(root)).filter(n=>n.endsWith('.html')||allowedRoot.includes(n));
let count=0;
async function copy(src,dst){
 const info=await stat(src);
 if(info.isDirectory()){await mkdir(dst,{recursive:true});for(const n of await readdir(src)){if(n.includes('.bak')||n.startsWith('.')||n.endsWith('.zip'))continue;await copy(join(src,n),join(dst,n));}}
 else{await mkdir(resolve(dst,'..'),{recursive:true});await copyFile(src,dst);count++;}
}
for(const f of roots)await copy(join(root,f),join(out,f));
for(const d of ['assets','distretto'])await copy(join(root,d),join(out,d));
console.log(`BUILD PASS: ${count} file pubblicabili in dist/; esclusi DB, backup, ZIP, documenti di lavoro e dipendenze.`);
