import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'

export default class ElseNode extends ASTNode {
  constructor() {
    super('Else')
  }

  static parse = (parser: Parser): ElseNode => {
    parser.expectToken(TokenType.Identifier, 'Else')
    return new ElseNode()
  }
}
