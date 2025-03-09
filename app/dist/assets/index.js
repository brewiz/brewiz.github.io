(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const o of l.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerPolicy&&(l.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?l.credentials="include":s.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(s){if(s.ep)return;s.ep=!0;const l=n(s);fetch(s.href,l)}})();const ge=!1,he=(e,t)=>e===t,be=Symbol("solid-track"),H={equals:he};let se=ce;const N=1,z=2,ie={owned:null,cleanups:null,context:null,owner:null};var v=null;let X=null,me=null,w=null,k=null,j=null,q=0;function U(e,t){const n=w,r=v,s=e.length===0,l=t===void 0?r:t,o=s?ie:{owned:null,cleanups:null,context:l?l.context:null,owner:l},i=s?e:()=>e(()=>I(()=>D(o)));v=o,w=null;try{return R(i,!0)}finally{w=n,v=r}}function L(e,t){t=t?Object.assign({},H,t):H;const n={value:e,observers:null,observerSlots:null,comparator:t.equals||void 0},r=s=>(typeof s=="function"&&(s=s(n.value)),ae(n,s));return[oe.bind(n),r]}function B(e,t,n){const r=Z(e,t,!1,N);F(r)}function pe(e,t,n){se=ye;const r=Z(e,t,!1,N);r.user=!0,j?j.push(r):F(r)}function C(e,t,n){n=n?Object.assign({},H,n):H;const r=Z(e,t,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,F(r),oe.bind(r)}function I(e){if(w===null)return e();const t=w;w=null;try{return e()}finally{w=t}}function we(e){pe(()=>I(e))}function ve(e){return v===null||(v.cleanups===null?v.cleanups=[e]:v.cleanups.push(e)),e}function oe(){if(this.sources&&this.state)if(this.state===N)F(this);else{const e=k;k=null,R(()=>G(this),!1),k=e}if(w){const e=this.observers?this.observers.length:0;w.sources?(w.sources.push(this),w.sourceSlots.push(e)):(w.sources=[this],w.sourceSlots=[e]),this.observers?(this.observers.push(w),this.observerSlots.push(w.sources.length-1)):(this.observers=[w],this.observerSlots=[w.sources.length-1])}return this.value}function ae(e,t,n){let r=e.value;return(!e.comparator||!e.comparator(r,t))&&(e.value=t,e.observers&&e.observers.length&&R(()=>{for(let s=0;s<e.observers.length;s+=1){const l=e.observers[s],o=X&&X.running;o&&X.disposed.has(l),(o?!l.tState:!l.state)&&(l.pure?k.push(l):j.push(l),l.observers&&ue(l)),o||(l.state=N)}if(k.length>1e6)throw k=[],new Error},!1)),t}function F(e){if(!e.fn)return;D(e);const t=q;$e(e,e.value,t)}function $e(e,t,n){let r;const s=v,l=w;w=v=e;try{r=e.fn(t)}catch(o){return e.pure&&(e.state=N,e.owned&&e.owned.forEach(D),e.owned=null),e.updatedAt=n+1,fe(o)}finally{w=l,v=s}(!e.updatedAt||e.updatedAt<=n)&&(e.updatedAt!=null&&"observers"in e?ae(e,r):e.value=r,e.updatedAt=n)}function Z(e,t,n,r=N,s){const l={fn:e,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:v,context:v?v.context:null,pure:n};return v===null||v!==ie&&(v.owned?v.owned.push(l):v.owned=[l]),l}function W(e){if(e.state===0)return;if(e.state===z)return G(e);if(e.suspense&&I(e.suspense.inFallback))return e.suspense.effects.push(e);const t=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<q);)e.state&&t.push(e);for(let n=t.length-1;n>=0;n--)if(e=t[n],e.state===N)F(e);else if(e.state===z){const r=k;k=null,R(()=>G(e,t[0]),!1),k=r}}function R(e,t){if(k)return e();let n=!1;t||(k=[]),j?n=!0:j=[],q++;try{const r=e();return xe(n),r}catch(r){n||(j=null),k=null,fe(r)}}function xe(e){if(k&&(ce(k),k=null),e)return;const t=j;j=null,t.length&&R(()=>se(t),!1)}function ce(e){for(let t=0;t<e.length;t++)W(e[t])}function ye(e){let t,n=0;for(t=0;t<e.length;t++){const r=e[t];r.user?e[n++]=r:W(r)}for(t=0;t<n;t++)W(e[t])}function G(e,t){e.state=0;for(let n=0;n<e.sources.length;n+=1){const r=e.sources[n];if(r.sources){const s=r.state;s===N?r!==t&&(!r.updatedAt||r.updatedAt<q)&&W(r):s===z&&G(r,t)}}}function ue(e){for(let t=0;t<e.observers.length;t+=1){const n=e.observers[t];n.state||(n.state=z,n.pure?k.push(n):j.push(n),n.observers&&ue(n))}}function D(e){let t;if(e.sources)for(;e.sources.length;){const n=e.sources.pop(),r=e.sourceSlots.pop(),s=n.observers;if(s&&s.length){const l=s.pop(),o=n.observerSlots.pop();r<s.length&&(l.sourceSlots[o]=r,s[r]=l,n.observerSlots[r]=o)}}if(e.tOwned){for(t=e.tOwned.length-1;t>=0;t--)D(e.tOwned[t]);delete e.tOwned}if(e.owned){for(t=e.owned.length-1;t>=0;t--)D(e.owned[t]);e.owned=null}if(e.cleanups){for(t=e.cleanups.length-1;t>=0;t--)e.cleanups[t]();e.cleanups=null}e.state=0}function ke(e){return e instanceof Error?e:new Error(typeof e=="string"?e:"Unknown error",{cause:e})}function fe(e,t=v){throw ke(e)}const _e=Symbol("fallback");function ne(e){for(let t=0;t<e.length;t++)e[t]()}function Ce(e,t,n={}){let r=[],s=[],l=[],o=0,i=t.length>1?[]:null;return ve(()=>ne(l)),()=>{let c=e()||[],u=c.length,f,a;return c[be],I(()=>{let $,S,x,P,E,y,_,g,T;if(u===0)o!==0&&(ne(l),l=[],r=[],s=[],o=0,i&&(i=[])),n.fallback&&(r=[_e],s[0]=U(b=>(l[0]=b,n.fallback())),o=1);else if(o===0){for(s=new Array(u),a=0;a<u;a++)r[a]=c[a],s[a]=U(h);o=u}else{for(x=new Array(u),P=new Array(u),i&&(E=new Array(u)),y=0,_=Math.min(o,u);y<_&&r[y]===c[y];y++);for(_=o-1,g=u-1;_>=y&&g>=y&&r[_]===c[g];_--,g--)x[g]=s[_],P[g]=l[_],i&&(E[g]=i[_]);for($=new Map,S=new Array(g+1),a=g;a>=y;a--)T=c[a],f=$.get(T),S[a]=f===void 0?-1:f,$.set(T,a);for(f=y;f<=_;f++)T=r[f],a=$.get(T),a!==void 0&&a!==-1?(x[a]=s[f],P[a]=l[f],i&&(E[a]=i[f]),a=S[a],$.set(T,a)):l[f]();for(a=y;a<u;a++)a in x?(s[a]=x[a],l[a]=P[a],i&&(i[a]=E[a],i[a](a))):s[a]=U(h);s=s.slice(0,o=u),r=c.slice(0)}return s});function h($){if(l[a]=$,i){const[S,x]=L(a);return i[a]=x,t(c[a],S)}return t(c[a])}}}function A(e,t){return I(()=>e(t||{}))}function de(e){const t="fallback"in e&&{fallback:()=>e.fallback};return C(Ce(()=>e.each,e.children,t||void 0))}function Se(e,t,n){let r=n.length,s=t.length,l=r,o=0,i=0,c=t[s-1].nextSibling,u=null;for(;o<s||i<l;){if(t[o]===n[i]){o++,i++;continue}for(;t[s-1]===n[l-1];)s--,l--;if(s===o){const f=l<r?i?n[i-1].nextSibling:n[l-i]:c;for(;i<l;)e.insertBefore(n[i++],f)}else if(l===i)for(;o<s;)(!u||!u.has(t[o]))&&t[o].remove(),o++;else if(t[o]===n[l-1]&&n[i]===t[s-1]){const f=t[--s].nextSibling;e.insertBefore(n[i++],t[o++].nextSibling),e.insertBefore(n[--l],f),t[s]=n[l]}else{if(!u){u=new Map;let a=i;for(;a<l;)u.set(n[a],a++)}const f=u.get(t[o]);if(f!=null)if(i<f&&f<l){let a=o,h=1,$;for(;++a<s&&a<l&&!(($=u.get(t[a]))==null||$!==f+h);)h++;if(h>f-i){const S=t[o];for(;i<f;)e.insertBefore(n[i++],S)}else e.replaceChild(n[i++],t[o++])}else o++;else t[o++].remove()}}}const le="_$DX_DELEGATE";function Ae(e,t,n,r={}){let s;return U(l=>{s=l,t===document?e():d(t,e(),t.firstChild?null:void 0,n)},r.owner),()=>{s(),t.textContent=""}}function m(e,t,n,r){let s;const l=()=>{const i=document.createElement("template");return i.innerHTML=e,i.content.firstChild},o=()=>(s||(s=l())).cloneNode(!0);return o.cloneNode=o,o}function Q(e,t=window.document){const n=t[le]||(t[le]=new Set);for(let r=0,s=e.length;r<s;r++){const l=e[r];n.has(l)||(n.add(l),t.addEventListener(l,Ee))}}function Pe(e,t,n){n==null?e.removeAttribute(t):e.setAttribute(t,n)}function V(e,t){t==null?e.removeAttribute("class"):e.className=t}function Y(e,t,n,r){Array.isArray(n)?(e[`$$${t}`]=n[0],e[`$$${t}Data`]=n[1]):e[`$$${t}`]=n}function d(e,t,n,r){if(n!==void 0&&!r&&(r=[]),typeof t!="function")return K(e,t,r,n);B(s=>K(e,t(),s,n),r)}function Ee(e){let t=e.target;const n=`$$${e.type}`,r=e.target,s=e.currentTarget,l=c=>Object.defineProperty(e,"target",{configurable:!0,value:c}),o=()=>{const c=t[n];if(c&&!t.disabled){const u=t[`${n}Data`];if(u!==void 0?c.call(t,u,e):c.call(t,e),e.cancelBubble)return}return t.host&&typeof t.host!="string"&&!t.host._$host&&t.contains(e.target)&&l(t.host),!0},i=()=>{for(;o()&&(t=t._$host||t.parentNode||t.host););};if(Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return t||document}}),e.composedPath){const c=e.composedPath();l(c[0]);for(let u=0;u<c.length-2&&(t=c[u],!!o());u++){if(t._$host){t=t._$host,i();break}if(t.parentNode===s)break}}else i();l(r)}function K(e,t,n,r,s){for(;typeof n=="function";)n=n();if(t===n)return n;const l=typeof t,o=r!==void 0;if(e=o&&n[0]&&n[0].parentNode||e,l==="string"||l==="number"){if(l==="number"&&(t=t.toString(),t===n))return n;if(o){let i=n[0];i&&i.nodeType===3?i.data!==t&&(i.data=t):i=document.createTextNode(t),n=O(e,n,r,i)}else n!==""&&typeof n=="string"?n=e.firstChild.data=t:n=e.textContent=t}else if(t==null||l==="boolean")n=O(e,n,r);else{if(l==="function")return B(()=>{let i=t();for(;typeof i=="function";)i=i();n=K(e,i,n,r)}),()=>n;if(Array.isArray(t)){const i=[],c=n&&Array.isArray(n);if(J(i,t,n,s))return B(()=>n=K(e,i,n,r,!0)),()=>n;if(i.length===0){if(n=O(e,n,r),o)return n}else c?n.length===0?re(e,i,r):Se(e,n,i):(n&&O(e),re(e,i));n=i}else if(t.nodeType){if(Array.isArray(n)){if(o)return n=O(e,n,r,t);O(e,n,null,t)}else n==null||n===""||!e.firstChild?e.appendChild(t):e.replaceChild(t,e.firstChild);n=t}}return n}function J(e,t,n,r){let s=!1;for(let l=0,o=t.length;l<o;l++){let i=t[l],c=n&&n[e.length],u;if(!(i==null||i===!0||i===!1))if((u=typeof i)=="object"&&i.nodeType)e.push(i);else if(Array.isArray(i))s=J(e,i,c)||s;else if(u==="function")if(r){for(;typeof i=="function";)i=i();s=J(e,Array.isArray(i)?i:[i],Array.isArray(c)?c:[c])||s}else e.push(i),s=!0;else{const f=String(i);c&&c.nodeType===3&&c.data===f?e.push(c):e.push(document.createTextNode(f))}}return s}function re(e,t,n=null){for(let r=0,s=t.length;r<s;r++)e.insertBefore(t[r],n)}function O(e,t,n,r){if(n===void 0)return e.textContent="";const s=r||document.createTextNode("");if(t.length){let l=!1;for(let o=t.length-1;o>=0;o--){const i=t[o];if(s!==i){const c=i.parentNode===e;!l&&!o?c?e.replaceChild(s,i):e.insertBefore(s,n):c&&i.remove()}else l=!0}}else e.insertBefore(s,n);return[s]}function Te(){const[e,t]=L(new Set),[n,r]=L([]),[s,l]=L(!0),[o,i]=L(null),[c,u]=L(!1),[f,a]=L(!1),[h,$]=L(null),S="/api/v1",x=async()=>{try{const b=await fetch("/fixtures/packages.json");if(!b.ok)throw new Error(`HTTP error! status: ${b.status}`);return await b.json()}catch(b){throw console.error("Error fetching packages data:",b),b}},P=async b=>{try{const p=await fetch(`${S}${b}`);if(!p.ok)throw new Error(`HTTP error! status: ${p.status}`);return await p.json()}catch(p){throw console.error(`Error fetching from ${b}:`,p),i(p.message),p}};return{packages:n,loading:s,error:o,refreshing:c,usingLocalData:f,selectedPackages:e,loadPackages:async()=>{try{l(!0),i(null);const b=await P("/packages");r(b),t(new Set),a(!1)}catch{console.warn("API not available, fetching from fixtures");try{const p=await x();r(p),a(!0)}catch(p){console.error("Failed to fetch packages data:",p),i("Failed to load packages data"),r([])}}finally{l(!1)}},refreshPackages:async()=>{try{u(!0),i(null);const b=await P("/reload");r(b),t(new Set),a(!1)}catch{console.warn("API not available, fetching from fixtures");try{const p=await x();r(p),a(!0)}catch(p){console.error("Failed to fetch packages data:",p),i("Failed to load packages data"),r([])}}finally{u(!1)}},resetSelection:()=>t(new Set),togglePackage:b=>{const p=new Set(e());p.has(b.name)?p.delete(b.name):p.add(b.name),t(p)},version:h,loadVersion:async()=>{try{const b=await P("/version");$(b)}catch(b){console.warn("Failed to fetch version info:",b),i("Failed to load version info")}}}}var Le=m('<div class="fixed top-0 left-0 right-0 bg-white shadow-md z-50"><div class="max-w-[1800px] mx-auto px-3 py-2"><div class="flex items-start gap-3"><a href=https://brew.sh target=_blank rel="noopener noreferrer"><img src=/homebrew.svg alt="Homebrew logo"class="w-16 h-16"></a><div class=flex-grow><div class="flex justify-between items-center"><h1 class="text-2xl font-bold"><a href=https://github.com/wstein/brewiz target=_blank rel="noopener noreferrer"class="hover:text-gray-700 hover:underline">Homebrew Package Wizard</a></h1><div class="flex gap-1"><button title="Refresh package list">Refresh</button><button title="Clear selected packages">Reset All</button><button title="Close Brewiz"class="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white">Close</button></div></div><div class="flex justify-between items-center mt-1"><p class="text-gray-600 text-sm">Select packages to install on your macOS system</p><div class="text-xs text-gray-500 flex items-center gap-2"><span></span></div></div></div></div><div><div class=flex-grow>'),je=m('<span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1">'),Ne=m('<div class="flex items-center justify-center p-4"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500">'),Oe=m('<div class="bg-yellow-100 border-2 border-yellow-400 text-yellow-800 rounded-lg p-4"><h3 class=font-bold>Using local package data</h3><p class=text-sm>The API server is not available. Using built-in example data instead.'),Be=m('<div class="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4"><h3 class="font-bold flex items-center"><span class="inline-block w-4 h-4 mr-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>Refreshing brew data...</h3><p>Please wait while we refresh package information.');const M="0.9.5";function De(e){const t=async()=>{try{await fetch("/api/v1/terminate",{method:"POST"}),window.close(),window.opener&&window.opener.close(),window.location.href="about:blank"}catch(n){console.error("Failed to terminate server:",n)}};return(()=>{var n=Le(),r=n.firstChild,s=r.firstChild,l=s.firstChild,o=l.nextSibling,i=o.firstChild,c=i.firstChild,u=c.nextSibling,f=u.firstChild,a=f.firstChild,h=f.nextSibling,$=h.nextSibling,S=i.nextSibling,x=S.firstChild,P=x.nextSibling,E=P.firstChild,y=s.nextSibling,_=y.firstChild;return Y(f,"click",e.onRefresh),d(f,(()=>{var g=C(()=>!!(e.loading||e.refreshing));return()=>g()&&je()})(),a),Y(h,"click",e.onReset),$.$$click=t,d(E,()=>{var g;return M===(((g=e==null?void 0:e.version)==null?void 0:g.brewiz)||M)?`v${M}`:`brewiz v${e.version.brewiz} / v${M}`}),d(_,(()=>{var g=C(()=>!!e.loading);return()=>g()&&Ne()})(),null),d(_,(()=>{var g=C(()=>!!(e.usingLocalData&&!e.loading));return()=>g()&&Oe()})(),null),d(_,(()=>{var g=C(()=>!!(e.refreshing&&!e.loading));return()=>g()&&Be()})(),null),B(g=>{var T=e.loading||e.refreshing,b=`px-4 py-2 rounded-lg ${e.loading||e.refreshing?"bg-gray-300 text-gray-500 cursor-not-allowed":"bg-blue-500 hover:bg-blue-600 text-white"}`,p=!e.selectedPackagesCount,ee=`px-4 py-2 rounded-lg ${e.selectedPackagesCount?"bg-red-500 hover:bg-red-600 text-white":"bg-gray-300 text-gray-500 cursor-not-allowed"}`,te=`${e.loading||e.usingLocalData||e.refreshing?"mt-6 mb-2":"mt-1"} flex justify-between items-end`;return T!==g.e&&(f.disabled=g.e=T),b!==g.t&&V(f,g.t=b),p!==g.a&&(h.disabled=g.a=p),ee!==g.o&&V(h,g.o=ee),te!==g.i&&V(y,g.i=te),g},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),n})()}Q(["click"]);var Ie=m('<div><div class="flex items-center justify-between"><div class="flex items-center gap-2"><h3 class="text-lg font-semibold"></h3></div><div class="flex gap-2"></div></div><p class="text-gray-600 mt-2 text-sm flex-grow">'),Fe=m('<span class=text-yellow-500 title=Recommended><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"fill=currentColor class="w-5 h-5"><path fill-rule=evenodd d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"clip-rule=evenodd>'),Re=m('<a target=_blank rel="noopener noreferrer"class="text-blue-500 hover:text-blue-600 transition-colors"><svg xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"stroke-width=1.5 stroke=currentColor class="w-5 h-5"><path stroke-linecap=round stroke-linejoin=round d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25">'),Me=m('<span class="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full group relative">'),Ue=m('<span class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">cask'),Ve=m('<div class="relative group cursor-help"><div class="text-gray-500 hover:text-gray-700"><svg xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"stroke-width=1.5 stroke=currentColor class="w-5 h-5"><path stroke-linecap=round stroke-linejoin=round d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path></svg></div><div class="absolute z-50 hidden group-hover:block bg-gray-800 text-white text-sm rounded p-2 shadow-lg w-64 right-0 transform -translate-y-3/4"><div>'),He=m('<div class="mt-1 pt-1 border-t border-gray-600">'),ze=m("<div>Version: "),We=m("<b><i> → ");function Ge(e){return(()=>{var t=Ie(),n=t.firstChild,r=n.firstChild,s=r.firstChild,l=r.nextSibling,o=n.nextSibling;return t.$$click=()=>e.onToggle(e.pkg),d(s,()=>e.pkg.name),d(r,(()=>{var i=C(()=>!!e.pkg.recommended);return()=>i()&&Fe()})(),null),d(r,(()=>{var i=C(()=>!!e.pkg.homepage);return()=>i()&&(()=>{var c=Re();return c.$$click=u=>u.stopPropagation(),B(()=>Pe(c,"href",e.pkg.homepage)),c})()})(),null),d(l,(()=>{var i=C(()=>!!e.pkg.tap);return()=>i()&&(()=>{var c=Me();return d(c,()=>e.pkg.tap.split("/")[0]),c})()})(),null),d(l,(()=>{var i=C(()=>!!e.pkg.cask);return()=>i()&&Ue()})(),null),d(l,(()=>{var i=C(()=>!!e.pkg.info);return()=>i()&&(()=>{var c=Ve(),u=c.firstChild,f=u.nextSibling,a=f.firstChild;return u.$$click=h=>h.stopPropagation(),d(a,()=>e.pkg.info,null),d(a,(()=>{var h=C(()=>!!(e.pkg.versions||e.pkg.tap));return()=>h()&&(()=>{var $=He();return d($,(()=>{var S=C(()=>!!e.pkg.versions);return()=>S()&&(()=>{var x=ze();return x.firstChild,d(x,()=>e.pkg.versions,null),d(x,(()=>{var P=C(()=>!!e.pkg.outdated);return()=>P()&&(()=>{var E=We(),y=E.firstChild;return y.firstChild,d(y,()=>e.pkg.latest_version,null),E})()})(),null),x})()})()),$})()})(),null),c})()})(),null),d(o,()=>e.pkg.desc),B(()=>V(t,`p-3 rounded-lg mb-1 cursor-pointer transition-all hover:transform hover:scale-[1.02] h-full flex flex-col ${e.selected?e.pkg.installed?"bg-red-200 border-2 border-red-400 hover:border-red-500 hover:shadow-sm":"bg-green-200 border-2 border-green-400 hover:border-green-500 hover:shadow-sm":e.pkg.installed?e.pkg.outdated?"bg-blue-300 border-2 border-blue-500 hover:border-blue-600 hover:shadow-sm":"bg-blue-100 border-2 border-blue-300 hover:border-blue-400 hover:shadow-sm":"bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm"}`)),t})()}Q(["click"]);var Ke=m('<div class="bg-white rounded-lg shadow-sm overflow-visible"><div class="flex items-center justify-between cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 transition-colors"><div><h2 class="text-xl font-bold"></h2><p class="text-gray-600 text-sm"></p></div><span class="text-2xl text-gray-500">'),qe=m('<div class="p-4 overflow-visible"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 overflow-visible">');function Qe(e){const[t,n]=L(!0);return(()=>{var r=Ke(),s=r.firstChild,l=s.firstChild,o=l.firstChild,i=o.nextSibling,c=l.nextSibling;return s.$$click=()=>n(!t()),d(o,()=>e.category.name),d(i,()=>e.category.desc),d(c,()=>t()?"−":"+"),d(r,(()=>{var u=C(()=>!!t());return()=>u()&&(()=>{var f=qe(),a=f.firstChild;return d(a,A(de,{get each(){return e.category.packages},children:h=>A(Ge,{pkg:h,get selected(){return e.selectedPackages.has(h.name)},onToggle:()=>e.onPackageToggle(h)})})),f})()})(),null),r})()}Q(["click"]);var Xe=m('<div class="max-w-[1800px] mx-auto px-4 py-8 pb-64 mt-32"><div class=space-y-6>');function Ye(e){return(()=>{var t=Xe(),n=t.firstChild;return d(n,A(de,{get each(){return e.packages},children:r=>A(Qe,{category:r,get selectedPackages(){return e.selectedPackages},get onPackageToggle(){return e.onPackageToggle}})})),t})()}function Je(e,t){const n=e.flatMap(l=>l.packages),r=Array.from(t).map(l=>n.find(o=>o.name===l)).filter(Boolean),s=[];return Ze(s,n),r.length===0&&s.length===0?["# Select packages to generate commands"]:(et(s,r),tt(s,r),s)}function Ze(e,t){const n=t.filter(r=>r.outdated).length;n>0&&e.push(`brew upgrade # You have ${n} outdated package${n>1?"s":""}`)}function et(e,t){const n=t.filter(l=>!l.installed),r=n.filter(l=>l.cask).map(l=>l.tap?`${l.tap}/${l.token}`:l.token).sort(),s=n.filter(l=>!l.cask).map(l=>l.tap?`${l.tap}/${l.name}`:l.name).sort();s.length&&e.push(`brew install ${s.join(" ")}`),r.length&&e.push(`brew install --cask ${r.join(" ")}`)}function tt(e,t){const n=t.filter(l=>l.installed),r=n.filter(l=>l.cask).map(l=>l.tap?`${l.tap}/${l.token}`:l.token).sort(),s=n.filter(l=>!l.cask).map(l=>l.tap?`${l.tap}/${l.name}`:l.name).sort();s.length&&e.push(`brew uninstall ${s.join(" ")}`),r.length&&e.push(`brew uninstall --cask ${r.join(" ")}`)}var nt=m('<div class="fixed bottom-0 left-0 right-0 bg-[#282a36] text-[#f8f8f2] shadow-lg z-50"><div class="max-w-[1800px] mx-auto px-4 py-4">'),lt=m('<div class="flex justify-between items-center mb-2"><h3 class="text-lg font-semibold">Brew Commands:</h3><button title="Copy commands to clipboard"class="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm flex items-center gap-2 transition-colors">'),rt=m('<pre class="font-mono text-sm overflow-x-auto rounded bg-[#1e1f29] p-4">'),st=m("<span class=text-[#fe4a56]><i><b>"),it=m("<div><span class=text-[#50fa7b]>brew</span> <span class=text-[#ff79c6]></span> <span class=text-[#f1fa8c]></span><span class=text-[#fe4a56]><i><b>"),ot=m("<div><span class=text-[#50fa7b]>brew</span> <span class=text-[#ff79c6]></span> <span class=text-[#f1fa8c]>");function at(e){const[t,n]=L(""),r=()=>Je(e.categories,e.selectedPackages()),s=async()=>{const o=r().join(`
`);try{await navigator.clipboard.writeText(o),l("Copied!")}catch{l("Failed to copy")}},l=o=>{n(o),setTimeout(()=>n(""),2e3)};return(()=>{var o=nt(),i=o.firstChild;return d(i,A(ct,{copyToClipboard:s,copySuccess:t}),null),d(i,A(ut,{get commands(){return r()}}),null),o})()}function ct(e){return(()=>{var t=lt(),n=t.firstChild,r=n.nextSibling;return Y(r,"click",e.copyToClipboard),d(r,()=>e.copySuccess()||"Copy"),t})()}function ut(e){return(()=>{var t=rt();return d(t,()=>e.commands.map(n=>n.startsWith("#")?A(ft,{text:n}):n.includes("#")?A(dt,{cmd:n}):A(gt,{cmd:n}))),t})()}function ft(e){return(()=>{var t=st(),n=t.firstChild,r=n.firstChild;return d(r,()=>e.text),t})()}function dt(e){const[t,n]=e.cmd.split("#",2),r=t.trim().split(" ");return(()=>{var s=it(),l=s.firstChild,o=l.nextSibling,i=o.nextSibling,c=i.nextSibling,u=c.nextSibling,f=u.nextSibling,a=f.firstChild,h=a.firstChild;return d(i,()=>r[1]),d(u,()=>r.slice(2).join(" ")),d(h,`#${n}`),s})()}function gt(e){const t=e.cmd.split(" ");return(()=>{var n=ot(),r=n.firstChild,s=r.nextSibling,l=s.nextSibling,o=l.nextSibling,i=o.nextSibling;return d(l,()=>t[1]),d(i,()=>t.slice(2).join(" ")),n})()}Q(["click"]);var ht=m('<div class="min-h-screen bg-gray-100">');function bt(){const{packages:e,loading:t,error:n,refreshing:r,usingLocalData:s,selectedPackages:l,version:o,loadPackages:i,refreshPackages:c,resetSelection:u,togglePackage:f,loadVersion:a}=Te();return we(()=>{i(),a()}),(()=>{var h=ht();return d(h,A(De,{get loading(){return t()},get refreshing(){return r()},get error(){return n()},get version(){return o()},onRefresh:c,onReset:u,get selectedPackagesCount(){return l().size},get usingLocalData(){return s()}}),null),d(h,A(Ye,{get packages(){return e()},get selectedPackages(){return l()},onPackageToggle:f}),null),d(h,A(at,{get categories(){return e()},selectedPackages:l}),null),h})()}const mt=document.getElementById("root");Ae(()=>A(bt,{}),mt);
