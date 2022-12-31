import ASTNode from './ASTNode'

export enum BinaryOp {
  Assignment,
  Addition,
  Subtraction,
  Multiplication,
  Division,
  Modulus,
  GreaterThan,
  LessThan,
  Not,
  NotEqual,
  Equal,
  GreaterThanOrEqual,
  LessThanOrEqual,
  And,
  Or,
}

export default class BinaryOpNode extends ASTNode {
  readonly op: BinaryOp
  readonly left: ASTNode
  readonly right: ASTNode

  constructor(op: BinaryOp, left: ASTNode, right: ASTNode, parent: ASTNode) {
    super('BinaryOp', parent)
    this.op = op
    this.left = left
    this.right = right
  }
}
