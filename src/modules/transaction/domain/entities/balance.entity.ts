import { Entity } from "src/shared/kernel/entity";
import { Money } from "../value-objects/money.vo";

export class Balance extends Entity<string> {
    private props: Money;
    constructor(props: Money, id: string) {
        super(id);          
        this.props = props;
    }
   /**
    * Subtracts the given amount from the balance.
    *
    * @param {Money} amount - The amount to subtract from the balance.
    * @returns {Balance} - The resulting balance after subtraction.
    */

   deduct(amount: Money): Balance {
      return new Balance(this.props.subtract(amount), this.id);
   }
   get value(): Money {
      return this.props;
   }
}