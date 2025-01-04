import assert from 'node:assert';
import HomeScreen, { MAX_COLS, MAX_ROWS } from './HomeScreen'

const EMPTY_LINE = ' '.repeat(MAX_COLS)

test('display string produces one line', () => {
  const screen = new HomeScreen()
  screen.display('ABC')
  const lines = splitLines(screen.getChars())
  expect(lines[0].trimEnd()).toEqual('ABC')
  expect(linesAreEmpty(lines.slice(1))).toEqual(true)
})

test('display two strings produces two lines', () => {
  const screen = new HomeScreen()
  screen.display('ABC')
  screen.display('XYZ')
  const lines = splitLines(screen.getChars())
  expect(lines[0].trimEnd()).toEqual('ABC')
  expect(lines[1].trimEnd()).toEqual('XYZ')
  expect(linesAreEmpty(lines.slice(2))).toEqual(true)
})

test('display string of max cols length is not ellipsis', () => {
  const screen = new HomeScreen()
  screen.display('ABCDEFGHIJKLMNOP')
  const lines = splitLines(screen.getChars())
  expect(lines[0].trimEnd()).toEqual('ABCDEFGHIJKLMNOP')
  expect(linesAreEmpty(lines.slice(1))).toEqual(true)
})

test('display string longer than max cols length is ellipsis', () => {
  const screen = new HomeScreen()
  screen.display('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
  const lines = splitLines(screen.getChars())
  expect(lines[0].trimEnd()).toEqual('ABCDEFGHIJKLM...')
  expect(linesAreEmpty(lines.slice(1))).toEqual(true)
})

test('display number is right padded', () => {
  const screen = new HomeScreen()
  screen.display(123)
  const lines = splitLines(screen.getChars())
  expect(lines[0].trimStart()).toEqual('123')
  expect(linesAreEmpty(lines.slice(1))).toEqual(true)
})

function splitLines(s: string) {
  const lines = []
  while (s.length > 0) {
    lines.push(s.substring(0, MAX_COLS))
    s = s.substring(MAX_COLS)
  }
  assert(lines.length === MAX_ROWS, 'Unexpected number of lines')
  return lines
}

function linesAreEmpty(lines: string[]) {
  return lines.every((line) => line === EMPTY_LINE)
}
