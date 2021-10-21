import ASTNode from './ASTNode'
import ArgListNode from './ArgListNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'

export default class InputNode extends ASTNode {
  constructor(variables: ArgListNode) {
    super()
    this.children.push(variables)
  }

  variables = (): ArgListNode => {
    return this.children[0] as ArgListNode
  }

  static parse = (parser: Parser): InputNode => {
    parser.expectToken(TokenType.Identifier, "Input");
    return new InputNode(ArgListNode.parse(parser));
  }
}
