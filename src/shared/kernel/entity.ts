export abstract class Entity<ID = string> {
  protected constructor(public readonly id: ID) {}

  equals(object?: Entity<ID>): boolean {
    if (object == null) return false;
    if (this === object) return true;
    return this.id === object.id;
  }
}
