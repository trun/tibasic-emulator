import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import ExpressionNode from './ExpressionNode'

export default class ArgListNode extends ASTNode {
  static parse = (parser: Parser): ArgListNode => {
    const node = new ArgListNode()
    node.children.push()
    while (parser.acceptToken(TokenType.Comma)) {
      node.children.push(ExpressionNode.parse(parser))
    }
    return node
  }
}