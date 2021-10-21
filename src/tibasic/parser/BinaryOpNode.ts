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

  constructor(op: BinaryOp, left: ASTNode, right: ASTNode) {
    super();
    this.op = op
    this.children = [left, right]
  }

  left = (): ASTNode => {
    return this.children[0]
  }

  right = (): ASTNode => {
    return this.children[1]
  }
}