import ts from 'typescript';
import {enbookmarklet, loadConfig} from './enbookmarklet';

test('script1.ts', () => {
  expect(enbookmarklet(['test/script1.ts'])).toBe('javascript:(()=>{})()');
});
test('script1.ts optiions', () => {
  expect(enbookmarklet(['test/script1.ts'], {})).toBe('javascript:(()=>{})()');
});
test('script2.ts', () => {
  expect(enbookmarklet(['test/script2.ts'])).toBe(
    'javascript:(()=>{function e(e){throw new Error(e)}function t(e){e.parentElement&&e.parentElement.removeChild(e)}function n(e){let t;document.addEventListener("dragstart",n=>{(!n.target||n.target instanceof Node)&&e.contains(n.target)&&n.dataTransfer&&(t={x:n.clientX-a(e.style.left),y:n.clientY-a(e.style.top)},n.dataTransfer.effectAllowed="move",n.dataTransfer.setDragImage(new Image,0,0))}),document.addEventListener("dragend",n=>{t&&n.target===e&&(n.preventDefault(),t=void 0)}),document.addEventListener("dragover",n=>{t&&(n.preventDefault(),e.style.left=c(n.clientX-t.x),e.style.top=c(n.clientY-t.y))})}function o(e){e.addEventListener("blur",()=>setTimeout(()=>{e.contains(document.activeElement)||t(e)})),window.addEventListener("blur",()=>t(e))}function d(e,t){const n=e.addEventListener;e.addEventListener=function(...o){n.apply(this,o),t(()=>e.removeEventListener.apply(e,o))},setTimeout(()=>e.addEventListener=n)}function i(e){const t=document.createElement(e),n=[];new MutationObserver((e,o)=>{for(const d of e)for(const e of d.removedNodes)if(e===t){for(const e of n.reverse())e();return void o.disconnect()}}).observe(document.body,{childList:!0});const o=e=>{n.push(e)};return d(document,o),d(window,o),t}function r(e,t,n){const o=document.createElement("button");return o.appendChild(document.createTextNode(e)),o.title=t,Object.assign(o.style,{marginLeft:"3px",borderRadius:"10px",padding:0}),o.addEventListener("click",n),o}function a(e){var t,n;return+(null!==(n=null===(t=e.match(/^-?\\d+(?:\\.\\d+)?(?=px$)/))||void 0===t?void 0:t[0])&&void 0!==n?n:0)}function c(e){return e.toFixed(2).replace(/(?:(?<=\\.\\d*[1-9])|\\.)0+$/,"")+"px"}!function(){var t;if("ontitlechange"in document)return;let n=null!==(t=document.querySelector("head>title"))&&void 0!==t?t:e("title not found");Object.defineProperty(document,"title",{get:()=>n.text,set(e){const t=n.text;n.text=e,this.dispatchEvent(new CustomEvent("titlechange",{detail:{newTitle:e,oldTitle:t}}))}}),document.ontitlechange=null,document.addEventListener("titlechange",e=>{var t;return null===(t=document.ontitlechange)||void 0===t?void 0:t.call(document,e)})}();const l=i("div");Object.assign(l.style,{border:"black solid 1px",borderRadius:"5px",color:"black",backgroundColor:"white",position:"fixed",top:"0",left:"0",zIndex:"2147483647",padding:"15px 5px 5px"}),l.appendChild(document.createTextNode(document.title)),l.appendChild(r("\\ud83d\\udccb","\\u30af\\u30ea\\u30c3\\u30d7\\u30dc\\u30fc\\u30c9\\u306b\\u30b3\\u30d4\\u30fc",()=>{navigator.clipboard.writeText(document.title),t(l)})),l.appendChild(r("\\u274c","\\u9589\\u3058\\u308b",()=>t(l))),o(l);const s=document.createElement("div");Object.assign(s.style,{position:"absolute",top:0,left:0,width:"100%",height:"10px",backgroundColor:"gray",borderRadius:"4px 4px 0 0"}),s.draggable=!0,l.appendChild(s),n(l),document.body.appendChild(l),l.focus();})()'
  );
});
test('script2.ts options', () => {
  expect(
    enbookmarklet(['test/script2.ts'], {
      target: ts.ScriptTarget.ES2018,
      lib: ['lib.esnext.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
      strict: true,
      strictNullChecks: true,
    })
  ).toBe(
    'javascript:(()=>{function e(e){throw new Error(e)}function t(e){e.parentElement&&e.parentElement.removeChild(e)}function n(e){let t;document.addEventListener("dragstart",n=>{(!n.target||n.target instanceof Node)&&e.contains(n.target)&&n.dataTransfer&&(t={x:n.clientX-a(e.style.left),y:n.clientY-a(e.style.top)},n.dataTransfer.effectAllowed="move",n.dataTransfer.setDragImage(new Image,0,0))}),document.addEventListener("dragend",n=>{t&&n.target===e&&(n.preventDefault(),t=void 0)}),document.addEventListener("dragover",n=>{t&&(n.preventDefault(),e.style.left=c(n.clientX-t.x),e.style.top=c(n.clientY-t.y))})}function o(e){e.addEventListener("blur",()=>setTimeout(()=>{e.contains(document.activeElement)||t(e)})),window.addEventListener("blur",()=>t(e))}function d(e,t){const n=e.addEventListener;e.addEventListener=function(...o){n.apply(this,o),t(()=>e.removeEventListener.apply(e,o))},setTimeout(()=>e.addEventListener=n)}function i(e){const t=document.createElement(e),n=[];new MutationObserver((e,o)=>{for(const d of e)for(const e of d.removedNodes)if(e===t){for(const e of n.reverse())e();return void o.disconnect()}}).observe(document.body,{childList:!0});const o=e=>{n.push(e)};return d(document,o),d(window,o),t}function r(e,t,n){const o=document.createElement("button");return o.appendChild(document.createTextNode(e)),o.title=t,Object.assign(o.style,{marginLeft:"3px",borderRadius:"10px",padding:0}),o.addEventListener("click",n),o}function a(e){var t,n;return+(null!==(n=null===(t=e.match(/^-?\\d+(?:\\.\\d+)?(?=px$)/))||void 0===t?void 0:t[0])&&void 0!==n?n:0)}function c(e){return e.toFixed(2).replace(/(?:(?<=\\.\\d*[1-9])|\\.)0+$/,"")+"px"}!function(){var t;if("ontitlechange"in document)return;let n=null!==(t=document.querySelector("head>title"))&&void 0!==t?t:e("title not found");Object.defineProperty(document,"title",{get:()=>n.text,set(e){const t=n.text;n.text=e,this.dispatchEvent(new CustomEvent("titlechange",{detail:{newTitle:e,oldTitle:t}}))}}),document.ontitlechange=null,document.addEventListener("titlechange",e=>{var t;return null===(t=document.ontitlechange)||void 0===t?void 0:t.call(document,e)})}();const l=i("div");Object.assign(l.style,{border:"black solid 1px",borderRadius:"5px",color:"black",backgroundColor:"white",position:"fixed",top:"0",left:"0",zIndex:"2147483647",padding:"15px 5px 5px"}),l.appendChild(document.createTextNode(document.title)),l.appendChild(r("\\ud83d\\udccb","\\u30af\\u30ea\\u30c3\\u30d7\\u30dc\\u30fc\\u30c9\\u306b\\u30b3\\u30d4\\u30fc",()=>{navigator.clipboard.writeText(document.title),t(l)})),l.appendChild(r("\\u274c","\\u9589\\u3058\\u308b",()=>t(l))),o(l);const s=document.createElement("div");Object.assign(s.style,{position:"absolute",top:0,left:0,width:"100%",height:"10px",backgroundColor:"gray",borderRadius:"4px 4px 0 0"}),s.draggable=!0,l.appendChild(s),n(l),document.body.appendChild(l),l.focus();})()'
  );
});

test('script2.ts options.ESNext', () => {
  const spyLog = jest.spyOn(console, 'warn')
  spyLog.mockImplementation(x => x)
  expect(
   ()=> enbookmarklet(['test/script2.ts'], {
      target: ts.ScriptTarget.ESNext,
      lib: ['lib.esnext.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
      strict: true,
      strictNullChecks: true,
      alwaysStrict: true,
      noImplicitUseStrict: false,
      module: ts.ModuleKind.AMD,
      moduleResolution: ts.ModuleResolutionKind.Classic,
    })
  ).toThrowError(/^UglifyError\b/);
  expect(console.warn).toBeCalled();
});
test('script3.ts', () => {
  expect(() => enbookmarklet(['test/script3.ts'])).toThrowError(/^SemanticError\b/);
});
test('loadConfig', () => {
  expect(loadConfig(undefined)).toBeUndefined();
});
test('loadConfig', () => {
  const configFilePath = 'test/tsconfig.json';
  expect(loadConfig(configFilePath)).toEqual({
    configFilePath,
    target: ts.ScriptTarget.ES2018,
    lib: ['lib.esnext.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
    strict: true,
    strictNullChecks: true,
  });
});
test('loadConfig non-existent', () => {
  expect(() => loadConfig('non-existent-directory/tsconfig.json')).toThrowError();
});
test('loadConfig tsconfig-error', () => {
  expect(() => loadConfig('test/tsconfig-error.json')).toThrowError();
});