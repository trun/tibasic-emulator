import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import ExpressionNode from './ExpressionNode'
import StatementNode from './StatementNode'
import CodeBlockNode from './CodeBlockNode'

export default class RepeatNode extends ASTNode {
  constructor(predicate: ASTNode, body: ASTNode) {
    super('Repeat')

    this.children.push(predicate)
    this.children.push(body)
  }

  predicate = (): ASTNode => {
    return this.children[0]
  }

  body = (): ASTNode => {
    return this.children[1]
  }

  static parse = (parser: Parser): RepeatNode => {
    parser.expectToken(TokenType.Identifier, 'Repeat')

    const predicate: ASTNode = ExpressionNode.parse(parser)

    // is this right??
    const body: CodeBlockNode = new CodeBlockNode()
    while (!parser.acceptToken(TokenType.Identifier, 'End')) {
      body.children.push(StatementNode.parse(parser))
    }

    return new RepeatNode(predicate, body)
  }
}