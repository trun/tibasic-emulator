import ASTNode from './ASTNode'

export default class NumberNode extends ASTNode {
  readonly value: number

  constructor(value: number) {
    super();
    this.value = value
  }
}
