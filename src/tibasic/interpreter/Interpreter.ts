import ASTNode from '../parser/ASTNode'
import LblNode from '../parser/LblNode'
import CodeBlockNode from '../parser/CodeBlockNode'
import ConditionalNode from '../parser/ConditionalNode'
import WhileNode from '../parser/WhileNode'
import RepeatNode from '../parser/RepeatNode'
import ForNode from '../parser/ForNode'
import DispNode from '../parser/DispNode'
import NumberNode from '../parser/NumberNode'
import StringNode from '../parser/StringNode'
import FunctionCallNode from '../parser/FunctionCallNode'
import IdentifierNode from '../parser/IdentifierNode'
import BinaryOpNode, {BinaryOp} from '../parser/BinaryOpNode'
import GotoNode from '../parser/GotoNode'
import PrgmNode from '../parser/PrgmNode'
import PromptNode from '../parser/PromptNode'
import InputNode from '../parser/InputNode'
import StandardLibrary from './StandardLibrary'
import OutputNode from '../parser/OutputNode'
import ClrHomeNode from '../parser/ClrHomeNode'

export default class Interpreter {
  private readonly variables: { [key: string]: any } = {
    'True': true,
    'False': false,
    'Null': null,
    'Pi': Math.PI,
    'e': Math.E,
  }

  private labels: { [key: string]: number } = {}

  private position: number = 0

  input: string = ''

  constructor() {
    this.loadFunctions().forEach((dict) => {
      Object.entries(dict).forEach(([key, value]) => {
        this.variables[key] = value
      })
    })
  }

  interpret = (node: ASTNode): void => {
    this.labels = {}
    this.scanLabels(node)

    for (this.position = 0; this.position < node.children.length; this.position++) {
      this.executeStatement(node.children[this.position])
    }
  }

  private scanLabels = (node: ASTNode): void => {
    node.children.forEach(childNode => {
      if (childNode instanceof LblNode) {
        const label = (childNode as LblNode).label
        if (label in this.labels) {
          throw new Error(`Label '${label} is already declared!'`)
        }
        this.labels[label] = this.position
      }
    })
  }

  private loadFunctions = (path?: string): { [key: string]: (...args: any[]) => any }[] => {
    // FIXME - other than stdlib?
    return [
      StandardLibrary.getFunctions()
    ]
  }

  private executeStatement = (node: ASTNode) => {
    if (node instanceof CodeBlockNode) {
      node.children.forEach(childNode => {
        this.executeStatement(childNode)
      })
    } else if (node instanceof ConditionalNode) {
      const ifNode = node as ConditionalNode
      const predicateResult: boolean = Boolean(this.evaluateNode(ifNode.predicate()))
      if (predicateResult) {
        this.executeStatement(ifNode.body())
      } else if (ifNode.hasElseBody()) {
        this.executeStatement(ifNode.elseBody())
      }
    } else if (node instanceof WhileNode) {
      const whileNode = node as WhileNode
      while (Boolean(this.evaluateNode(whileNode.predicate()))) {
        this.executeStatement(whileNode.body())
      }
    } else if (node instanceof RepeatNode) {
      const repeatNode = node as RepeatNode
      do {
        this.executeStatement(repeatNode.body())
      } while (Boolean(this.evaluateNode(repeatNode.predicate())))
    } else if (node instanceof ForNode) {
      const forNode = node as ForNode
      if (!(forNode.variable in this.variables)) {
        this.variables[forNode.variable] = 0
      }
      for (this.variables[forNode.variable] = this.evaluateNode(forNode.start());
           Number(this.variables[forNode.variable]) < Number(this.evaluateNode(forNode.end()));
           this.variables[forNode.variable] += Number(this.evaluateNode(forNode.step()))) {
        this.executeStatement(forNode.body())
      }
    } else if (node instanceof DispNode) {
      const dispNode = node as DispNode
      dispNode.children.forEach(childNode => {
        console.log(String(this.evaluateNode(childNode)))
        // TODO output to console
      })
      // TODO output "\n" to console
    } else if (node instanceof OutputNode) {
      const outputNode = node as OutputNode
      // TODO put text to console
    } else if (node instanceof ClrHomeNode) {
      const clrHomeNode = node as ClrHomeNode
      // TODO clear home screen and reset cursor
    } else if (node instanceof InputNode) {
      // TODO
    } else if (node instanceof PromptNode) {
      // TODO
    } else if (node instanceof PrgmNode) {
      // TODO
    } else if (node instanceof LblNode) {
      // ignored
    } else if (node instanceof GotoNode) {
      const label = (node as GotoNode).label
      if (label in this.labels) {
        this.position = this.labels[label]
      } else {
        throw new Error(`Goto undefined label: ${label}`)
      }
    } else {
      this.evaluateNode(node)
    }
  }

  private evaluateNode = (node: ASTNode): any => {
    if (node instanceof NumberNode) {
      return (node as NumberNode).value
    } else if (node instanceof StringNode) {
      return (node as StringNode).value
    } else if (node instanceof FunctionCallNode) {
      const functionCallNode = node as FunctionCallNode
      const target = this.evaluateNode(functionCallNode.target())
      if (target && target instanceof Function) {
        const args: any[] = functionCallNode.args().children.map(argNode => this.evaluateNode(argNode))
        return (target as Function)(...args)
      }
    } else if (node instanceof IdentifierNode) {
      const identifier = (node as IdentifierNode).identifier
      if (identifier === 'getKey') {
        // return readLine(true) // FIXME
      } else if (identifier in this.variables) {
        return this.variables[identifier]
      } else {
        throw new Error(`Identifier '${identifier}' is not defined`)
      }
    } else if (node instanceof BinaryOpNode) {
      this.interpretBinaryOpNode(node as BinaryOpNode)
    } else {
      throw new Error(`Unexpected node in interpreter: ${node}`)
    }
  }

  private interpretBinaryOpNode = (node: BinaryOpNode): any => {
    switch (node.op) {
      case BinaryOp.Addition:
        return this.getLeftAsNumber(node) + this.getRightAsNumber(node)
      case BinaryOp.Subtraction:
        return this.getLeftAsNumber(node) - this.getRightAsNumber(node)
      case BinaryOp.Multiplication:
        return this.getLeftAsNumber(node) * this.getRightAsNumber(node)
      case BinaryOp.Division:
        return this.getLeftAsNumber(node) / this.getRightAsNumber(node)
      case BinaryOp.Modulus:
        return this.getLeftAsNumber(node) % this.getRightAsNumber(node)
      case BinaryOp.Equal:
        return this.evaluateNode(node.left()) === this.evaluateNode(node.right())
      case BinaryOp.NotEqual:
        return this.evaluateNode(node.left()) !== this.evaluateNode(node.right())
      case BinaryOp.GreaterThan:
        return this.getLeftAsNumber(node) > this.getRightAsNumber(node)
      case BinaryOp.GreaterThanOrEqual:
        return this.getLeftAsNumber(node) >= this.getRightAsNumber(node)
      case BinaryOp.LessThan:
        return this.getLeftAsNumber(node) < this.getRightAsNumber(node)
      case BinaryOp.LessThanOrEqual:
        return this.getLeftAsNumber(node) <= this.getRightAsNumber(node)
      case BinaryOp.Assignment:
        const value = this.evaluateNode(node.left())
        const variable = (node.right() as IdentifierNode).identifier
        this.variables[variable] = value
        return value
      case BinaryOp.And:
        return this.getLeftAsBoolean(node) && this.getRightAsBoolean(node)
      case BinaryOp.Or:
        return this.getLeftAsBoolean(node) || this.getRightAsBoolean(node)
      default:
        throw new Error(`Unexpected binary operation: ${node.op}`)
    }
  }

  private getLeftAsNumber(node: BinaryOpNode): number {
    return Number(this.evaluateNode(node.left()))
  }

  private getRightAsNumber(node: BinaryOpNode): number {
    return Number(this.evaluateNode(node.right()))
  }

  private getLeftAsBoolean(node: BinaryOpNode): boolean {
    return Boolean(this.evaluateNode(node.left()))
  }

  private getRightAsBoolean(node: BinaryOpNode): boolean {
    return Boolean(this.evaluateNode(node.right()))
  }

}
