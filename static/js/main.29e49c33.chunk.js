(this["webpackJsonpsprite-generator"]=this["webpackJsonpsprite-generator"]||[]).push([[0],{10:function(e,t,n){e.exports=n(19)},15:function(e,t,n){},19:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(7),l=n.n(c),u=(n(15),n(1)),o=n(4),i=n.n(o),s=n(8),m=n.n(s),p=n(28),b=Object(p.a)({container:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(80px, 1fr))",gridRowGap:"10px",gridColumnGap:"5px"}});function f(e){var t=b({}),n=e.onSelect,c=e.currentUrl,l=Object(a.useState)(""),o=Object(u.a)(l,2),i=o[0],s=o[1],p=Object(a.useState)([]),f=Object(u.a)(p,2),d=f[0],E=f[1],g=Object(a.useCallback)((function(){var e=i.split("\n").map((function(e){var t=e.trim().split("$"),n=Object(u.a)(t,2),a=n[0],r=n[1];return a&&r?{name:a,url:r.replace(/^http:/,"https:")}:null})).filter(Boolean);E(e),window.localStorage.setItem("PREV_LIST",JSON.stringify(e))}),[i]),v=Object(a.useCallback)((function(e){window.localStorage.setItem("PREV_CHAP$".concat(d[0].url),e.url),n(e.url)}),[n,d]);Object(a.useEffect)((function(){try{E(JSON.parse(window.localStorage.getItem("PREV_LIST")||"[]"))}catch(e){}}),[]);var w=function(e){var t=Object(a.useRef)();return Object(a.useEffect)((function(){t.current=e})),t.current}(d);return Object(a.useEffect)((function(){if(d.length&&d!==w){var e=window.localStorage.getItem("PREV_CHAP$".concat(d[0].url))||"";e&&n(e)}}),[d,w,n]),r.a.createElement("div",null,r.a.createElement("textarea",{className:"w-full bg-black input mb-2",placeholder:"\u8f93\u5165\u64ad\u653e\u5217\u8868",style:{resize:"none",height:"100px"},value:i,onChange:function(e){return s(e.target.value)}}),r.a.createElement("input",{type:"button",className:"mr-1 btn mb-2",value:"\u52a0\u8f7d\u64ad\u653e\u5217\u8868",onClick:g}),r.a.createElement("div",{className:t.container},d.map((function(e,t){return r.a.createElement("input",{key:t,className:m()(["btn",e.url===c?"btn_selected":""]),type:"button",value:e.name,onClick:function(){return v(e)}})})),r.a.createElement("span",null)))}var d=/([a-zA-Z0-9]+:)?\/*?([^#?/:]+)(:\d+)?([^:#?]*?)(\?[^#]*)?(#.*)?$/;var E=function(){var e=window.localStorage.getItem("PREV_URL")||"",t=Object(a.useState)(e),n=Object(u.a)(t,2),c=n[0],l=n[1],o=Object(a.useState)(""),s=Object(u.a)(o,2),m=s[0],p=s[1],b=Object(a.useRef)(null),E=Object(a.useRef)(null),g=Object(a.useCallback)((function(e){var t=E.current,n=b.current,a=e.trim().match(d);if(n.detachMedia(),a){var r=a[0];"http:"===a[1]&&(r=r.replace(/^http:/,"https:")),l(r),p(r),window.localStorage.setItem("PREV_URL",r),/\.m3u8/.test(r)?(n.attachMedia(t),n.loadSource(r)):(l(r),t.setAttribute("src",r),t.play())}}),[]);return Object(a.useEffect)((function(){var e=new i.a;e.on(i.a.Events.MANIFEST_PARSED,(function(){E.current.play()})),b.current=e}),[]),r.a.createElement("div",null,r.a.createElement("input",{className:"w-full mb-2 bg-black input",id:"url-input",placeholder:"\u89c6\u9891\u94fe\u63a5",onChange:function(e){return l(e.target.value)}}),r.a.createElement("div",{className:"mb-2"},r.a.createElement("input",{id:"replace-video-button",className:"mr-1 btn",type:"button",value:"\u66ff\u6362\u89c6\u9891",onClick:function(){return g(c)}}),r.a.createElement("button",{className:"btn"},r.a.createElement("a",{className:"text-btn",href:"http://www.zuidazy3.net/index.php",target:"resource-center"},"\u8d44\u6e90\u4e2d\u5fc3"))),r.a.createElement("div",{className:"text-center mb-2"},r.a.createElement("video",{className:"w-full",id:"player",ref:E,controls:!0,crossOrigin:"anonymous"})),r.a.createElement(f,{currentUrl:m,onSelect:function(e){return g(e)}}))};l.a.render(r.a.createElement(E,null),document.getElementById("root"))},4:function(e,t){e.exports=window.Hls}},[[10,1,2]]]);
//# sourceMappingURL=main.29e49c33.chunk.js.map