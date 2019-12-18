// SW Version
const version = '1.8'

// Static Cache - App Shell
const appAssets = [
  'index.html',
  'css/all.css',
  'https://cdn.jsdelivr.net/npm/vue',  
  'images/piano.png',
  'notes/A.mp3',
  'notes/Ab.mp3',
  'notes/B.mp3',
  'notes/Bb.mp3',
  'notes/C.mp3',
  'notes/D.mp3',
  'notes/Db.mp3',
  'notes/E.mp3',
  'notes/Eb.mp3',
  'notes/F.mp3',
  'notes/G.mp3',
  'notes/Gb.mp3',
]

// SW Install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(`static-${version}`)
      .then(cache => cache.addAll(appAssets))
  )
})

// SW Activate
self.addEventListener('activate', e => {
  // Clean static cache
  let cleaned = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== `static-${version}` && key.match('static-')) {
        return caches.delete(key)
      }
    })
  })
  e.waitUntil(cleaned)
})

// Static cache strategy - Cache with Network Fallback
const staticCache = req => {
  return caches.match(req).then(cacheRes => {

    // Return cached response if found
    if (cacheRes) return cacheRes

    // Fall back to network
    return fetch(req).then(networkRes => {

      // Update cache with new response
      caches.open(`static-${version}`)
        .then(cache => cache.put(req, networkRes))

      // Return Clone of Network Response
      return networkRes.clone()
    })

  })
}

// SW Fetch
self.addEventListener('fetch', e => {
  // App shell
  if (e.request.url.match(location.origin)) {
    e.respondWith(staticCache(e.request))
  }
})