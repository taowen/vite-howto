# How to publish new version without asking application using the library to re-bundle and re-deploy

## Code Structure & Motivation

Publish the package to CDN as a remote package, so another application can dynamic import it at runtime. This allows the remote package maintainer to publish a new version without asking its user to rebundle and redeploy.

In this example

* publisher: it provide dynamic library at http://localhost:3001/assets/remoteEntry.js
* consumer: it is CSR application, references publisher library
* shared-store: it is a plain old javascript library, shared between publisher / consumer

## DX Problem

Remote package should be able to share javascript object between publisher / consumer at runtime, so that

* frameworks such as Vue/React do not need to bundled several times, they can share one global instance
* data store must be global singleton

During development, we might change publisher and consumer at the same time. There should be a way to edit/debug without go through publishing process.

## UX Problem

Loading library dynamically takes time, there should be way to insert loading indicator

## Solution Walkthrough

refer to https://github.com/originjs/vite-plugin-federation for more information