import {resolve} from 'path';
import * as uglify from 'uglify-es';
import ts from 'typescript';

// Uglifyでエラーが発生したときのエラー箇所を示す情報
interface uglifyErrorPos {
  filename: string;
  line: number;
  col: number;
}

function hasProperty<N extends string>(
  o: object,
  name: N
): o is {[K in N]: unknown} {
  return name in o;
}

/**
 * 指定の名前、型のプロパティを持つかどうかを確認するタイプガード。
 * @param o 確認対象のオブジェクト
 * @param name プロパティの名前
 * @param type プロパティの型(文字列/数値/真偽値のみ)
 */
function hasTypedProperty<
  N extends string,
  TYPE extends 'string' | 'number' | 'boolean' | undefined
>(
  o: object,
  name: N,
  type?: TYPE
): o is {
  [K in N]: TYPE extends 'string'
    ? string
    : TYPE extends 'number'
    ? number
    : TYPE extends 'boolean'
    ? boolean
    : unknown;
} {
  return hasProperty(o, name) && typeof o[name] === type;
}
/**
 * uglifyErrorPosであるかどうかをチェックするタイプガード。
 * @param o
 */
function isUglifyErrorPos(o: unknown): o is uglifyErrorPos {
  return (
    o &&
    typeof o === 'object' &&
    hasTypedProperty(o, 'filename', 'string') &&
    hasTypedProperty(o, 'line', 'number') &&
    hasTypedProperty(o, 'col', 'number')
  );
}
/**
 * 診断メッセージを出力用に整形
 * @param diag
 */
function diagnosticToText(diag: Readonly<ts.Diagnostic>): string {
  const message = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
  if (diag.file === undefined || diag.start === undefined) {
    // istanbul ignore next
    return message;
  }
  const {line, character} = diag.file.getLineAndCharacterOfPosition(diag.start);
  return `${resolve(diag.file.fileName)}:${line + 1}:${
    character + 1
  }: ${message}`;
}
/**
 * 診断メッセージを出力用に整形
 * @param diags
 */
function diagnosticsToText(
  diags: ReadonlyArray<Readonly<ts.Diagnostic>>
): string {
  if (!diags.length) {
    // istanbul ignore next
    return '';
  }
  return diags
    .map(diag =>
      [
        diagnosticToText(diag),
        ...(diag.relatedInformation?.map(info => {
          // istanbul ignore next
          return diagnosticToText(info).replace(/(?<=\n)(?!\r?\n)/g, '    ');
        }) ?? []),
      ].join('\n  ')
    )
    .join('\n');
}

function assertNever(_: never, message?: string): never {
  throw new Error(message ?? 'unreachable');
}

export function convertTarget(
  target:
    | 'ES3'
    | 'ES5'
    | 'ES2015'
    | 'ES2016'
    | 'ES2017'
    | 'ES2018'
    | 'ES2019'
    | 'ES2020'
    | 'ESNext'
): ts.ScriptTarget {
  switch (target) {
    case 'ES3':
      return ts.ScriptTarget.ES3;
    case 'ES5':
      return ts.ScriptTarget.ES5;
    case 'ES2015':
      return ts.ScriptTarget.ES2015;
    case 'ES2016':
      return ts.ScriptTarget.ES2016;
    case 'ES2017':
      return ts.ScriptTarget.ES2017;
    case 'ES2018':
      return ts.ScriptTarget.ES2018;
    case 'ES2019':
      return ts.ScriptTarget.ES2019;
    case 'ES2020':
      return ts.ScriptTarget.ES2020;
    case 'ESNext':
      return ts.ScriptTarget.ESNext;
    default:
      assertNever(target, `Unsupported target: ${target}`);
  }
}

export function loadConfig(
  tsconfig: string | undefined,
  source: string
): ts.CompilerOptions | undefined {
  // 設定ファイルの指定なし
  if (!tsconfig) {
    // ソースと同じディレクトリにあるtsconfig.json
    tsconfig = resolve(source, '..', 'tsconfig.json');
    if (!ts.sys.fileExists(tsconfig)) {
      // 存在していなければデフォルト設定
      return undefined;
    }
  }
  const {config, error} = ts.readConfigFile(tsconfig, ts.sys.readFile);
  if (error) {
    throw new Error(diagnosticToText(error));
  }
  // JSONから読み込んだ設定は、convertCompilerOptionsFromJsonで変換しないと使えない
  const {options, errors} = ts.convertCompilerOptionsFromJson(
    config.compilerOptions,
    '.',
    tsconfig
  );
  if (errors.length) {
    throw new Error(diagnosticsToText(errors));
  }
  return options;
}

export function enbookmarklet(
  filenames: readonly string[],
  compilerOptions?: ts.CompilerOptions,
  noScheme?: true
) {
  // 設定ファイルが指定されなかったときのデフォルト設定
  compilerOptions ??= {
    lib: ['lib.esnext.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
  };
  // 以下の設定はtsconfig.jsonで指定されていなければ指定する
  // コンパイル後のjavascriptの対象バージョン
  compilerOptions.target ??= ts.ScriptTarget.ES2018;
  // 厳格モード
  compilerOptions.strict ??= true;
  // 厳密なnullチェック
  compilerOptions.strictNullChecks ??= true;
  // 以下の設定はtsconfig.jsonで指定されていても上書き
  // 先頭の'use strict';を常に出力する設定をオフ
  if (compilerOptions.alwaysStrict) {
    console.warn(`compilerOptions.alwaysStrict: true -> false`);
  }
  compilerOptions.alwaysStrict = false;
  // 'use strict';を出力しない設定をオン
  if (compilerOptions.noImplicitUseStrict === false) {
    console.warn(`compilerOptions.noImplicitUseStrict: false -> true`);
  }
  compilerOptions.noImplicitUseStrict = true;
  // モジュールは使えないのでNoneを指定
  if (
    compilerOptions.module !== undefined &&
    compilerOptions.module !== ts.ModuleKind.None
  ) {
    console.warn(
      `compilerOptions.module: ${ts.ModuleKind[compilerOptions.module]} -> None`
    );
  }
  compilerOptions.module = ts.ModuleKind.None;
  // 何故かmoduleResolutionにNodeJsを指定しないとエラーになるので指定しておく
  if (
    compilerOptions.moduleResolution !== undefined &&
    compilerOptions.moduleResolution !== ts.ModuleResolutionKind.NodeJs
  ) {
    console.warn(
      `compilerOptions.moduleResolution: ${
        ts.ModuleResolutionKind[compilerOptions.moduleResolution]
      } -> NodeJs`
    );
  }
  compilerOptions.moduleResolution = ts.ModuleResolutionKind.NodeJs;
  // 指定されたスクリプトファイルをTranspile
  const transpiled = (() => {
    const program = ts.createProgram(filenames, compilerOptions);
    // 各Diagnosticsを確認して何かあればエラーとして終了
    for (const methodName of [
      'getOptionsDiagnostics',
      'getConfigFileParsingDiagnostics',
      'getDeclarationDiagnostics',
      'getGlobalDiagnostics',
      'getSemanticDiagnostics',
      'getSyntacticDiagnostics',
    ] as const) {
      const diags = program[methodName]();
      if (diags.length) {
        const type = methodName.match(/(?<=^get).*(?=Diagnostics$)/)?.[0] ?? '';
        throw new Error(`${type}Error\n${diagnosticsToText(diags)}`);
      }
    }
    // Transpile結果を文字列として取得
    let script = '';
    const {diagnostics} = program.emit(undefined, (_, data) => {
      script += data;
    });
    // 取得中のエラー
    if (diagnostics.length) {
      // istanbul ignore next ここでエラーになる条件が分からないのでcoverage対象外
      throw new Error(diagnosticsToText(diagnostics));
    }
    return script;
  })();
  // Transpileしたスクリプトをminify
  const minified = (() => {
    const {code, error} = uglify.minify(
      {'main.js': transpiled},
      {
        output: {
          // 非ASCII文字をエンコードする
          ascii_only: true,
        },
        mangle: {
          // トップレベルにある変数/関数もmangling対象にする
          toplevel: true,
        },
      }
    );
    if (!isUglifyErrorPos(error)) {
      return code;
    }
    const lineText = error.line
      ? transpiled.match(
          new RegExp(`^(?:[^\n]*\n){${error.line - 1}}([^\n]*(?=\n|$))`)
        )?.[1]
      : '';
    throw new Error(
      `UglifyError ${error.message}${
        lineText ? `\n${lineText}\n${' '.repeat(error.col - 1)}^` : ''
      }`
    );
  })();
  // schemeが不要な場合はjavascript:を出力しない
  return `${noScheme ? '' : 'javascript:'}${
    // ES2015より前の場合はarrow関数が使えないのでfunctionを使う
    compilerOptions.target < ts.ScriptTarget.ES2015 ? '(function(){' : '(()=>{'
  }${minified}})()`;
}
