import ASTNode from './ASTNode'

export default class IdentifierNode extends ASTNode {
  readonly identifier: string

  constructor(identifier: string) {
    super('Identifier')
    this.identifier = identifier
  }
}
