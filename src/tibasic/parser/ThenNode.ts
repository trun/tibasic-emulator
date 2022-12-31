import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'

export default class ThenNode extends ASTNode {
  constructor() {
    super('Then');
  }

  static parse = (parser: Parser): ThenNode => {
    parser.expectToken(TokenType.Identifier, 'Then')
    return new ThenNode()
  }
}
