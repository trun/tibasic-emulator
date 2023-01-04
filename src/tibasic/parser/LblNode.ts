import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'

export default class LblNode extends ASTNode {
  readonly label: string

  constructor(label: string) {
    super('Lbl')

    this.label = label
  }

  static parse = (parser: Parser): LblNode => {
    let identifier
    try {
      identifier = parser.expectToken(TokenType.Identifier).value as string
    } catch (e) {
      identifier = String(Math.round(parser.expectToken(TokenType.Number).value as number))
    }
    return new LblNode(identifier)
  }
}