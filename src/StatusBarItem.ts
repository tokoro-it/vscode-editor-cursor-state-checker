import * as vscode from "vscode";
import { Config } from "./Config";
import { CursorState } from "./CursorState";
import { Command } from "./constants/constants";

/**
 * ステータスバーアイテムを作成
 * @returns ステータスバーアイテム
 */
export const createStatusBarItem = (
  context: vscode.ExtensionContext
): vscode.StatusBarItem => {
  // ステータスバーアイテムの作成
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    101
  );

  //ステータスバーアイテムにコマンドを設定
  statusBarItem.command = Command.showContextKey;

  // ステータスバーに表示するテキストの設定
  updateStatusbarItemText(statusBarItem);

  // ステータスバーアイテムを表示
  statusBarItem.show();

  // エクステンションが非アクティブ化されたときにステータスバーアイテムを破棄
  context.subscriptions.push(statusBarItem);

  return statusBarItem;
};

/**
 * ステータスバーの文字列更新
 * @param statusBarItem ステータスバーアイテム
 * @param cursorState カーソル状態
 */
export const updateStatusbarItemText = (
  statusBarItem: vscode.StatusBarItem,
  cursorState?: CursorState
) => {
  const isEnabled = Config.isEnabled();
  const enabled = isEnabled ? "$(pass)" : "$(error)";

  const statusIcon = (state?: boolean) => (state ? "$(check)" : "$(dash)");
  const lineEnd = statusIcon(cursorState?.isLineEnd);
  const right = statusIcon(cursorState?.isRightOfCursorSpecifiedChar);

  statusBarItem.text = `${enabled} EOL:${lineEnd} Right:${right}`;
};
