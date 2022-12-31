import ASTNode from './ASTNode'

export default class StringNode extends ASTNode {
  readonly value: string

  constructor(value: string) {
    super('String');
    this.value = value
  }
}
