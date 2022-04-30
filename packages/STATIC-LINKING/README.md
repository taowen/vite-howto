# Static Linking

Vite statically bundle (link) packages into a application (or a rolled up library). We can use vite to break up a big application into several inter-connected packages. When we need to modify several packages together to implement a new feature, some problem will appear:

* How to compile several typescript packages concurrently
* How to avoid the top integrating package to be over bloated