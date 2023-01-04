export default class MenuScreen {
  private title: string = ''
  private labels: string[] = []
  private currentIndex: number = 0

  setTitleAndOptions = (title: string, labels: string[]): void => {
    this.title = title.substring(0, 16)
    this.labels = labels.map(label => label.substring(0, 14))
    this.currentIndex = 0
  }

  getTitle = (): string => {
    return this.title
  }

  getLabels = (): string[] => {
    return this.labels
  }

  getCurrentIndex = (): number => {
    return this.currentIndex
  }

  setCurrentIndex = (index: number): void => {
    this.currentIndex = index
  }

  nextOption = (): void => {
    this.currentIndex = (this.currentIndex + 1) % this.labels.length
  }

  prevOption = (): void => {
    this.currentIndex = this.currentIndex <= 0 ? (this.labels.length - 1) : this.currentIndex - 1
  }

}