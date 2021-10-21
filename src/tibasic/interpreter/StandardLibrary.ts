export default class StandardLibrary {
  static getFunctions = (): { [key: string]: (...args: any[]) => any } => {
    return {
      'sin': (x) => Math.sin(Number(x)),
      'cos': (x) => Math.cos(Number(x)),
      'tan': (x) => Math.tan(Number(x)),
      'arcsin': (x) => Math.asin(Number(x)),
      'arccos': (x) => Math.acos(Number(x)),
      'arctan': (x) => Math.atan(Number(x)),
      'log': (x) => Math.log10(Number(x)),
      'ln': (x) => Math.log(Number(x)),
      'sqrt': (x) => Math.sqrt(Number(x)),
      'random': (min, max) => {
        min = Number(min)
        max = Number(max)
        return Math.random() * (max - min) + min
      },
    }
  }
}