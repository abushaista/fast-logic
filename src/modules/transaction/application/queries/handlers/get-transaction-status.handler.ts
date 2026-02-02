import { TransactionReadPort } from "../../ports/transaction-read.port";
import { GetTransactionStatusQuery } from "../get-transaction-status.query";

export class GetTransactionStatusHandler {
    constructor(
        private readonly readRepo: TransactionReadPort
    ){}

    async execute(query: GetTransactionStatusQuery){
        return this.readRepo.getStatus(query.transactionId);
    }
}