import ASTNode from './ASTNode'
import ArgListNode from './ArgListNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'

export default class InputNode extends ASTNode {
  readonly args: ArgListNode

  constructor(args: ArgListNode) {
    super('Input')

    this.args = args
  }

  static parse = (parser: Parser): InputNode => {
    parser.expectToken(TokenType.Identifier, "Input")
    return new InputNode(ArgListNode.parse(parser))
  }
}
