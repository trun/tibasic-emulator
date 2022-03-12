import ASTNode from './ASTNode'
import { Token, TokenType } from '../lexer/scanner.d'
import CodeBlockNode from './CodeBlockNode'
import StatementNode from './StatementNode'

export default class Parser {
  readonly tokens: Array<Token>
  position: number

  constructor(tokens: Array<Token>) {
    this.tokens = tokens
    this.position = 0
  }

  parse = (): ASTNode => {
    const tree = new CodeBlockNode()
    while (!this.endOfStream()) {
      tree.children.push(StatementNode.parse(this))
    }
    return tree
  }

  endOfStream = (): boolean => {
    return this.position >= this.tokens.length
  }

  matchToken = (type: TokenType, value?: string | number): boolean => {
    if (this.endOfStream()) {
      return false
    }

    const token = this.tokens[this.position]
    if (value !== undefined) {
      return token.type === type && (token.value as string).toUpperCase() === (value as string).toUpperCase()
    } else {
      return token.type === type
    }
  }

  acceptToken = (type: TokenType, value?: string | number): boolean => {
    if (this.matchToken(type, value)) {
      this.position++
      return true
    } else {
      return false
    }
  }

  expectToken = (type: TokenType, value?: string | number): Token => {
    if (this.matchToken(type, value)) {
      return this.tokens[this.position++]
    } else {
      throw new Error(`Unexpected token. Expected ${type}(${value}).`)
    }
  }

  readToken = (n: number = 0): Token => {
    return this.tokens[this.position + n]
  }

  currentToken = (n: number = 0): Token => {
    if (this.position < this.tokens.length) {
      return this.tokens[this.position + n]
    }

    return { type: TokenType.Identifier, value: '' }
  }

}