import ASTNode from './ASTNode'
import ArgListNode from './ArgListNode'

export default class FunctionCallNode extends ASTNode {
  constructor(target: ASTNode, args: ArgListNode) {
    super();
    this.children.push(target)
    this.children.push(args)
  }

  target = (): ASTNode => {
    return this.children[0]
  }

  args = (): ArgListNode => {
    return this.children[1] as ArgListNode
  }
}
