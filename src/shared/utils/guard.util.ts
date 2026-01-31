export class Guard {
  static againstNull(value: any, message: string): void {
    if (value === null || value === undefined) {
      throw new Error(message);
    }
  }

  static againstNegative(value: number, message: string): void {
    if (value < 0) {
      throw new Error(message);
    }
  }
}
