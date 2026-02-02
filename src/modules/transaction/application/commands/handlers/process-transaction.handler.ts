import { UuidUtil } from "src/shared/utils/uuid.util";
import { ConcurencyLockService } from "../../services/concurrency-lock.service";
import { IdempotencyService } from "../../services/idempotency.service";
import { TransactionService } from "../../services/transaction.service";
import { ProcessTransactionCommand } from "../process-transaction.command";

export class ProcessTransactionHandler {
    constructor(
        private readonly idempotencyService: IdempotencyService,
        private readonly transactionService: TransactionService,
        private readonly concurrencyLockService: ConcurencyLockService,
    ) {}
    async execute(command: ProcessTransactionCommand) {
        const idemKey = `tx-idem:${command.idempotencyKey}`;
        const lockKey = `transaction-lock:org:${command.organizationId}:${command.idempotencyKey}`;
        const existingTransactionId = await this.idempotencyService.getTransactionId(idemKey);
        if (existingTransactionId) {
            return { transactionId: existingTransactionId };
        }
        const transactionId = UuidUtil.generate();
        const lockAcquired = await this.concurrencyLockService.acquireLock(lockKey, 10);
        if (!lockAcquired) {
            throw new Error('Could not acquire lock for processing transaction');
        }
        
        try {
            const result = await this.transactionService.processTransaction(
                new ProcessTransactionCommand(
                    transactionId,
                    command.organizationId,
                    command.cardId,
                    command.amount,
                    command.idempotencyKey,
                    command.correlationId,
                ),
            );
            await this.idempotencyService.save(idemKey, transactionId, 3600);
            return result;
        }
        catch(error){
            throw error;
        } finally {
            await this.concurrencyLockService.releaseLock(lockKey);
        }
    }
}