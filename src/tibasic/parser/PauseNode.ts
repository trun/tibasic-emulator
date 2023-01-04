import ASTNode from './ASTNode'
import ArgListNode from './ArgListNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'

export default class PauseNode extends ASTNode {
  readonly args: ArgListNode

  constructor(args: ArgListNode) {
    super('Pause')
    this.args = args
  }

  static parse = (parser: Parser): PauseNode => {
    parser.expectToken(TokenType.Identifier, "Pause")
    return new PauseNode(new ArgListNode()) // TODO support arguments to pause
  }
}
