import ASTNode from './ASTNode'
import Parser from './Parser'
import { TokenType } from '../lexer/scanner.d'
import BinaryOpNode, {BinaryOp} from './BinaryOpNode'
import ArgListNode from './ArgListNode'
import CodeBlockNode from './CodeBlockNode'
import StatementNode from './StatementNode'
import NumberNode from './NumberNode'
import StringNode from './StringNode'
import IdentifierNode from './IdentifierNode'
import FunctionCallNode from './FunctionCallNode'

export default class ExpressionNode extends ASTNode {
  static parse = (parser: Parser): ASTNode => {
    const left: ASTNode = ExpressionNode.parseAdditive(parser)
    if (parser.acceptToken(TokenType.Assignment)) {
      return new BinaryOpNode(BinaryOp.Assignment, left, ExpressionNode.parse(parser))
    } else {
      return left
    }
  }

  static parseAdditive = (parser: Parser): ASTNode => {
    let left: ASTNode = ExpressionNode.parseMultiplicitive(parser)

    // TODO this is a really weirdly written loop
    while (parser.matchToken(TokenType.Operation) ||
        parser.matchToken(TokenType.Identifier, 'and') ||
        parser.matchToken(TokenType.Identifier, 'or')) {
      switch (parser.currentToken().value) {
        case '+':
          parser.acceptToken(TokenType.Operation)
          left = new BinaryOpNode(BinaryOp.Addition, left, ExpressionNode.parseMultiplicitive(parser))
          continue
        case '-':
          parser.acceptToken(TokenType.Operation)
          left = new BinaryOpNode(BinaryOp.Subtraction, left, ExpressionNode.parseMultiplicitive(parser))
          continue
        case 'and':
          parser.acceptToken(TokenType.Identifier)
          left = new BinaryOpNode(BinaryOp.And, left, ExpressionNode.parseMultiplicitive(parser))
          continue
        case 'or':
          parser.acceptToken(TokenType.Identifier)
          left = new BinaryOpNode(BinaryOp.Or, left, ExpressionNode.parseMultiplicitive(parser))
          continue
        default:
          break
      }
      break
    }

    return left
  }

  static parseMultiplicitive = (parser: Parser): ASTNode => {
    let left: ASTNode = ExpressionNode.parseComparison(parser)

    while (parser.matchToken(TokenType.Operation)) {
      switch (parser.currentToken().value) {
        case '*':
          parser.acceptToken(TokenType.Operation)
          left = new BinaryOpNode(BinaryOp.Multiplication, left, ExpressionNode.parseComparison(parser))
          continue
        case '/':
          parser.acceptToken(TokenType.Operation)
          left = new BinaryOpNode(BinaryOp.Division, left, ExpressionNode.parseComparison(parser))
          continue
        case '%':
          parser.acceptToken(TokenType.Operation)
          left = new BinaryOpNode(BinaryOp.Modulus, left, ExpressionNode.parseComparison(parser))
          continue
        default:
          break
      }
      break
    }

    return left
  }

  static parseComparison = (parser: Parser): ASTNode => {
    let left: ASTNode = ExpressionNode.parseFunctionCall(parser)

    while (parser.matchToken(TokenType.Comparison)) {
      switch (parser.currentToken().value) {
        case '=':
          parser.acceptToken(TokenType.Comparison)
          left = new BinaryOpNode(BinaryOp.Equal, left, ExpressionNode.parseFunctionCall(parser))
          continue
        case '!=':
          parser.acceptToken(TokenType.Comparison)
          left = new BinaryOpNode(BinaryOp.NotEqual, left, ExpressionNode.parseFunctionCall(parser))
          continue
        case '>':
          parser.acceptToken(TokenType.Comparison)
          left = new BinaryOpNode(BinaryOp.GreaterThan, left, ExpressionNode.parseFunctionCall(parser))
          continue
        case '<':
          parser.acceptToken(TokenType.Comparison)
          left = new BinaryOpNode(BinaryOp.LessThan, left, ExpressionNode.parseFunctionCall(parser))
          continue
        case '>=':
          parser.acceptToken(TokenType.Comparison)
          left = new BinaryOpNode(BinaryOp.GreaterThanOrEqual, left, ExpressionNode.parseFunctionCall(parser))
          continue
        case '<=':
          parser.acceptToken(TokenType.Comparison)
          left = new BinaryOpNode(BinaryOp.LessThanOrEqual, left, ExpressionNode.parseFunctionCall(parser))
          continue
        default:
          break
      }
      break
    }

    return left
  }

  static parseFunctionCall = (parser: Parser, left?: ASTNode): ASTNode => {
    left = left || ExpressionNode.parseTerm(parser)
    if (parser.matchToken(TokenType.Parentheses, '(')) {
      return ExpressionNode.parseFunctionCall(parser, new FunctionCallNode(left, ArgListNode.parse(parser)));
    } else {
      return left
    }
  }

  static parseTerm = (parser: Parser): ASTNode => {
    if (parser.matchToken(TokenType.Number)) {
      return new NumberNode(parser.expectToken(TokenType.Number).value as number)
    } else if (parser.acceptToken(TokenType.Number, '(')) {
      const statement = ExpressionNode.parse(parser)
      parser.expectToken(TokenType.Parentheses, ')')
      return statement
    } else if (parser.matchToken(TokenType.Identifier, 'Then')) {
      const block = new CodeBlockNode()
      parser.expectToken(TokenType.Identifier, 'Then')
      while (!parser.endOfStream() &&
        !parser.matchToken(TokenType.Identifier, 'EndIf') &&
        !parser.matchToken(TokenType.Identifier, 'Else')) {
        block.children.push(StatementNode.parse(parser))
      }
      if (parser.matchToken(TokenType.Identifier, 'Else')) {
        return block
      }
      parser.expectToken(TokenType.Identifier, 'EndIf')
      return block
    } else if (parser.matchToken(TokenType.Identifier, 'Else')) {
      parser.expectToken(TokenType.Identifier, 'Else')
      return StatementNode.parse(parser)
    } else if (parser.matchToken(TokenType.Identifier, 'Do')) {
      const block = new CodeBlockNode()
      parser.expectToken(TokenType.Identifier, 'Do')
      while (!parser.endOfStream() && !parser.matchToken(TokenType.Identifier, 'End')) {
        block.children.push(StatementNode.parse(parser))
      }
      parser.expectToken(TokenType.Identifier, 'End')
      return block
    } else if (parser.matchToken(TokenType.String)) {
      return new StringNode(parser.expectToken(TokenType.String).value as string)
    } else if (parser.matchToken(TokenType.Identifier)) {
      return new IdentifierNode(parser.expectToken(TokenType.Identifier).value as string)
    } else {
      throw new Error(`Unexpected ${parser.currentToken().type} in parser: ${parser.currentToken().value}`)
    }
  }
}