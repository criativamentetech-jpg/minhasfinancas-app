const CACHE='mf-v17';
const ASSETS=['./MinhasFinancas01.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{})));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  // Network-first: tenta buscar da rede; se falhar, usa cache
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r&&r.status===200){
        const clone=r.clone();
        caches.open(CACHE).then(c=>c.put(e.request,clone));
      }
      return r;
    }).catch(()=>caches.match(e.request))
  );
});
