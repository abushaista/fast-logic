export class UuidUtil {
  static generate(): string {
    return crypto.randomUUID();
  }
}
