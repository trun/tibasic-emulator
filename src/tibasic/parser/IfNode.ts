import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import ExpressionNode from './ExpressionNode'
import StatementNode from './StatementNode'

export default class IfNode extends ASTNode {
  readonly predicate: ASTNode

  constructor(predicate: ASTNode) {
    super('If');
    this.predicate = predicate
  }

  static parse = (parser: Parser): IfNode => {
    parser.expectToken(TokenType.Identifier, 'If')
    const predicate: ASTNode = ExpressionNode.parse(parser)
    return new IfNode(predicate)
  }
}
