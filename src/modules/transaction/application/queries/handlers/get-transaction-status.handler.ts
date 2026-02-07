import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import type { TransactionReadPort } from "../../ports/transaction-read.port";
import { GetTransactionStatusQuery } from "../get-transaction-status.query";
@Injectable()
export class GetTransactionStatusHandler {
    private readonly logger = new Logger(GetTransactionStatusHandler.name);
    constructor(
        @Inject('TransactionReadPort')
        private readonly readRepo: TransactionReadPort
    ) { }

    async execute(query: GetTransactionStatusQuery) {
        this.logger.debug(`Getting transaction status for id: ${query.transactionId}`);
        try {
            const result = await this.readRepo.getStatus(query.transactionId);
            if (result == null) {
                throw new NotFoundException(`Transaction ${query.transactionId} not found`);
            }
            return result;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }

    }
}