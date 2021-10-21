import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'

export default class PrgmNode extends ASTNode {
  readonly prgmPath: string

  constructor(prgmPath: string) {
    super()

    this.prgmPath = prgmPath
  }

  static parse = (parser: Parser): PrgmNode => {
    parser.expectToken(TokenType.Identifier, 'Prgm')
    return new PrgmNode(parser.expectToken(TokenType.String).value as string)
  }
}
