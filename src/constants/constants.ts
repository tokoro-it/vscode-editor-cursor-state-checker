export const EXTENSION_ID = "cursor-state-checker";

//コマンド
export const Command = {
  check: `${EXTENSION_ID}.check`,
  showContextKey: `${EXTENSION_ID}.show-context-key`,
};

//コンテキストキー関連
export const CONTEXT_PREFIX = "CSChecker";
export const ContextKey = {
  normal: `${CONTEXT_PREFIX}.normal`,
  eol: `${CONTEXT_PREFIX}.eol`,
  rightChar: `${CONTEXT_PREFIX}.rightIsSpecifiedChar`,
} as const;
type ContextKey = (typeof ContextKey)[keyof typeof ContextKey];

export const Button = {
  normal: "Normal",
  eol: "EOL",
  rightChar: "Right Char",
} as const;
type Button = (typeof Button)[keyof typeof Button];

export const getContextKey = (
  btnText: Button | undefined
): ContextKey | undefined => {
  switch (btnText) {
    case Button.normal:
      return ContextKey.normal;
    case Button.eol:
      return ContextKey.eol;
    case Button.rightChar:
      return ContextKey.rightChar;
  }
  return undefined;
};
