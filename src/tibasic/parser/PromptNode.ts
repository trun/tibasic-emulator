import ASTNode from './ASTNode'
import ArgListNode from './ArgListNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'

export default class PromptNode extends ASTNode {
  constructor(variables: ArgListNode) {
    super()
    this.children.push(variables)
  }

  variables = (): ArgListNode => {
    return this.children[0] as ArgListNode
  }

  static parse = (parser: Parser): PromptNode => {
    parser.expectToken(TokenType.Identifier, "Prompt");
    return new PromptNode(ArgListNode.parse(parser));
  }
}
