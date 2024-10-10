// 'vscode' モジュールには VS Code の拡張機能 API が含まれています
// モジュールをインポートし、コード内で vscode という別名で参照します
import * as vscode from "vscode";
import { Config } from "./Config";
import { Button, Command, getContextKey } from "./constants/constants";
import { getCursorState, setContextCursorState } from "./CursorState";
import { localeText } from "./lang/localization";
import { createStatusBarItem, updateStatusbarItemText } from "./StatusBarItem";

// このメソッドは拡張機能がアクティブ化されたときに呼び出されます
// 拡張機能は、コマンドが初めて実行されたときにアクティブ化されます
export function activate(context: vscode.ExtensionContext) {
  //ステータスバー作成
  const statusBarItem = createStatusBarItem(context);

  // カーソル位置の状態を判定するコマンド
  let disposable = vscode.commands.registerCommand(Command.check, () => {
    //拡張機能の有効／無効を判定
    const isEnabled = Config.isEnabled();
    if (!isEnabled) {
      return;
    }

    //カーソル位置の状態を取得
    const cursorState = getCursorState();

    // コンテキストを設定
    setContextCursorState(cursorState);

    //ステータスバー更新
    updateStatusbarItemText(statusBarItem, cursorState);
  });
  context.subscriptions.push(disposable);

  // コンテキストキーを表示するコマンド
  disposable = vscode.commands.registerCommand(Command.showContextKey, () => {
    //拡張機能の有効／無効を判定
    const isEnabled = Config.isEnabled();
    if (!isEnabled) {
      return;
    }

    const msg = vscode.window.showInformationMessage(
      localeText("message.show-context-key"),
      Button.normalLeft,
      Button.normalRight,
      Button.bol,
      Button.eol,
      Button.leftChar,
      Button.rightChar
    );
    msg.then(async (value) => {
      //コンテキストキーを取得
      const contextKey = getContextKey(value);
      if (contextKey) {
        try {
          //クリップボードにコピー
          await vscode.env.clipboard.writeText(contextKey);

          //成功したら、ステータスバーメッセージを表示
          vscode.window.setStatusBarMessage(
            localeText("message.copy-success"),
            3000
          );
        } catch (error) {
          //エラーメッセージを表示
          vscode.window.showErrorMessage(
            `${localeText("message.copy-failed")}:${error}`
          );
        }
      }
    });
  });
  context.subscriptions.push(disposable);

  // 設定変更を監視し、有効／無効を制御
  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration(Config.ENABLED)) {
      //拡張機能の有効／無効を判定
      const isEnabled = Config.isEnabled();
      if (!isEnabled) {
        //設定値を削除
        setContextCursorState();
      }
      updateStatusbarItemText(statusBarItem);
    }
  });

  // エディターがアクティブになったとき／カーソル移動時に自動でチェック
  vscode.window.onDidChangeActiveTextEditor(() => {
    vscode.commands.executeCommand(Command.check);
  });
  vscode.window.onDidChangeTextEditorSelection(() => {
    vscode.commands.executeCommand(Command.check);
  });
  vscode.workspace.onDidChangeTextDocument(() => {
    vscode.commands.executeCommand(Command.check);
  });
}

// このメソッドは拡張機能が非アクティブ化されたときに呼び出されます
export function deactivate() {}
