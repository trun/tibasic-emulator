export enum TokenType {
  Assignment,
  Identifier,
  Number,
  String,
  Operation,
  Comparison,
  Parentheses,
  Comma,
}

export interface Token {
  type: TokenType,
  value: string | number,
}