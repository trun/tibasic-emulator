import ASTNode from './ASTNode'
import ArgListNode from './ArgListNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'

export default class PromptNode extends ASTNode {
  readonly variables: ArgListNode

  constructor(variables: ArgListNode) {
    super('Prompt')
    this.variables = variables
  }

  static parse = (parser: Parser): PromptNode => {
    parser.expectToken(TokenType.Identifier, "Prompt")
    return new PromptNode(ArgListNode.parse(parser))
  }
}
