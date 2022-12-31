import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'

export default class EndNode extends ASTNode {
  constructor() {
    super('End')
  }

  static parse = (parser: Parser): EndNode => {
    parser.expectToken(TokenType.Identifier, 'End')
    return new EndNode()
  }
}
