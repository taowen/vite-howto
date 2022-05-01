import{l as a,g as i}from"./loadBackInitialState.8c7710d3.js";import"./index.e6166fda.js";async function c(){let t={content:""};t=a();const e=await i();return{title:"Page 2",view:`<div>${t.content}</div>`,initialState:t,hydrate:()=>{document.body.addEventListener("click",()=>{alert(`clicked page 2
`+e.someConfigKey)})}}}export{c as default};
