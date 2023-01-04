import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import ExpressionNode from './ExpressionNode'
import LblNode from './LblNode'

interface OptionAndLabel {
  option: ExpressionNode
  label: LblNode
}

export default class MenuNode extends ASTNode {
  readonly title: ExpressionNode
  readonly options: OptionAndLabel[]

  constructor(title: ExpressionNode, options: OptionAndLabel[]) {
    super('Menu')

    this.title = title
    this.options = options
  }

  static parse = (parser: Parser): MenuNode => {
    parser.expectToken(TokenType.Identifier, 'Menu')
    parser.expectToken(TokenType.Parentheses, '(')

    const title = ExpressionNode.parse(parser)
    const options: OptionAndLabel[] = []
    while (parser.acceptToken(TokenType.Comma)) {
      const option = ExpressionNode.parse(parser)
      parser.expectToken(TokenType.Comma)

      let label
      try {
        label = new LblNode(parser.expectToken(TokenType.Identifier).value as string)
      } catch (e) {
        label = new LblNode(parser.expectToken(TokenType.Number).value as string)
        console.log('Label', label)
      }

      options.push({ option, label })
    }

    // closing paren is optional?
    parser.acceptToken(TokenType.Parentheses, ')')

    return new MenuNode(title, options)
  }
}
