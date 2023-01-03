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
import PrgmNode from '../parser/PrgmNode'
import PromptNode from '../parser/PromptNode'
import InputNode from '../parser/InputNode'
import StandardLibrary from './StandardLibrary'
import OutputNode from '../parser/OutputNode'
import ClrHomeNode from '../parser/ClrHomeNode'
import HomeScreen from '../screen/HomeScreen'
import PauseNode from '../parser/PauseNode'
import MenuScreen from '../screen/MenuScreen'
import MenuNode from '../parser/MenuNode'

type RunResult = { status: 'run' } |
  { status: 'goto', label: string } |
  { status: 'jump', position: number } |
  { status: 'skip', position: number } |
  { status: 'error', message: string } |
  { status: 'pause' } |
  { status: 'menu' }

export default class Interpreter {
  private readonly homeScreen: HomeScreen
  private readonly menuScreen: MenuScreen
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
  private lastKey: number = 0

  // TODO use this for callbacks?
  input: string = ''

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

  next = (): boolean => {
    const node = this.lines[this.position]

    let result: RunResult
    if (this.skippedBlockHeight !== undefined && this.blockStack.length > this.skippedBlockHeight) {
      result = this.skipLine(node)
    } else {
      this.skippedBlockHeight = undefined // no longer in skip mode
      result = this.runLine(node)
    }

    switch (result.status) {
      case 'run':
        this.position++
        break
      case 'goto':
        this.position = this.labels[result.label]
        break
      case 'jump':
        this.position = result.position
        break
      case 'pause':
        this.position++
        return false
      case 'error':
        console.error(result.message)
        this.position = this.lines.length
        break
    }

    return true
  }

  hasNext = (): boolean => {
    return this.position < this.lines.length
  }

  setLastKey = (lastKey: number): void => {
    this.lastKey = lastKey
  }

  private skipLine = (node: ASTNode): RunResult => {
    switch (node.type) {
      case 'While':
      case 'Repeat':
      case 'For':
      case 'Then':
        this.blockStack.push(this.position)
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
        return { status: 'run' }
      case 'Goto':
        return { status: 'goto', label: (node as GotoNode).label }

      // Control Flow
      case 'Repeat':
        this.blockStack.push(this.position)
        return { status: 'run' }
      case 'While':
        const whileNode = node as WhileNode
        this.blockStack.push(this.position)
        if (Boolean(this.evaluateNode(whileNode.predicate))) {
          return { status: 'run' }
        } else {
          this.skippedBlockHeight = this.blockStack.length
          return { status: 'run' }
        }
      case 'For':
        const forNode = node as ForNode
        const variable = new IdentifierNode(forNode.variable)
        const startValue = new NumberNode(Number(this.evaluateNode(forNode.start)))
        if (!(this.position in this.forLoopInitialization)) {
          this.forLoopInitialization[this.position] = true
          this.evaluateNode(new BinaryOpNode(BinaryOp.Assignment, startValue, variable))
        }
        this.blockStack.push(this.position)
        return { status: 'run' }

      case 'End':
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
        } else {
          return { status: 'error', message: `Reached END for unimplemented block node: ${lastNode.type}` }
        }

      // Screen
      case 'Disp':
        const dispNode = node as DispNode
        dispNode.args.arglist.forEach(argNode => {
          this.homeScreen.display(this.evaluateNode(argNode))
        })
        return { status: 'run' }
      case 'Output':
        const outputNode = node as OutputNode
        const body = this.evaluateNode(outputNode.expression)
        this.homeScreen.output(outputNode.row, outputNode.col, body)
        return { status: 'run' }
      case 'ClrHome':
        this.homeScreen.clear()
        return { status: 'run' }
      case 'Menu':
        const menuNode = node as MenuNode
        const title = String(this.evaluateNode(menuNode.title))
        const labels = menuNode.options.map(option => String(this.evaluateNode(option.option)))
        this.menuScreen.setTitleAndOptions(title, labels)
        return { status: 'menu' }

      // I/O
      case 'Pause':
        const pauseNode = node as PauseNode
        if (pauseNode.args.arglist.length > 0) {
          this.homeScreen.display(this.evaluateNode(pauseNode.args.arglist[0]))
        }
        return { status: 'pause' }

      // Expressions
      case 'Number':
      case 'String':
      case 'Identifier':
      case 'BinaryOp':
      case 'FunctionCall':
        const result = this.evaluateNode(node)
        this.variables['Ans'] = result
        return { status: 'run' }
      default:
        return { status: 'error', message: `Unexpected AST node type: ${node.type}` }
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

  private executeStatement = (node: ASTNode) => {
    // FIXME handle block statements / conditionals
    // if (node instanceof CodeBlockNode) {
    //   node.children.forEach(childNode => {
    //     this.executeStatement(childNode)
    //   })
    // } else if (node instanceof ConditionalNode) {
    //   const ifNode = node as ConditionalNode
    //   const predicateResult: boolean = Boolean(this.evaluateNode(ifNode.predicate()))
    //   if (predicateResult) {
    //     this.executeStatement(ifNode.body())
    //   } else if (ifNode.hasElseBody()) {
    //     this.executeStatement(ifNode.elseBody())
    //   }
    // } else if (node instanceof WhileNode) {
    //   const whileNode = node as WhileNode
    //   while (Boolean(this.evaluateNode(whileNode.predicate()))) {
    //     // TODO better event loop
    //     setTimeout(() => {
    //       this.executeStatement(whileNode.body())
    //     }, 10)
    //   }
    // } else if (node instanceof RepeatNode) {
    //   const repeatNode = node as RepeatNode
    //
    //   this.executeStatement(repeatNode.body())
    //   if (!Boolean(this.evaluateNode(repeatNode.predicate()))) {
    //     // TODO we need a better way to break outer loops, this shouldn't progress until complete...
    //     await new Promise((resolve => {
    //       setTimeout(() => {
    //         this.executeStatement(repeatNode.body())
    //         resolve(true)
    //       }, 1000)
    //     }))
    //   }
    // } else if (node instanceof ForNode) {
    //   const forNode = node as ForNode
    //   if (!(forNode.variable in this.variables)) {
    //     this.variables[forNode.variable] = 0
    //   }
    //   for (this.variables[forNode.variable] = this.evaluateNode(forNode.start());
    //        Number(this.variables[forNode.variable]) < Number(this.evaluateNode(forNode.end()));
    //        this.variables[forNode.variable] += Number(this.evaluateNode(forNode.step()))) {
    //     this.executeStatement(forNode.body())
    //   }

    if (node instanceof DispNode) {
      const dispNode = node as DispNode
      dispNode.args.arglist.forEach(argNode => {
        this.homeScreen.display(this.evaluateNode(argNode))
      })
    } else if (node instanceof OutputNode) {
      const outputNode = node as OutputNode
      const body = this.evaluateNode(outputNode.expression)
      this.homeScreen.output(outputNode.row, outputNode.col, body)
    } else if (node instanceof ClrHomeNode) {
      this.homeScreen.clear()
    } else if (node instanceof InputNode) {
      const args = (node as InputNode).args

      // TODO handle invalid args?
      let prompt
      let identifier
      if (args.arglist.length === 2) {
        prompt = String(this.evaluateNode(args.arglist[0]))
        identifier = (args.arglist[1] as IdentifierNode).identifier
      } else {
        prompt = '?'
        identifier = (args.arglist[0] as IdentifierNode).identifier
      }

      const value: string | null = window.prompt(prompt, '')
      if (value === null) {
        // FIXME crash here?
        console.error('User cancelled the prompt -- no input received')
      } else {
        this.variables[identifier] = value
      }
    } else if (node instanceof PromptNode) {
      const promptNode = node as PromptNode
      promptNode.variables.arglist.forEach(varNode => {
        const identifier = (varNode as IdentifierNode).identifier
        const value: string | null = window.prompt(`${identifier}=?`, '')

        // TODO parse the input as a program? or something like that for better string handling?
        if (value === null) {
          // FIXME crash here?
          console.error('User cancelled the prompt -- no input received')
        } else if (!isNaN(Number(value))) {
          this.variables[identifier] = Number(value)
        } else if (value.length >= 3 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
          this.variables[identifier] = value.substring(1, value.length - 1)
        } else {
          // FIXME crash here?
          console.error(`Received invalid user input: ${value}`)
        }
      })
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
      // TODO set 'Ans' on every one of these?
      this.variables['Ans'] = this.evaluateNode(node)
    }
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
        throw new Error(`Identifier '${identifier}' is not defined`)
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
