type NodeType = 'ArgList' | 'BinaryOp' | 'ClrHome' | 'CodeBlock' | 'Conditional' | 'Disp' | 'Expression' | 'For' |
  'FunctionCall' | 'Goto' | 'Identifier' | 'Input' | 'Lbl' | 'Menu' | 'Number' | 'Output' | 'Prgm' | 'Prompt' |
  'Repeat' | 'Statement' | 'String' | 'While' | 'End'

export default class ASTNode {
  readonly type: NodeType
  readonly parent: ASTNode | null

  constructor(type: NodeType, parent: ASTNode | null) {
    this.type = type
    this.parent = parent
  }
}
