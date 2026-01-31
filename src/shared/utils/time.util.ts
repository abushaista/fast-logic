export class TimeUtil {
  static now(): Date {
    return new Date();
  }

  static toISOString(date: Date): string {
    return date.toISOString();
  }
}
