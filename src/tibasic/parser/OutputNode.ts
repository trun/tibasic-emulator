import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import ExpressionNode from './ExpressionNode'

export default class OutputNode extends ASTNode {
  readonly row: number
  readonly col: number

  constructor(row: number, col: number, expression: ASTNode) {
    super()

    this.row = row
    this.col = col
    this.children.push(expression)
  }

  static parse = (parser: Parser): OutputNode => {
    parser.expectToken(TokenType.Identifier, 'Output')
    parser.expectToken(TokenType.Parentheses, '(')

    const row: number = parser.expectToken(TokenType.Number).value as number
    parser.expectToken(TokenType.Comma)

    const col: number = parser.expectToken(TokenType.Number).value as number
    parser.expectToken(TokenType.Comma)

    const expression = ExpressionNode.parse(parser)

    // closing paren is optional?
    parser.acceptToken(TokenType.Parentheses, ')')

    return new OutputNode(row, col, expression)
  }
}
