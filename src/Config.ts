import * as vscode from "vscode";
import { EXTENSION_ID } from "./constants/constants";

/**
 * 拡張機能の設定アクセスクラス
 */
export class Config {
  private static readonly KEY_ENABLED = "enabled";
  private static readonly KEY_RIGHT_OF_CURSOR_CHECK_CHARS =
    "rightOfCursorCheckChars";
  static readonly ENABLED = `${EXTENSION_ID}.enabled`;

  private static getConfiguration(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(EXTENSION_ID);
  }

  /**
   * 拡張機能の有効／無効を取得する
   * @returns 有効／無効
   */
  static isEnabled(): boolean {
    const config = this.getConfiguration();
    return config.get<boolean>(this.KEY_ENABLED, true);
  }

  /**
   * カーソルの右にきたか判定する文字
   * @returns 判定する文字列
   */
  static getRightOfCursorCheckChars(): string {
    const DEFAULT = "\"'`(){}[]<>";
    const config = this.getConfiguration();
    return config.get<string>(this.KEY_RIGHT_OF_CURSOR_CHECK_CHARS, DEFAULT);
  }
}
