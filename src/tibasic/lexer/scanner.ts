import { Token, TokenType } from './scanner.d'

const WHITESPACE_RE = /\s/

const ALPHANUMERIC_RE = /[a-zA-Z0-9.]/ // TODO theta?
const NUMERIC_RE = /^(-)?[0-9]+(\.[0-9]+)?$/

export default class Scanner {
  scan = (code: string): Array<Token> => {
    const result: Array<Token> = []
    let position: number = 0

    const eof = (): boolean => {
      return position >= code.length
    }

    const peekChar = (): string => {
      return code[position]
    }

    const readChar = (): string => {
      return code[position++]
    }

    const whitespace = (): void => {
      while (!eof() && WHITESPACE_RE.test(peekChar())) {
        position++
      }
    }

    const scanString = (): any => {
      let result = ''
      position++ // skip over opening quote mark
      while (!eof() && peekChar() !== '"') {
        result += readChar()
      }
      position++ // skip over closing quote mark

      return {
        type: TokenType.String,
        value: result
      }
    }

    const scanData = (): Token => {
      let result = ''
      while (!eof() && ALPHANUMERIC_RE.test(peekChar())) {
        result += readChar()
      }

      if (NUMERIC_RE.test(result) && !Number.isNaN(parseFloat(result))) {
        return {
          type: TokenType.Number,
          value: parseFloat(result)
        }
      } else {
        return {
          type: TokenType.Identifier,
          value: result
        }
      }
    }

    const nextToken = (): Token => {
      if (ALPHANUMERIC_RE.test(peekChar())) {
        return scanData()
      } else {
        switch (peekChar()) {
          case '"':
            return scanString()
          case '+':
          case '*':
          case '/':
          case '%':
            return { type: TokenType.Operation, value: readChar() }
          case '-':
            readChar()
            if (peekChar() === '>') {
              readChar()
              return { type: TokenType.Assignment, value: '->' }
            } else {
              return { type: TokenType.Operation, value: '-' }
            }
          case '>':
            readChar()
            if (peekChar() === '=') {
              readChar()
              return { type: TokenType.Comparison, value: '>=' }
            } else {
              return { type: TokenType.Comparison, value: '>' }
            }
          case '<':
            readChar()
            if (peekChar() === '=') {
              readChar()
              return { type: TokenType.Comparison, value: '<=' }
            } else {
              return { type: TokenType.Comparison, value: '<' }
            }
          case '=':
          case '!':
            return { type: TokenType.Comparison, value: readChar() }
          case '(':
          case ')':
            return { type: TokenType.Parentheses, value: readChar() }
          case ',':
            return { type: TokenType.Comma, value: readChar() }
          default:
            throw new Error('Unexpected token: ' + peekChar())
        }
      }
    }

    whitespace()
    while (!eof()) {
      result.push(nextToken())
      whitespace()
    }

    return result
  }

}