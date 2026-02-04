import { UuidUtil } from "src/shared/utils/uuid.util";
import { CreateOrganizationCommand } from "../create-organization.command";
import { IdempotencyService } from "../../../services/idempotency.service";
import { ConcurencyLockService } from "../../../services/concurrency-lock.service";
import { OrganizationService } from "../../../services/organization.service";
import { UpdateOrganizationCommand } from "../update-organization.command";

export class OrganizationCommandHandler {
    constructor(
        private readonly idempotencyService: IdempotencyService,
        private readonly concurrencyLockService: ConcurencyLockService,
        private readonly organizationService: OrganizationService,
    ) { }

    async createOrganization(command: CreateOrganizationCommand) {
        const organizationId = UuidUtil.generate();
        try {
            command.id = organizationId;
            var result = await this.organizationService.CreateOrganization(command);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async UpdateBalance(command: UpdateOrganizationCommand) {
        const idemKey = `tx-idem:${command.idempotencyKey}`;
        const lockKey = `transaction-lock:org:${command.id}`;
        const existingTransactionId = await this.idempotencyService.getTransactionId(idemKey);
        if (existingTransactionId) {
            return { transactionId: existingTransactionId };
        }
        const lockAcquired = await this.concurrencyLockService.acquireLock(lockKey, 10);
        if (!lockAcquired) {
            throw new Error('Could not acquire lock for processing transaction');
        }
        try {
            const result = await this.organizationService.UpdateBalance(command);
        } catch (error) {
            throw error;
        } finally {
            await this.concurrencyLockService.releaseLock(lockKey);
        }
    }
}