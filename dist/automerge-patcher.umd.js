(function(t,o){typeof exports=="object"&&typeof module<"u"?o(exports,require("@automerge/automerge"),require("dot-object"),require("is-plain-object")):typeof define=="function"&&define.amd?define(["exports","@automerge/automerge","dot-object","is-plain-object"],o):(t=typeof globalThis<"u"?globalThis:t||self,o(t.AutomergePatcher={},t.automerge,t.dotObject,t.isPlainObject))})(this,function(t,o,u,l){"use strict";const c=(r,e)=>{if(e.action==="splice")return{action:"del",path:e.path,length:e.values.length};if(e.action==="del"){const[n,...a]=[...e.path].reverse(),i=u.pick(a.reverse().join("."),r)||r;if(l.isPlainObject(i))return{action:"put",path:e.path,conflict:!1,value:i[n]};const f=e.length||1;return{action:"splice",path:e.path,values:i instanceof o.Text?[...Array(f)].map((p,s)=>i.get(Number(n)+s)):[...Array(f)].map((p,s)=>i[Number(n)+s])}}if(e.action==="put"){const n=u.pick(e.path.join("."),r);return n?{action:"put",path:e.path,conflict:!1,value:JSON.parse(JSON.stringify(n))}:{action:"del",path:e.path}}if(e.action==="inc")return{action:"inc",path:e.path,value:-e.value};throw new Error(`Unknown patch action: ${e.action}`)};function v(r,e){if(e.action==="splice"){const[n,...a]=[...e.path].reverse();u.pick(a.reverse().join("."),r).insertAt(Number(n),...e.values);return}if(e.action==="del"){const[n,...a]=[...e.path].reverse(),i=u.pick(a.reverse().join("."),r);if(l.isPlainObject(i)){delete i[n];return}i.deleteAt(Number(n),e.length||1);return}if(e.action==="put"){u.set(e.path.join("."),e.value,r);return}if(e.action==="inc"){u.pick(e.path.join("."),r).increment(e.value);return}throw new Error(`Unknown patch action: ${e.action}`)}t.patch=v,t.unpatch=c,Object.defineProperties(t,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
