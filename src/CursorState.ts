import * as vscode from "vscode";
import { Config } from "./Config";
import { ContextKey } from "./constants/constants";

export type CursorState = {
  /** 行末 */
  isLineEnd: boolean;

  /** 閉じタグの右 */
  isRightOfCursorSpecifiedChar: boolean;
};

/**
 * カーソルの状態を取得
 * @returns カーソル状態
 */
export const getCursorState = (): CursorState => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return {
      isLineEnd: false,
      isRightOfCursorSpecifiedChar: false,
    };
  }

  const document = editor.document;
  const cursorPosition = editor.selection.active;

  // 現在の行のテキスト
  const lineText = document.lineAt(cursorPosition.line).text;

  // カーソルが行末にあるかを判定
  const isLineEnd = cursorPosition.character === lineText.length;

  // カーソルが行末でなければ、右側の文字が特定の記号であるかを判定
  let isRightOfCursorSpecifiedChar = false;
  if (!isLineEnd && cursorPosition.character < lineText.length) {
    //カーソルの次の2文字目の位置を取得
    //次の文字がスペースの場合、更に次の1文字を判定したいので、
    //2文字以上あれば、2文字後ろの位置を取得する
    const nextCharPosition = cursorPosition.with(
      cursorPosition.line,
      Math.min(cursorPosition.character + 2, lineText.length)
    );

    //スペースを除いた次の文字を取得
    const nextChars = document
      .getText(new vscode.Range(cursorPosition, nextCharPosition))
      .trim();

    if (nextChars) {
      // 設定からカーソル右にあるかチェックする文字を取得
      const rightOfCursorCheckChars = Config.getRightOfCursorCheckChars();

      // カーソルの右側の文字が特定の記号であるかを判定
      isRightOfCursorSpecifiedChar = rightOfCursorCheckChars.includes(
        nextChars[0]
      );
    }
  }

  return {
    isLineEnd,
    isRightOfCursorSpecifiedChar,
  };
};

/**
 * カーソル状態をコンテキストに設定
 * @param cursorState カーソル状態
 */
export const setContextCursorState = (cursorState?: CursorState) => {
  //どちらもfalseのときNormal=true
  const isNormal =
    !cursorState?.isLineEnd && !cursorState?.isRightOfCursorSpecifiedChar;
  vscode.commands.executeCommand("setContext", ContextKey.normal, isNormal);
  vscode.commands.executeCommand(
    "setContext",
    ContextKey.eol,
    cursorState?.isLineEnd
  );
  vscode.commands.executeCommand(
    "setContext",
    ContextKey.rightChar,
    cursorState?.isRightOfCursorSpecifiedChar
  );
};
