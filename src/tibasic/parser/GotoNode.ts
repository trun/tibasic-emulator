import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'

export default class GotoNode extends ASTNode {
  readonly label: string

  constructor(label: string) {
    super('Goto')
    this.label = label
  }

  static parse = (parser: Parser): GotoNode => {
    let identifier
    try {
      identifier = parser.expectToken(TokenType.Identifier).value as string
    } catch (e) {
      identifier = String(Math.round(parser.expectToken(TokenType.Number).value as number))
    }
    return new GotoNode(identifier)
  }
}
