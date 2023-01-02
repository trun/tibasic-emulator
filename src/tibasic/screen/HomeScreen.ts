export const MAX_ROWS: number = 8
export const MAX_COLS: number = 16
const EMPTY_LINE: string = ' '.repeat(MAX_COLS)

export default class HomeScreen {
  private chars: string = HomeScreen.makeEmptyLines()

  output = (row: number, col:number, value: any): void => {
    const offset = this.offset(row, col)
    const line = String(value)
    this.chars = this.chars.substring(0, offset) + line + this.chars.substring(offset + line.length)
  }

  display = (value: any): void => {
    if (typeof value === 'string') {
      this.displayString(String(value))
    } else if (typeof value === 'number') {
      this.displayNumber(Number(value))
    } else {
      throw new Error(`Unexpected value: ${value} (${typeof value})`)
    }
  }

  clear = (): void => {
    this.chars = HomeScreen.makeEmptyLines()
  }

  getChars = (): string => {
    return this.chars
  }

  private displayNumber = (value: number): void => {
    this.displayString(value.toString().padStart(MAX_COLS, ' '))
  }

  private displayString = (line: string): void => {
    if (line.length <= MAX_COLS) {
      line = line.padEnd(MAX_COLS, ' ')
    } else {
      line = line.substr(0, MAX_COLS - 3) + '...'
    }

    // find a blank line -- TODO what if there aren't any
    let row = 1
    while (row <= MAX_ROWS) {
      if (this.chars.substr(this.offset(row, 1), MAX_COLS) === EMPTY_LINE) {
        break
      } else {
        row++
      }
    }

    // TODO need to fix scrolling behavior?
    // if (row === MAX_ROWS) {
    //   this.chars = HomeScreen.makeEmptyLines()
    //   row = 1
    // }

    this.output(row, 1, line)

    // if all lines have text now, scroll
    if (row >= MAX_ROWS) {
      this.chars = this.chars.substring(MAX_COLS) + HomeScreen.makeEmptyLine()
    }
  }

  /**
   * convert 1-based row and column to a singular 0-based offset
   *
   * @param row 1-8
   * @param col 1-16
   */
  private offset = (row: number, col: number): number => {
    return (row - 1) * MAX_COLS + (col - 1)
  }

  static makeEmptyLine = (): string => {
    return ' '.repeat(MAX_COLS)
  }

  static makeEmptyLines = (): string => {
    return ' '.repeat(MAX_ROWS * MAX_COLS)
  }
}
