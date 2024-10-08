# Cursor State Checker

## 機能

エディター上のカーソル位置が以下の状態かをチェックし、コンテキストにセットします。  
キーボードショートカットの`when`条件で、判定することができます。  

| 状態                                                                                     | コンテキストキー               | 判定する文字                      |
| :--------------------------------------------------------------------------------------- | :----------------------------- | :-------------------------------- |
| カーソルより右側が通常（行頭でない、特定の文字がない）                                   | CSChecker.normalLeft           |                                   |
| カーソルより左側が通常（行頭でない、特定の文字がない）                                   | CSChecker.normalRight          |                                   |
| カーソルが行頭にある                                                                     | CSChecker.bol                  |                                   |
| カーソルが行末にある                                                                     | CSChecker.eol                  |                                   |
| カーソルの左(前)の文字が特定の文字（引用符、括弧／タグ）またはスペース＋特定の文字である | CSChecker.leftIsSpecifiedChar  | `"'``(){}[]<>`<br>※設定より変更可 |
| カーソルの右(次)の文字が特定の文字（引用符、括弧／タグ）またはスペース＋特定の文字である | CSChecker.rightIsSpecifiedChar | `"'``(){}[]<>`<br>※設定より変更可 |

<details>
<summary>コンテキストキーの使用例</summary>
通常時は、`cursorWordEndRight`で単語単位でカーソルを移動で移動します。  
カーソルの右に特定の文字かスペース＋特定の文字がきたときは、`cursorRight`で次の文字に移動できます。  
行末にいるときは、デフォルトの動作となり、`space`が入力されます。  
```json
# keybindings.json
{
  {
    "key": "shift+space",
    "command": "cursorWordEndRight",
    "when": "textInputFocus && !accessibilityModeEnabled && CSChecker.normalRight"
  },
  {
    "key": "shift+space",
    "command": "cursorRight",
    "when": "textInputFocus && !accessibilityModeEnabled && CSChecker.rightIsSpecifiedChar"
  }
}
```
</details>

### ステータスバー

ステータスバーに、カーソル位置によって、状態が表示されます。  
ステータスバーをクリックすると、各コンテキストキーをクリップボードにコピーすることができます。  

#### 行頭

![status-bol](images/status-bol.png)


#### 行末

![status-eol](images/status-eol.png)


#### 左に特定の文字がある

![status-left](images/status-left.png)


#### 右に特定の文字がある

![status-right](images/status-right.png)


#### ステータスバーの表示をクリック

![statusbar-click](images/statusbar-click.png)

## 設定

この拡張機能は以下の設定を提供します：

| キー                                         | 説明                             | デフォルト値   |
| :------------------------------------------- | :------------------------------- | :------------- |
| `check-cursor-state.enabled`                 | 拡張機能の有効/無効              | true           |
| `check-cursor-state.leftOfCursorCheckChars`  | カーソルの左にきたか判定する文字 | `"'``(){}[]<>` |
| `check-cursor-state.rightOfCursorCheckChars` | カーソルの右にきたか判定する文字 | `"'``(){}[]<>` |

## リリースノート

* [CHANGELOG](CHANGELOG.md)参照


## License

* MIT
