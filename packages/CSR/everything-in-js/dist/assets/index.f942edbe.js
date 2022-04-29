const s=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function l(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(e){if(e.ep)return;e.ep=!0;const o=l(e);fetch(e.href,o)}};s();var d="Index Page",a=Object.freeze(Object.defineProperty({__proto__:null,default:d},Symbol.toStringTag,{value:"Module"})),u="About Page",c=Object.freeze(Object.defineProperty({__proto__:null,default:u},Symbol.toStringTag,{value:"Module"}));const m="_blue_15qkp_2";const f="world";var g={hello:f},p="data:application/json;base64,ewogICAgImhlbGxvIjogIndvcmxkIgp9",v=`{
    "hello": "world"
}`,b="/assets/demo-dynamic.d3480e7a.svg";const n=document.createElement("img");n.setAttribute("src",b);n.setAttribute("width","300");document.body.appendChild(n);const y={"./pages/index.tsx":a,"./pages/home/about.tsx":c};document.querySelector("main").innerHTML=`
        <h1>hello</h1>
        <div class="${m}">this is blue</div>
        <div>${p} ${JSON.stringify(g)}</div>
        <pre>${v}</pre>
        <div>${JSON.stringify(y)}</div>
        `;
