import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import ConditionalNode from './ConditionalNode'
import ExpressionNode from './ExpressionNode'
import ForNode from './ForNode'
import GotoNode from './GotoNode'
import DispNode from './DispNode'
import LblNode from './LblNode'
import PrgmNode from './PrgmNode'
import RepeatNode from './RepeatNode'
import WhileNode from './WhileNode'
import InputNode from './InputNode'
import PromptNode from './PromptNode'
import ClrHomeNode from './ClrHomeNode'
import OutputNode from './OutputNode'
import MenuNode from './MenuNode'

export default class StatementNode extends ASTNode {
  static parse = (parser: Parser): ASTNode => {
    if (parser.matchToken(TokenType.Identifier, 'If')) {
      return ConditionalNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'While')) {
      return WhileNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Repeat')) {
      return RepeatNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'For')) {
      return ForNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Disp')) {
      return DispNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Output')) {
      return OutputNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Input')) {
      return InputNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Prompt')) {
      return PromptNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'ClrHome')) {
      return ClrHomeNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Prgm')) {
      return PrgmNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Menu')) {
      return MenuNode.parse(parser)
    } else if (parser.acceptToken(TokenType.Identifier, 'Lbl')) {
      return new LblNode(parser.expectToken(TokenType.Identifier).value as string)
    } else if (parser.acceptToken(TokenType.Identifier, 'Goto')) {
      return new GotoNode(parser.expectToken(TokenType.Identifier).value as string)
    } else {
      return ExpressionNode.parse(parser)
    }
  }
}
