import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import ExpressionNode from './ExpressionNode'
import StatementNode from './StatementNode'

export default class ConditionalNode extends ASTNode {
  readonly predicate: ASTNode
  readonly body: ASTNode

  constructor(predicate: ASTNode, body: ASTNode, elseBody?: ASTNode) {
    super('Conditional');

    this.children.push(predicate)
    this.children.push(body)
    if (!!elseBody) {
      this.children.push(elseBody)
    }
  }

  predicate = () => {
    return this.children[0]
  }

  body = () => {
    return this.children[1]
  }

  elseBody = () => {
    return this.children[2]
  }

  hasElseBody = () => {
    return this.children.length > 2
  }

  static parse = (parser: Parser): ConditionalNode => {
    parser.expectToken(TokenType.Identifier, 'If')
    const predicate: ASTNode = ExpressionNode.parse(parser)
    const body: ASTNode = StatementNode.parse(parser)
    if (parser.matchToken(TokenType.Identifier, 'Else')) {
      return new ConditionalNode(predicate, body, StatementNode.parse(parser))
    } else {
      return new ConditionalNode(predicate, body)
    }
  }
}
