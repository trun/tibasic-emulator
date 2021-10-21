import ASTNode from './ASTNode'

export default class GotoNode extends ASTNode {
  readonly label: string

  constructor(label: string) {
    super()
    this.label = label
  }
}