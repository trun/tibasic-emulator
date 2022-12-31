import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import ArgListNode from './ArgListNode'

export default class DispNode extends ASTNode {
  readonly args: ArgListNode

  constructor(args: ArgListNode) {
    super('Disp');
    this.args = args
  }

  static parse = (parser: Parser): DispNode => {
    parser.expectToken(TokenType.Identifier, 'Disp')
    const args: ArgListNode = ArgListNode.parse(parser)
    return new DispNode(args)
  }
}
