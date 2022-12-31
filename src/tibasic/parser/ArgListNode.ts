import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import ExpressionNode from './ExpressionNode'

export default class ArgListNode extends ASTNode {
  readonly arglist: ExpressionNode[] = []

  constructor() {
    super('ArgList')
  }

  static parse = (parser: Parser): ArgListNode => {
    const node = new ArgListNode()
    node.arglist.push(ExpressionNode.parse(parser))
    while (parser.acceptToken(TokenType.Comma)) {
      node.arglist.push(ExpressionNode.parse(parser))
    }
    return node
  }
}