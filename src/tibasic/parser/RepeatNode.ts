import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import ExpressionNode from './ExpressionNode'

export default class RepeatNode extends ASTNode {
  readonly predicate: ASTNode

  constructor(predicate: ASTNode) {
    super('Repeat')

    this.predicate = predicate
  }

  static parse = (parser: Parser): RepeatNode => {
    parser.expectToken(TokenType.Identifier, 'Repeat')

    const predicate: ASTNode = ExpressionNode.parse(parser)

    return new RepeatNode(predicate)
  }
}