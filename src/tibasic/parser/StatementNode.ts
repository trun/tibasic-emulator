import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import IfNode from './IfNode'
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
import EndNode from './EndNode'
import ThenNode from './ThenNode'
import PauseNode from './PauseNode'
import ElseNode from './ElseNode'

export default class StatementNode extends ASTNode {
  static parse = (parser: Parser): ASTNode => {
    if (parser.matchToken(TokenType.Identifier, 'If')) {
      return IfNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Then')) {
      return ThenNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Else')) {
      return ElseNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'While')) {
      return WhileNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Repeat')) {
      return RepeatNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'For')) {
      return ForNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'End')) {
      return EndNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Disp')) {
      return DispNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Output')) {
      return OutputNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Input')) {
      return InputNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Prompt')) {
      return PromptNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Pause')) {
      return PauseNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'ClrHome')) {
      return ClrHomeNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Prgm')) {
      return PrgmNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Menu')) {
      return MenuNode.parse(parser)
    } else if (parser.acceptToken(TokenType.Identifier, 'Lbl')) {
      // FIXME accept numeric labels
      return new LblNode(parser.expectToken(TokenType.Identifier).value as string)
    } else if (parser.acceptToken(TokenType.Identifier, 'Goto')) {
      // FIXME accept numeric labels
      return new GotoNode(parser.expectToken(TokenType.Identifier).value as string)
    } else {
      return ExpressionNode.parse(parser)
    }
  }
}
