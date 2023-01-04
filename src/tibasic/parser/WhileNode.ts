import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import ExpressionNode from './ExpressionNode'

export default class WhileNode extends ASTNode {
  readonly predicate: ASTNode

  constructor(predicate: ASTNode) {
    super('While')
    this.predicate = predicate
  }

  static parse = (parser: Parser): WhileNode => {
    parser.expectToken(TokenType.Identifier, 'While')
    const predicate: ASTNode = ExpressionNode.parse(parser)
    return new WhileNode(predicate)
  }
}