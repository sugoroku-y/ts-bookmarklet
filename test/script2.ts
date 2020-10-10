function  throwError(message?: string): never {
  throw new Error(message);
}
// タイトル変更時のイベントを追加する
interface DetailTitleChangeEvent {
  oldTitle: string;
  newTitle: string;
}
interface Document {
  ontitlechange?: null | ((ev: CustomEvent<DetailTitleChangeEvent>) => unknown);
}
(function setupOnTitleChange() {
  if ('ontitlechange' in document) {
    return;
  }
  let title =
    (document.querySelector('head>title') as HTMLTitleElement) ??
    throwError('title not found');
  Object.defineProperty(document, 'title', {
    get() {
      return title.text;
    },
    set(newTitle: string) {
      const oldTitle = title.text;
      title.text = newTitle;
      this.dispatchEvent(
        new CustomEvent<DetailTitleChangeEvent>('titlechange', {
          detail: {newTitle, oldTitle},
        })
      );
    },
  });
  // ontitlechangeが設定されてたら実行するように
  document.ontitlechange = null;
  document.addEventListener('titlechange', (ev: Event) =>
    document.ontitlechange?.(ev as CustomEvent<DetailTitleChangeEvent>)
  );
})();
// 安全に要素を除去する
function disposeElement(div: HTMLElement): void {
  if (div.parentElement) {
    div.parentElement.removeChild(div);
  }
}
// 指定の要素をドラッグで移動可能にする
function endraggable(div: HTMLElement): void {
  let offset: {x: number; y: number} | undefined;
  document.addEventListener('dragstart', ev => {
    if (ev.target && !(ev.target instanceof Node)) {
      return;
    }
    if (!div.contains(ev.target)) {
      return;
    }
    if (!ev.dataTransfer) {
      return;
    }
    offset = {
      x: ev.clientX - pxToNumber(div.style.left),
      y: ev.clientY - pxToNumber(div.style.top),
    };
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setDragImage(new Image(), 0, 0);
  });
  document.addEventListener('dragend', ev => {
    if (!offset || ev.target !== div) {
      return;
    }
    ev.preventDefault();
    offset = undefined;
  });
  document.addEventListener('dragover', ev => {
    if (!offset) {
      return;
    }
    ev.preventDefault();
    div.style.left = numberToPx(ev.clientX - offset.x);
    div.style.top = numberToPx(ev.clientY - offset.y);
  });
}
// フォーカスを失ったら閉じるように
function disposeOnBlur(div: HTMLElement): void {
  div.addEventListener('blur', () =>
    // blurイベント内でactiveElementをチェックしてもフォーカスがまだ移動していないのでsetTimeoutでちょっと遅らせる
    setTimeout(() => {
      if (div.contains(document.activeElement)) {
        // 要素内にフォーカスが移った場合には何もしない
        return;
      }
      disposeElement(div);
    })
  );
  // Chromeでは別のウィンドウにフォーカスが移っても要素にはblurが来ないので、windowのblurでも閉じるように
  window.addEventListener('blur', () => disposeElement(div));
}
// 閉じるときにaddEventListenerで登録したlistenerを自動的に解除する
function removeEventListenerOnClose<TARGET extends Document | Window>(
  target: TARGET,
  addTeardown: (teardown: () => unknown) => void
) {
  const original = target.addEventListener;
  target.addEventListener = function addEventListener(
    this: TARGET,
    ...args: Parameters<TARGET['addEventListener']>
  ) {
    original.apply(this, args);
    addTeardown(() => target.removeEventListener.apply(target, args));
  } as any;
  setTimeout(() => (target.addEventListener = original));
}
function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  const teardowns: Array<() => unknown> = [];
  new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
      for (const node of mutation.removedNodes) {
        if (node === element) {
          for (const teardown of teardowns.reverse()) {
            teardown();
          }
          observer.disconnect();
          return;
        }
      }
    }
  }).observe(document.body, {childList: true});
  const addTeardown = (teardown: () => unknown) => {
    teardowns.push(teardown);
  };
  removeEventListenerOnClose(document, addTeardown);
  removeEventListenerOnClose(window, addTeardown);
  return element;
}
function createButton(
  caption: string,
  title: string,
  onclick: () => unknown
): HTMLButtonElement {
  const button = document.createElement('button');
  button.appendChild(document.createTextNode(caption));
  button.title = title;
  // 左側とちょっと離れるように
  Object.assign(button.style, {
    marginLeft: '3px',
    borderRadius: '10px',
    padding: 0,
  });
  button.addEventListener('click', onclick);
  return button;
}
// スタイルでの位置指定からpxを除去(pxがなければ0として扱う)
function pxToNumber(stylePos: string) {
  return +(stylePos.match(/^-?\d+(?:\.\d+)?(?=px$)/)?.[0] ?? 0);
}
// 数値をpx表現に変換
function numberToPx(pos: number) {
  return (
    pos
      // 小数点以下2桁まで
      .toFixed(2)
      // 末尾の余計な0を除去
      .replace(/(?:(?<=\.\d*[1-9])|\.)0+$/, '') + 'px'
  );
}
const area = createElement('div');
Object.assign(area.style, {
  border: 'black solid 1px',
  borderRadius: '5px',
  color: 'black',
  backgroundColor: 'white',
  // 画面の左上に配置
  position: 'fixed',
  top: '0',
  left: '0',
  // 元々ある他の要素よりも上になるように
  zIndex: `${0x7fffffff}`,
  // 上だけグリップ分増やす
  padding: '15px 5px 5px',
});
area.appendChild(document.createTextNode(document.title));
area.appendChild(
  createButton('📋', 'クリップボードにコピー', () => {
    // ページのタイトルをクリップボードにコピー
    navigator.clipboard.writeText(document.title);
    // 表示領域を削除
    disposeElement(area);
  })
);
area.appendChild(createButton('❌', '閉じる', () => disposeElement(area)));
disposeOnBlur(area);
const grip = document.createElement('div');
Object.assign(grip.style, {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '10px',
  backgroundColor: 'gray',
  borderRadius: '4px 4px 0 0',
})
grip.draggable = true;
area.appendChild(grip);
endraggable(area);
// 領域を表示
document.body.appendChild(area);
// フォーカスを移す
area.focus();
