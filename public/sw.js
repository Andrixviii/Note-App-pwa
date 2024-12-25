if (!self.define) {
  let e,
    s = {};
  const n = (n, a) => (
    (n = new URL(n + ".js", a).href),
    s[n] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = n), (e.onload = s), document.head.appendChild(e);
        } else (e = n), importScripts(n), s();
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, c) => {
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    let t = {};
    const r = (e) => n(e, i),
      o = { module: { uri: i }, exports: t, require: r };
    s[i] = Promise.all(a.map((e) => o[e] || r(e))).then((e) => (c(...e), t));
  };
}
define(["./workbox-4754cb34"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/1V1UzPdhncPjg_Z83aGBp/_buildManifest.js",
          revision: "af1d8e2ea9661832420fa9207e0c41b1",
        },
        {
          url: "/_next/static/1V1UzPdhncPjg_Z83aGBp/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/111-b920d92675bea709.js",
          revision: "b920d92675bea709",
        },
        {
          url: "/_next/static/chunks/134-d2d0ef816681cd55.js",
          revision: "d2d0ef816681cd55",
        },
        {
          url: "/_next/static/chunks/965-4a74b70e6ce13ead.js",
          revision: "4a74b70e6ce13ead",
        },
        {
          url: "/_next/static/chunks/framework-a6b3d2fb26bce5d1.js",
          revision: "a6b3d2fb26bce5d1",
        },
        {
          url: "/_next/static/chunks/main-ff4a87506b6b84f6.js",
          revision: "ff4a87506b6b84f6",
        },
        {
          url: "/_next/static/chunks/pages/_app-748dc233690becf3.js",
          revision: "748dc233690becf3",
        },
        {
          url: "/_next/static/chunks/pages/_error-fde50cb7f1ab27e0.js",
          revision: "fde50cb7f1ab27e0",
        },
        {
          url: "/_next/static/chunks/pages/dashboard-46954536ffcd88cb.js",
          revision: "46954536ffcd88cb",
        },
        {
          url: "/_next/static/chunks/pages/index-61afe7dcea6ce3aa.js",
          revision: "61afe7dcea6ce3aa",
        },
        {
          url: "/_next/static/chunks/pages/login-280c17899a3dde86.js",
          revision: "280c17899a3dde86",
        },
        {
          url: "/_next/static/chunks/pages/signup-4726d0a01363f54d.js",
          revision: "4726d0a01363f54d",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-8cac0b4b405cede1.js",
          revision: "8cac0b4b405cede1",
        },
        {
          url: "/_next/static/css/6d8e50a58246c644.css",
          revision: "6d8e50a58246c644",
        },
        {
          url: "/_next/static/css/9c2b50a92e53f217.css",
          revision: "9c2b50a92e53f217",
        },
        {
          url: "/android-chrome-192x192.png",
          revision: "3192be84cd49652d0b8627877597f383",
        },
        {
          url: "/android-chrome-512x512.png",
          revision: "29972d59e69f808e7e84d7595a6a4e84",
        },
        {
          url: "/apple-touch-icon.png",
          revision: "68f574507d5b7c471458e7ca4efca26b",
        },
        { url: "/checklist.svg", revision: "77f0674e831a2df8796ff545d0e659d3" },
        {
          url: "/clipboard-icon.svg",
          revision: "c424290e99f5b03f70288a050bcf4b1c",
        },
        { url: "/empty.svg", revision: "bf9ac766d547d54ef503752d98f54fa9" },
        {
          url: "/favicon-16x16.png",
          revision: "6a75840c994d28123f3e8f8b0c4a23b7",
        },
        {
          url: "/favicon-32x32.png",
          revision: "2cd88414e3e5672bc0d572e9d700e361",
        },
        { url: "/favicon.ico", revision: "08d38ca1aa708c97aed6e5c507b995c4" },
        {
          url: "/icon-512x512.jpg",
          revision: "475dc0eecdf51ae3c057950715da49cb",
        },
        { url: "/icons.svg", revision: "f94c36478724da4102a3a47a3412084a" },
        {
          url: "/site.webmanifest",
          revision: "156a2e0e526f53ae92d4af422597588d",
        },
        { url: "/users.svg", revision: "bfa39db2c83110948ea8ddb436498ef5" },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: n,
              state: a,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
