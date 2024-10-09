export const EXTENSION_ID = "cursor-state-checker";

//コマンド
export const Command = {
  check: `${EXTENSION_ID}.check`,
  showContextKey: `${EXTENSION_ID}.show-context-key`,
};

//コンテキストキー関連
export const CONTEXT_PREFIX = "CSChecker";
export const ContextKey = {
  normalLeft: `${CONTEXT_PREFIX}.normalLeft`,
  normalRight: `${CONTEXT_PREFIX}.normalRight`,
  bol: `${CONTEXT_PREFIX}.bol`,
  eol: `${CONTEXT_PREFIX}.eol`,
  leftChar: `${CONTEXT_PREFIX}.leftIsSpecifiedChar`,
  rightChar: `${CONTEXT_PREFIX}.rightIsSpecifiedChar`,
} as const;
type ContextKey = (typeof ContextKey)[keyof typeof ContextKey];

export const Button = {
  normalLeft: "Normal L",
  normalRight: "Normal R",
  bol: "BOL",
  eol: "EOL",
  leftChar: "Left",
  rightChar: "Right",
} as const;
type Button = (typeof Button)[keyof typeof Button];

export const getContextKey = (
  btnText: Button | undefined
): ContextKey | undefined => {
  switch (btnText) {
    case Button.normalLeft:
      return ContextKey.normalLeft;
    case Button.normalRight:
      return ContextKey.normalRight;
    case Button.bol:
      return ContextKey.bol;
    case Button.eol:
      return ContextKey.eol;
    case Button.leftChar:
      return ContextKey.leftChar;
    case Button.rightChar:
      return ContextKey.rightChar;
  }
  return undefined;
};
