interface OptionAndLabel {
  option: string,
  label: string,
}

export default class MenuScreen {
  private readonly optionsAndLabels: OptionAndLabel[]
  private readonly callback: (label: string) => void
  private currentIndex: number = 0

  constructor(optionsAndLabels: OptionAndLabel[], callback: (label: string) => void) {
    this.optionsAndLabels = optionsAndLabels
    this.callback = callback
  }

  nextOption = (): void => {
    this.currentIndex = (this.currentIndex + 1) % this.optionsAndLabels.length
  }

  prevOption = (): void => {
    this.currentIndex = this.currentIndex <= 0 ? (this.optionsAndLabels.length - 1) : this.currentIndex - 1
  }

  selectOption = (index: number): void => {
    this.callback(this.optionsAndLabels[index].label)
  }

  selectCurrentOption = (): void => {
    this.callback(this.optionsAndLabels[this.currentIndex].label)
  }

}