import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'

export default class ClrHomeNode extends ASTNode {
  constructor(parent: ASTNode) {
    super('ClrHome', parent)
  }

  static parse = (parser: Parser, parent: ASTNode): ClrHomeNode => {
    parser.expectToken(TokenType.Identifier, 'ClrHome')
    return new ClrHomeNode(parent)
  }
}
