import ASTNode from './ASTNode'

export default class StringNode extends ASTNode {
  readonly value: string

  constructor(value: string) {
    super();
    this.value = value
  }
}
