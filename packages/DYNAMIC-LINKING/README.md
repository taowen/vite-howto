# Dynamic Linking

Vite essentially is a static linker to bundle modules as a library or application statically. Sometimes we want dynamic linking:

* [smaller bundle size](./use-big-library-via-cdn/)
* [to support user who do not want `npm install`, who want to use `<script>` instead](./hybrid-npm-package/)
* [publish new version without asking application using the library to rebundle and redeploy](./remote-package/)