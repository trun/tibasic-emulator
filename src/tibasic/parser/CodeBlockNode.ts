import ASTNode from './ASTNode'
import Parser from './Parser'
import StatementNode from './StatementNode'

export default class CodeBlockNode extends ASTNode {
  readonly children: StatementNode[] = []

  constructor() {
    super('CodeBlock', null)
  }

  static parse = (parser: Parser): CodeBlockNode => {
    const node = new CodeBlockNode()
    while (!parser.endOfStream()) {
      node.children.push(StatementNode.parse(parser));
    }
    return node
  }
}
