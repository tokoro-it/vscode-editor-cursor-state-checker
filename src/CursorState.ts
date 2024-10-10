import * as vscode from "vscode";
import { Config } from "./Config";
import { ContextKey } from "./constants/constants";

export type CursorState = {
  //行頭
  isBol: boolean;

  /** 行末 */
  isEol: boolean;

  /** 指定した文字の左 */
  isLeftSpecifiedChar: boolean;

  /** 指定した文字の右 */
  isRightSpecifiedChar: boolean;
};

/**
 * カーソルの状態を取得
 * @returns カーソル状態
 */
export const getCursorState = (): CursorState => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return {
      isBol: false,
      isEol: false,
      isLeftSpecifiedChar: false,
      isRightSpecifiedChar: false,
    };
  }

  const document = editor.document;
  const cursorPosition = editor.selection.active;

  // 現在の行のテキスト
  const lineText = document.lineAt(cursorPosition.line).text;

  // 行頭にあるかを判定
  const isBol = cursorPosition.character === 0;

  // 行末にあるかを判定
  const isEol = cursorPosition.character === lineText.length;

  // 左側の文字を判定
  const isLeft = isLeftSpecifiedChar(lineText, cursorPosition.character);

  // 右側の文字を判定
  const isRight = isRightSpecifiedChar(lineText, cursorPosition.character);

  return {
    isBol,
    isEol,
    isLeftSpecifiedChar: isLeft,
    isRightSpecifiedChar: isRight,
  };
};

/**
 * カーソルの左に特定の文字があるか判定
 * @param lineText １行分の文字列
 * @param cursorPosition カーソル位置インデックス
 * @returns true:特定の文字がある
 */
const isLeftSpecifiedChar = (
  lineText: string,
  cursorPosition: number
): boolean => {
  if (cursorPosition <= 0) {
    //行頭なので、左隣に文字はない
    return false;
  }

  // 取得できる文字数は最大2文字。カーソル位置が2未満ならそれだけ取得
  const start = Math.max(0, cursorPosition - 2);
  const end = cursorPosition;

  //1~2文字取得して、空白文字を削除
  const nextChars = lineText.slice(start, end).trim();

  if (!nextChars) {
    //空白文字しかなかった
    return false;
  }

  // カーソルの左側の文字が、特定の文字かを判定
  const checkChars = Config.getLeftOfCursorCheckChars();
  return checkChars.includes(nextChars.slice(-1));
};

/**
 * カーソルの右に特定の文字があるか判定
 * @param lineText １行分の文字列
 * @param cursorPosition カーソル位置インデックス
 * @returns true:特定の文字がある
 */
const isRightSpecifiedChar = (
  lineText: string,
  cursorPosition: number
): boolean => {
  if (lineText.length <= cursorPosition) {
    //行末なので、右隣に文字はない
    return false;
  }

  // 残りの文字が2文字以上ある場合は2文字、それ以外は残りの全てを取得
  const start = cursorPosition;
  const end = Math.min(cursorPosition + 2, lineText.length);

  //1~2文字取得して、空白文字を削除
  const nextChars = lineText.slice(start, end).trim();

  if (!nextChars) {
    //空白文字しかなかった
    return false;
  }

  // カーソルの右側の文字が、特定の文字かを判定
  const checkChars = Config.getRightOfCursorCheckChars();
  return checkChars.includes(nextChars[0]);
};

/**
 * カーソル状態をコンテキストに設定
 * @param cursorState カーソル状態
 */
export const setContextCursorState = (cursorState?: CursorState) => {
  //行頭でない　かつ　左に特定の文字がない
  const isNormalLeft = !cursorState?.isBol && !cursorState?.isLeftSpecifiedChar;
  vscode.commands.executeCommand(
    "setContext",
    ContextKey.normalLeft,
    isNormalLeft
  );

  //行末でない　かつ　右に特定の文字がない
  const isNormalRight =
    !cursorState?.isEol && !cursorState?.isRightSpecifiedChar;
  vscode.commands.executeCommand(
    "setContext",
    ContextKey.normalRight,
    isNormalRight
  );

  //行頭、行末、左、右をセット
  vscode.commands.executeCommand(
    "setContext",
    ContextKey.bol,
    cursorState?.isBol
  );
  vscode.commands.executeCommand(
    "setContext",
    ContextKey.eol,
    cursorState?.isEol
  );
  vscode.commands.executeCommand(
    "setContext",
    ContextKey.leftChar,
    cursorState?.isLeftSpecifiedChar
  );
  vscode.commands.executeCommand(
    "setContext",
    ContextKey.rightChar,
    cursorState?.isRightSpecifiedChar
  );
};
