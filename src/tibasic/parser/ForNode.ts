import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import ExpressionNode from './ExpressionNode'
import NumberNode from './NumberNode'
import StatementNode from './StatementNode'

export default class ForNode extends ASTNode {
  readonly variable: string

  constructor(variable: string, start: ASTNode, end: ASTNode, step: ASTNode, body: ASTNode) {
    super('For')

    this.variable = variable
    this.children.push(start)
    this.children.push(end)
    this.children.push(step)
    this.children.push(body)
  }

  start = (): ASTNode => {
    return this.children[0]
  }

  end = (): ASTNode => {
    return this.children[1]
  }

  step = (): ASTNode => {
    return this.children[2]
  }

  body = (): ASTNode => {
    return this.children[3]
  }

  static parse = (parser: Parser): ForNode => {
    parser.expectToken(TokenType.Identifier, 'For')
    parser.expectToken(TokenType.Parentheses, '(')

    const variable: string = parser.expectToken(TokenType.Identifier).value as string
    parser.expectToken(TokenType.Comma)

    const start: ASTNode = ExpressionNode.parse(parser)
    parser.expectToken(TokenType.Comma)

    const end: ASTNode = ExpressionNode.parse(parser)
    parser.expectToken(TokenType.Comma)

    let step: ASTNode = new NumberNode(1)
    if (parser.acceptToken(TokenType.Comma)) {
      step = ExpressionNode.parse(parser)
    }

    parser.expectToken(TokenType.Parentheses, ')')
    const body: ASTNode = StatementNode.parse(parser)

    return new ForNode(variable, start, end, step, body)
  }
}