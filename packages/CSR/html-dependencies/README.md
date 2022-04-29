# HTML Dependencies

vite by default assume `index.html` as entry point. it means:

* `vite dev` will show the `index.html` under root directory, compile `some-ts.ts` referenced by `index.html` on the fly.
* `vite build` will bundle everything `index.html` referenced, so that we have a directory containing just enough assets needed. including
  * mov_bbb.mp4
  * mov_bbb.ogg
  * demo-static.svg
  * some-ts.ts
  * some-js/demo.js
  * some-js/demo-dynamic.svg

  the dependency relationship is discovered via analyze `index.html` tags, such as `<img>`, `<link>`, `<video>`, `<script>`.

  in javascript, we can use `new URL('./demo-dynamic.svg', import.meta.url)` to express dependency as well.

  in css, we can use `@import` to express dependency as well.