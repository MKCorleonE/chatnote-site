import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.name==='.git'?[]:e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);
function shape(v){if(Array.isArray(v))return v.map(shape);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,shape(x)]));return typeof v;}
const cn=read('data/zh-Hans.json');for(const l of ['zh-Hant','en'])assert.deepEqual(shape(read(`data/${l}.json`)),shape(cn),`Locale shape: ${l}`);
const versions=read('data/versions.json');assert(versions.versions.some(v=>v.version===versions.latest));assert.equal(versions.repository,'https://github.com/MKCorleonE/ChatNote');
for(const v of versions.versions){assert.match(v.version,/^\d+\.\d+\.\d+$/);for(const f of v.files){assert.match(f.sha256,/^[a-f0-9]{64}$/);assert(f.name.includes(v.version));assert(f.size>0);}}
let links=0,pages=0;for(const file of walk(root)){
 const name=path.relative(root,file);assert(!/\.(exe|db|sqlite|pem|key)$/i.test(name),`Private file: ${name}`);
 if(!file.endsWith('.html'))continue;pages++;const html=fs.readFileSync(file,'utf8');assert(!html.includes('Application source is currently private'),`Stale source status: ${name}`);
 for(const m of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){
  const url=m[1];if(/^(https?:|mailto:|data:|\/)/.test(url))continue;assert(fs.existsSync(path.resolve(path.dirname(file),decodeURIComponent(url.split('?')[0]))),`Missing ${url} in ${name}`);links++;
 }
}
assert.equal(pages,29);for(const dir of ['', 'en/', 'zh-hant/']){const home=fs.readFileSync(path.join(root,dir,'index.html'),'utf8');assert(!/walkthrough\.mp4|demo-player|demo-play/.test(home),'Video removed');assert(home.includes('forest-chapter'));assert(home.includes('downloads.html'));}
console.log(`PASS: 3 locale structures, ${pages} HTML files, ${links} local links, ${versions.versions.length} versions, public application releases, no binary/data leakage.`);

for(const dir of ['', 'en/', 'zh-hant/']){const html=fs.readFileSync(path.join(root,dir,'downloads.html'),'utf8');assert(!/releases\/download\/[^\"]+\/ChatNote_[0-9.]+\.exe/.test(html),'Installer-only download links');assert.equal((html.match(/class=\"download-card\"/g)||[]).length,1);}
