import ASTNode from '../parser/ASTNode'
import LblNode from '../parser/LblNode'
import WhileNode from '../parser/WhileNode'
import RepeatNode from '../parser/RepeatNode'
import ForNode from '../parser/ForNode'
import DispNode from '../parser/DispNode'
import NumberNode from '../parser/NumberNode'
import StringNode from '../parser/StringNode'
import FunctionCallNode from '../parser/FunctionCallNode'
import IdentifierNode from '../parser/IdentifierNode'
import BinaryOpNode, { BinaryOp } from '../parser/BinaryOpNode'
import GotoNode from '../parser/GotoNode'
import StandardLibrary from './StandardLibrary'
import OutputNode from '../parser/OutputNode'
import HomeScreen from '../screen/HomeScreen'
import PauseNode from '../parser/PauseNode'
import MenuScreen from '../screen/MenuScreen'
import MenuNode from '../parser/MenuNode'
import IfNode from '../parser/IfNode'
import PromptNode from '../parser/PromptNode'
import InputNode from '../parser/InputNode'
import ElseNode from '../parser/ElseNode'
import EndNode from '../parser/EndNode'
import ClrHomeNode from '../parser/ClrHomeNode'

const QUOTED_STRING_RE = /^"([^"]+)"$/

type RunResult = { status: 'run' } |
  { status: 'goto', label: string } |
  { status: 'jump', position: number } |
  { status: 'skip', position: number } |
  { status: 'error', message: string } |
  { status: 'pause' } |
  { status: 'input', callback: (value: string) => void } |
  { status: 'menu' }

type RunStatus = 'Run' | 'Input' | 'Pause'
type ScreenMode = 'Home' | 'Menu'

type ExternalRunResult = {
  status: RunStatus
  screen: ScreenMode
}

export default class Interpreter {
  private readonly homeScreen: HomeScreen
  private readonly menuScreen: MenuScreen
  private screenMode: ScreenMode = 'Home'
  private readonly variables: { [key: string]: any } = {
    'Ans': 0, // TODO - this should have a default?
    'True': true,
    'False': false,
    'Null': null,
    'Pi': Math.PI,
    'e': Math.E,
  }

  readonly labels: { [key: string]: number } = {}
  readonly lines: ASTNode[] = []
  private position: number = 0

  private blockStack: number[] = []
  private skippedBlockHeight: number | undefined = undefined
  private forLoopInitialization: { [position: number]: boolean } = {}
  private ifElsePredicates: { [position: number]: boolean } = {}
  private lastKey: number = 0

  private inputCallback: ((value: string) => void) | null = null

  constructor(homeScreen: HomeScreen, menuScreen: MenuScreen, lines: ASTNode[]) {
    this.homeScreen = homeScreen
    this.menuScreen = menuScreen
    this.loadFunctions().forEach((dict) => {
      Object.entries(dict).forEach(([key, value]) => {
        this.variables[key] = value
      })
    })

    this.lines = lines
    this.labels = {}
    this.scanLabels(lines)
  }

  next = (): ExternalRunResult => {
    let node = this.lines[this.position]

    let result: RunResult
    if (this.screenMode === 'Menu') {
      this.screenMode = 'Home'
      const menuNode = node as MenuNode
      const label = menuNode.options[this.menuScreen.getCurrentIndex()].label.label
      result = { status: 'goto', label }
    } else {
      if (this.skippedBlockHeight !== undefined && this.blockStack.length >= this.skippedBlockHeight) {
        result = this.skipLine(node)
      } else {
        this.skippedBlockHeight = undefined // no longer in skip mode
        result = this.runLine(node)
      }
    }

    let status: RunStatus
    this.inputCallback = null

    switch (result.status) {
      case 'run':
        this.position++
        status = 'Run'
        break
      case 'goto':
        if (result.label in this.labels) {
          this.position = this.labels[result.label]
        } else {
          console.error(`Tried to goto unknown label: ${result.label}`)
          this.position = this.lines.length
        }
        status = 'Run'
        break
      case 'jump':
        this.position = result.position
        status = 'Run'
        break
      case 'pause':
        this.position++
        status = 'Pause'
        break;
      case 'input':
        this.position++
        this.inputCallback = result.callback
        status = 'Input'
        break;
      case 'menu':
        // don't advance position because it's handled on the next iteration
        this.screenMode = 'Menu'
        status = 'Input'
        break;
      case 'error':
        console.error(result.message)
        this.position = this.lines.length
        status = 'Run'
        break
      default:
        throw new Error(`Unexpected run result: ${result.status}`)
    }

    return {
      status,
      screen: this.screenMode,
    }
  }

  hasNext = (): boolean => {
    return this.position < this.lines.length
  }

  setLastKey = (lastKey: number): void => {
    this.lastKey = lastKey
  }

  setInput = (value: string): void => {
    this.inputCallback && this.inputCallback(value)
  }

  private skipLine = (node: ASTNode): RunResult => {
    switch (node.type) {
      case 'While':
      case 'Repeat':
      case 'For':
      case 'Then':
        this.blockStack.push(this.position)
        return { status: 'run' }
      case 'Else':
        this.blockStack.pop()
        this.blockStack.push(this.position)
        // if you hit the else in a skip you should un-skip
        delete this.skippedBlockHeight
        return { status: 'run' }
      case 'End':
        this.blockStack.pop()
        return { status: 'run' }
      default:
        return { status: 'run' }
    }
  }

  private runLine = (node: ASTNode): RunResult => {
    switch (node.type) {
      // Labels
      case 'Lbl':
        return this.visitLbl(node as LblNode)
      case 'Goto':
        return this.visitGoto(node as GotoNode)

      // Control Flow
      case 'Repeat':
        return this.visitRepeat(node as RepeatNode)
      case 'While':
        return this.visitWhile(node as WhileNode)
      case 'For':
        return this.visitFor(node as ForNode)
      case 'If':
        return this.visitIf(node as IfNode)
      case 'Else':
        return this.visitElse(node as ElseNode)
      case 'Then':
        return { status: 'run' } // skip
      case 'End':
        return this.visitEnd(node as EndNode)

      // Screen
      case 'Disp':
        return this.visitDisp(node as DispNode)
      case 'Output':
        return this.visitOutput(node as OutputNode)
      case 'ClrHome':
        return this.visitClrHome(node as ClrHomeNode)
      case 'Menu':
        return this.visitMenu(node as MenuNode)

      // I/O
      case 'Pause':
        return this.visitPause(node as PauseNode)
      case 'Prompt':
        return this.visitPrompt(node as PromptNode)
      case 'Input':
        return this.visitInput(node as InputNode)

      // Expressions
      case 'Number':
      case 'String':
      case 'Identifier':
      case 'BinaryOp':
      case 'FunctionCall':
        return this.visitExpression(node)
      default:
        return { status: 'error', message: `Unexpected AST node type: ${node.type}` }
    }
  }

  private visitLbl(node: LblNode): RunResult {
    return { status: 'run' }
  }

  private visitGoto(node: GotoNode): RunResult {
    return { status: 'goto', label: node.label }
  }

  private visitRepeat(node: RepeatNode): RunResult {
    this.blockStack.push(this.position)
    return { status: 'run' }
  }

  private visitWhile(node: WhileNode): RunResult {
    this.blockStack.push(this.position)
    if (Boolean(this.evaluateNode(node.predicate))) {
      return { status: 'run' }
    } else {
      this.skippedBlockHeight = this.blockStack.length
      return { status: 'run' }
    }
  }

  private visitFor(node: ForNode): RunResult {
    const variable = new IdentifierNode(node.variable)
    const startValue = new NumberNode(Number(this.evaluateNode(node.start)))
    if (!(this.position in this.forLoopInitialization)) {
      this.forLoopInitialization[this.position] = true
      this.evaluateNode(new BinaryOpNode(BinaryOp.Assignment, startValue, variable))
    }
    this.blockStack.push(this.position)
    return { status: 'run' }
  }

  private visitIf(node: IfNode): RunResult {
    const predicate = Boolean(this.evaluateNode(node.predicate))

    // if-then-else
    if (this.lines[this.position + 1].type === 'Then') {
      this.blockStack.push(this.position)
      this.ifElsePredicates[this.position] = predicate
      this.position += 1 // skip the 'Then' line
      if (predicate) {
        return { status: 'run' }
      } else {
        this.skippedBlockHeight = this.blockStack.length
        return { status: 'run' }
      }
    }
    // if
    else {
      if (predicate) {
        return { status: 'run' }
      } else {
        this.position += 1 // skip next line
        return { status: 'run' }
      }
    }
  }

  private visitElse(node: ElseNode): RunResult {
    const ifBlockPosition: number = this.blockStack.pop() as number
    this.blockStack.push(this.position)
    if (this.ifElsePredicates[ifBlockPosition]) {
      this.skippedBlockHeight = this.blockStack.length
    }
    delete this.ifElsePredicates[ifBlockPosition]
    return { status: 'run' }
  }

  private visitEnd(node: EndNode): RunResult {
    const lastBlockPosition: number = this.blockStack.pop() as number
    const lastNode: ASTNode = this.lines[lastBlockPosition]

    if (lastNode.type === 'Repeat') {
      const repeatNode = lastNode as RepeatNode
      if (Boolean(this.evaluateNode(repeatNode.predicate))) {
        return { status: 'run' }
      } else {
        return { status: 'jump', position: lastBlockPosition }
      }
    } else if (lastNode.type === 'While') {
      return { status: 'jump', position: lastBlockPosition }
    } else if (lastNode.type === 'For') {
      const forNode = lastNode as ForNode
      const variable = new IdentifierNode(forNode.variable)
      const endValue = new NumberNode(Number(this.evaluateNode(forNode.end)))
      const stepValue = new NumberNode(Number(this.evaluateNode(forNode.step)))
      const predicate = new BinaryOpNode(BinaryOp.LessThanOrEqual, variable, endValue)
      if (Boolean(this.evaluateNode(predicate))) {
        const nextValue = new BinaryOpNode(BinaryOp.Addition, variable, stepValue)
        this.evaluateNode(new BinaryOpNode(BinaryOp.Assignment, nextValue, variable))
        return { status: 'jump', position: lastBlockPosition }
      } else {
        delete this.forLoopInitialization[this.position]
        return { status: 'run' }
      }
    } else if (lastNode.type === 'Else' || lastNode.type === 'If') {
      return { status: 'run' }
    } else {
      return { status: 'error', message: `Reached END for unimplemented block node: ${lastNode.type}` }
    }
  }

  private visitDisp = (node: DispNode): RunResult => {
    node.args.arglist.forEach(argNode => {
      this.homeScreen.display(this.evaluateNode(argNode))
    })
    return { status: 'run' }
  }

  private visitOutput = (node: OutputNode): RunResult => {
    const body = this.evaluateNode(node.expression)
    this.homeScreen.output(node.row, node.col, body)
    return { status: 'run' }
  }

  private visitPrompt = (node: PromptNode): RunResult => {
    const promptArgs = node.variables
    const identifier: string = (promptArgs.arglist[0] as IdentifierNode).identifier
    const prompt: string = `${identifier}=?`
    this.homeScreen.display(prompt)
    return { status: 'input', callback: this.makeParseInputCallback(identifier) }
  }

  private visitInput = (node: InputNode): RunResult => {
    const inputArgs = node.args

    let prompt: string
    let identifier: string
    if (inputArgs.arglist.length === 2) {
      prompt = String(this.evaluateNode(inputArgs.arglist[0]))
      identifier = (inputArgs.arglist[1] as IdentifierNode).identifier
    } else {
      prompt = '?'
      identifier = (inputArgs.arglist[0] as IdentifierNode).identifier
    }

    this.homeScreen.display(prompt)
    return { status: 'input', callback: this.makeParseInputCallback(identifier) }
  }

  private visitClrHome = (node: ClrHomeNode): RunResult => {
    this.homeScreen.clear()
    return { status: 'run' }
  }

  private visitMenu = (node: MenuNode): RunResult => {
    const title = String(this.evaluateNode(node.title))
    const labels = node.options.map(option => String(this.evaluateNode(option.option)))
    this.menuScreen.setTitleAndOptions(title, labels)
    return { status: 'menu' }
  }

  private visitPause = (node: PauseNode): RunResult => {
    if (node.args.arglist.length > 0) {
      this.homeScreen.display(this.evaluateNode(node.args.arglist[0]))
    }
    return { status: 'pause' }
  }

  private visitExpression = (node: ASTNode): RunResult => {
    this.variables['Ans'] = this.evaluateNode(node)
    return { status: 'run' }
  }

  private makeParseInputCallback = (identifier: string) => {
    return (value: string) => {
      value = value || '0' // FIXME default to 0 for simplicity
      if (QUOTED_STRING_RE.test(value)) {
        this.variables[identifier] = QUOTED_STRING_RE.exec(value)![1]
      } else {
        this.variables[identifier] = parseFloat(value)
      }
    }
  }

  private scanLabels = (lines: ASTNode[]): void => {
    lines.forEach((childNode, position) => {
      if (childNode instanceof LblNode) {
        const label = (childNode as LblNode).label
        if (label in this.labels) {
          throw new Error(`Label '${label} is already declared!'`)
        }
        this.labels[label] = position
      }
    })
  }

  private loadFunctions = (path?: string): { [key: string]: (...args: any[]) => any }[] => {
    return [
      StandardLibrary.getFunctions()
    ]
  }

  private evaluateNode = (node: ASTNode): any => {
    if (node instanceof NumberNode) {
      return (node as NumberNode).value
    } else if (node instanceof StringNode) {
      return (node as StringNode).value
    } else if (node instanceof FunctionCallNode) {
      const functionCallNode = node as FunctionCallNode
      const target = this.evaluateNode(functionCallNode.target)
      if (target && target instanceof Function) {
        const args: any[] = functionCallNode.args.arglist.map(argNode => this.evaluateNode(argNode))
        return (target as Function)(...args)
      }
    } else if (node instanceof IdentifierNode) {
      const identifier = (node as IdentifierNode).identifier
      if (identifier === 'getKey') {
        const retVal = this.lastKey
        this.lastKey = 0
        return retVal
      } else if (identifier in this.variables) {
        return this.variables[identifier]
      } else {
        // unused variables are initialized to 0 upon first access
        this.variables[identifier] = 0
        return this.variables[identifier]
      }
    } else if (node instanceof BinaryOpNode) {
      return this.interpretBinaryOpNode(node as BinaryOpNode)
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
        return this.evaluateNode(node.left) === this.evaluateNode(node.right)
      case BinaryOp.NotEqual:
        return this.evaluateNode(node.left) !== this.evaluateNode(node.right)
      case BinaryOp.GreaterThan:
        return this.getLeftAsNumber(node) > this.getRightAsNumber(node)
      case BinaryOp.GreaterThanOrEqual:
        return this.getLeftAsNumber(node) >= this.getRightAsNumber(node)
      case BinaryOp.LessThan:
        return this.getLeftAsNumber(node) < this.getRightAsNumber(node)
      case BinaryOp.LessThanOrEqual:
        return this.getLeftAsNumber(node) <= this.getRightAsNumber(node)
      case BinaryOp.Assignment:
        const value = this.evaluateNode(node.left)
        const variable = (node.right as IdentifierNode).identifier
        // TODO protect overwriting globals e.g. True / False
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
    return Number(this.evaluateNode(node.left))
  }

  private getRightAsNumber(node: BinaryOpNode): number {
    return Number(this.evaluateNode(node.right))
  }

  private getLeftAsBoolean(node: BinaryOpNode): boolean {
    return Boolean(this.evaluateNode(node.left))
  }

  private getRightAsBoolean(node: BinaryOpNode): boolean {
    return Boolean(this.evaluateNode(node.right))
  }

}
