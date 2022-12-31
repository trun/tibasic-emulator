import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import ArgListNode from './ArgListNode'

export default class DispNode extends ASTNode {
  constructor(args: ArgListNode) {
    super('Disp');
    this.children.push(args)
  }

  args = (): ArgListNode => {
    return this.children[0] as ArgListNode
  }

  static parse = (parser: Parser): DispNode => {
    parser.expectToken(TokenType.Identifier, 'Disp')
    const args: ArgListNode = ArgListNode.parse(parser)
    return new DispNode(args)
  }
}