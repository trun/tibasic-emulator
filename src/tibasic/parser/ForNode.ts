import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import ExpressionNode from './ExpressionNode'
import NumberNode from './NumberNode'

export default class ForNode extends ASTNode {
  readonly variable: string
  readonly start: ASTNode
  readonly end: ASTNode
  readonly step: ASTNode

  constructor(variable: string, start: ASTNode, end: ASTNode, step: ASTNode) {
    super('For')

    this.variable = variable
    this.start = start
    this.end = end
    this.step = step
  }

  static parse = (parser: Parser): ForNode => {
    parser.expectToken(TokenType.Identifier, 'For')
    parser.expectToken(TokenType.Parentheses, '(')

    const variable: string = parser.expectToken(TokenType.Identifier).value as string
    parser.expectToken(TokenType.Comma)

    const start: ASTNode = ExpressionNode.parse(parser)
    parser.expectToken(TokenType.Comma)

    const end: ASTNode = ExpressionNode.parse(parser)

    let step: ASTNode = new NumberNode(1)
    if (parser.acceptToken(TokenType.Comma)) {
      step = ExpressionNode.parse(parser)
    }

    parser.expectToken(TokenType.Parentheses, ')')

    return new ForNode(variable, start, end, step)
  }
}