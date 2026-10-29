// Accords : fonctionne hors ligne. La page de l'appli est reprise du réseau quand il y en a (pour les mises à jour), sinon du cache.
const V='accords-v1';
const FILES=['./','index.html','app.html','manifest.webmanifest','icon-192.png','icon-512.png','logo.png','qrcode.js','jsQR.js','pdf.min.js','pdf.worker.min.js','jspdf.umd.min.js','confidentialite.html','conditions.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return; const u=new URL(r.url); if(u.origin!==location.origin)return;   // Google, Spotify, Deezer… : jamais en cache
  if(r.mode==='navigate'||u.pathname.endsWith('.html')){
    e.respondWith(fetch(r).then(res=>{const c=res.clone(); caches.open(V).then(x=>x.put(r,c)); return res;}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('app.html'))));
    return;}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{if(res.ok){const c=res.clone(); caches.open(V).then(x=>x.put(r,c));} return res;})));
});
