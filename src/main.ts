import * as optionalist from 'optionalist';
import {enbookmarklet, loadConfig} from './enbookmarklet';

// コマンドラインオプション解析
const {tsconfig, [optionalist.unnamed]: filenames} = optionalist.parse({
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
});

try {
  // 設定ファイルからコンパイラオプション取得
  const compilerOptions = loadConfig(tsconfig);
  const bookmarklet = enbookmarklet(filenames, compilerOptions);
  console.log(bookmarklet);
} catch (ex) {
  console.error(ex.toString());
  process.exit(1);
}
