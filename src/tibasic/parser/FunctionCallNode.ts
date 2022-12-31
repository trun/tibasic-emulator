import ASTNode from './ASTNode'
import ArgListNode from './ArgListNode'

export default class FunctionCallNode extends ASTNode {
  readonly target: ASTNode
  readonly args: ArgListNode

  constructor(target: ASTNode, args: ArgListNode) {
    super('FunctionCall')

    this.target = target
    this.args = args
  }
}
