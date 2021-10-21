import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import ExpressionNode from './ExpressionNode'
import StatementNode from './StatementNode'

export default class WhileNode extends ASTNode {
  constructor(predicate: ASTNode, body: ASTNode) {
    super()

    this.children.push(predicate)
    this.children.push(body)
  }

  predicate = (): ASTNode => {
    return this.children[0]
  }

  body = (): ASTNode => {
    return this.children[1]
  }

  static parse = (parser: Parser): WhileNode => {
    parser.expectToken(TokenType.Identifier, 'While')

    const predicate: ASTNode = ExpressionNode.parse(parser)
    const body: ASTNode = StatementNode.parse(parser)

    return new WhileNode(predicate, body)
  }
}