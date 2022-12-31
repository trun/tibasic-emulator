import ASTNode from './ASTNode'

export default class LblNode extends ASTNode {
  readonly label: string

  constructor(label: string) {
    super('Lbl')

    this.label = label
  }
}