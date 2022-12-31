import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import ExpressionNode from './ExpressionNode'

export default class ArgListNode extends ASTNode {
  readonly arglist: ExpressionNode[] = []

  constructor(parent: ASTNode) {
    super('ArgList', parent)
  }

  static parse = (parser: Parser, parent: ASTNode): ArgListNode => {
    const node = new ArgListNode(parent)
    node.arglist.push(ExpressionNode.parse(parser))
    while (parser.acceptToken(TokenType.Comma)) {
      node.arglist.push(ExpressionNode.parse(parser))
    }
    return node
  }
}