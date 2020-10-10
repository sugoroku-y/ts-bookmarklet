# ts-bookmarklet

The code written in TypeScript is converted to URLs for bookmarklet and output.

TypeScriptで書かれたコードをブックマークレット用のURLに変換して出力します。

[![NPM version](https://img.shields.io/npm/v/ts-bookmarklet.svg?style=flat)](https://www.npmjs.com/package/ts-bookmarklet)
[![NPM monthly download](https://img.shields.io/npm/dm/ts-bookmarklet.svg?style=flat)](https://www.npmjs.com/package/ts-bookmarklet)
[![NPM total download](https://img.shields.io/npm/dt/ts-bookmarklet.svg?style=flat)](https://www.npmjs.com/package/ts-bookmarklet)
[![Build Status](https://travis-ci.com/sugoroku-y/ts-bookmarklet.svg?branch=master)](https://travis-ci.com/sugoroku-y/ts-bookmarklet)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

On Windows, you can copy the URL for the bookmarklet to the clipboard by running the following.

Windowsでは、以下のように実行することで、ブックマークレット用のURLがクリップボードにコピーされます。

```cmd
> npx ts-bookmarklet main.ts | clip
```

The JavaScript transpiled from TypeScript is further converted to a URL in a minified and mangled state by uglify-es.

TypeScriptからトランスパイルされたJavaScriptは、さらにuglify-esによりminifyされmangleされた状態でURLに変換されます。

## Commandline Options - コマンドラインオプション

- `--tsconfig tsconfig.json` | `-t tsconfig.json`  
  typescriptのコンパイルに使用する設定を記述したファイルを指定します。
  省略時には以下の設定が指定されたものとしてコンパイルします。

  ```json
  {
    "compilerOptions": {
      "target": "ES2018",
      "lib": [
        "ESNext",
        "DOM",
        "DOM.Iterable"
      ],
      "strict": true,
      "strictNullCheck": true,
      "alwaysStrict": false,
      "noImplicitUseStrict": true,
      "module": "none",
      "moduleResolution": "node"
    }
  }
  ```
  
  tsconfig.jsonを指定した場合、以下のオプションについては、  
  設定されていなければTypeScriptのデフォルト値ではなく、  
  以下の値が使用されます。
  
  ```json
  {
    "compilerOptions": {
      "target": "ES2018",
      "strict": true,
      "strictNullChecks": true
    }
  }
  ```
  
  また、以下のオプションについては設定されていても  
  以下の値で上書きされます。
  
  ```json
  {
    "compilerOptions": {
      "alwaysStrict": false,
      "noImplicitUseStrict": true,
      "module": "none",
      "moduleResolution": "node"
    }
  }
  ```
  
- スクリプトファイル  
  複数指定した場合はすべてのファイルをマージした状態のブックマークレットを作成します。  
  