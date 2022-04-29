# Auto reload node server

Vite assumes majority user will write CSR application. It does not have out of box support for node server application. The goal here is:

* `vite dev` should auto reload the node server when we have changed the source
* `vite build` should package every dependency (except node itself), so we do not need to `npm install` again when deploy.