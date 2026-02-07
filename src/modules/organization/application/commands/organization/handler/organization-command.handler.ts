import { UuidUtil } from "src/shared/utils/uuid.util";
import { CreateOrganizationCommand } from "../create-organization.command";
import { IdempotencyService } from "../../../services/idempotency.service";
import { ConcurencyLockService } from "../../../services/concurrency-lock.service";
import { OrganizationService } from "../../../services/organization.service";
import { UpdateOrganizationCommand } from "../update-organization.command";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class OrganizationCommandHandler {
    private readonly logger = new Logger(OrganizationCommandHandler.name);
    constructor(
        private readonly idempotencyService: IdempotencyService,
        private readonly concurrencyLockService: ConcurencyLockService,
        private readonly organizationService: OrganizationService,
    ) { }

    async createOrganization(command: CreateOrganizationCommand) {
        const organizationId = UuidUtil.generate();
        this.logger.debug(`Creating organization with id: ${organizationId}`);
        try {
            command.id = organizationId;
            var result = await this.organizationService.CreateOrganization(command);
            this.logger.debug(`Organization created successfully: ${organizationId}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to create organization: ${(error as Error).message}`, error);
            throw error;
        }
    }

    async UpdateBalance(command: UpdateOrganizationCommand) {
        const idemKey = `tx-idem:${command.idempotencyKey}`;
        const lockKey = `transaction-lock:org:${command.id}`;
        this.logger.debug(`Attempting to update balance for organization: ${command.id}`);
        const existingTransactionId = await this.idempotencyService.getTransactionId(idemKey);
        if (existingTransactionId) {
            this.logger.debug(`Idempotent transaction found: ${existingTransactionId}`);
            return { transactionId: existingTransactionId };
        }
        command.id = UuidUtil.generate();
        this.logger.debug(`Acquiring lock for organization: ${command.id}`);
        const lockAcquired = await this.concurrencyLockService.acquireLock(lockKey, 10);
        if (!lockAcquired) {
            this.logger.warn(`Could not acquire lock for organization: ${command.id}`);
            throw new Error('Could not acquire lock for processing transaction');
        }
        try {
            const result = await this.organizationService.UpdateBalance(command);
            await this.idempotencyService.save(idemKey, command.id, 3600);
            this.logger.debug(`Balance updated successfully for organization: ${command.id}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to update balance: ${(error as Error).message}`, error);
            throw error;
        } finally {
            await this.concurrencyLockService.releaseLock(lockKey);
        }
    }
}