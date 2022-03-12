import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'

export default class ClrHomeNode extends ASTNode {
  static parse = (parser: Parser): ClrHomeNode => {
    parser.expectToken(TokenType.Identifier, 'ClrHome')
    return new ClrHomeNode()
  }
}
