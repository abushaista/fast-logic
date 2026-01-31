export abstract class ValueObject<T> {
  protected constructor(protected readonly props: T) {
    Object.freeze(this.props);
  }

  equals(vo?: ValueObject<T>): boolean {
    if (vo == null) return false;
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
