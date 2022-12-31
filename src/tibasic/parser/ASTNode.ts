type NodeType = 'ArgList' | 'BinaryOp' | 'ClrHome' | 'CodeBlock' | 'Conditional' | 'Disp' | 'Expression' | 'For' |
  'FunctionCall' | 'Goto' | 'Identifier' | 'Input' | 'Lbl' | 'Menu' | 'Number' | 'Output' | 'Prgm' | 'Prompt' |
  'Repeat' | 'Statement' | 'String' | 'While' | 'End' | 'If' | 'Then' | 'Else'

export default class ASTNode {
  readonly type: NodeType

  constructor(type: NodeType) {
    this.type = type
  }
}
