import * as optionalist from 'optionalist';
import {enbookmarklet, loadConfig, convertTarget} from './enbookmarklet';

// コマンドラインオプション解析
const {
  tsconfig,
  [optionalist.unnamed]: filenames,
  target,
  'no-scheme': noScheme,
} = optionalist.parse({
  target: {
    describe:
      '出力するjavascriptのバージョンを指定します。IE11でも使用できるようにするにはES5を指定します。',
    constraints: [
      'ES3',
      'ES5',
      'ES2015',
      'ES2016',
      'ES2017',
      'ES2018',
      'ES2019',
      'ES2020',
      'ESNext',
    ],
    ignoreCase: true,
    example: 'ES3|ES5|ES2015|ES2016|ES2017|ES2018|ES2019|ES2020|ESNext',
  },
  'no-scheme': {
    type: 'boolean',
    describe: '`javascript:`を出力しない場合に指定します。',
  },
  tsconfig: {
    alias: 't',
    describe: 'TypeScriptのコンパイル時に使用する設定ファイル。',
    example: 'tsconfig.json',
  },
  [optionalist.unnamed]: {
    min: 1,
    describe: 'ブックマークレットに変換するスクリプト',
    example: 'script.ts',
  },
  [optionalist.helpString]: {
    showUsageOnError: true,
    describe:
      'TypeScriptをコンパイルしてブックマークレット用のURLを出力します。',
  },
} as const);

try {
  // 設定ファイルからコンパイラオプション取得
  const compilerOptions = loadConfig(tsconfig, filenames[0]);
  if (target && compilerOptions) {
    compilerOptions.target = convertTarget(target);
  }
  const bookmarklet = enbookmarklet(filenames, compilerOptions, noScheme);
  console.log(bookmarklet);
} catch (ex) {
  console.error(ex.toString());
  process.exit(1);
}
