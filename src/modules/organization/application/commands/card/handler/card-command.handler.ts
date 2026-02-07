import { UuidUtil } from "src/shared/utils/uuid.util";
import { CardService } from "../../../services/card.service";
import { ConcurencyLockService } from "../../../services/concurrency-lock.service";
import { IdempotencyService } from "../../../services/idempotency.service";
import { CreateCardCommand } from "../create-card.command";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CardCommandHandler {
    constructor(
        private readonly idempotencyService: IdempotencyService,
        private readonly concurrencyLockService: ConcurencyLockService,
        private readonly cardService: CardService,
    ) { }

    async createCard(command: CreateCardCommand) {
        const lockKey = `transaction-lock:org:${command.organizationId}`;
        try {
            const lockAcquired = await this.concurrencyLockService.acquireLock(lockKey, 10);
            const cardId = UuidUtil.generate();
            command.id = cardId;
            var result = await this.cardService.CreateCard(command);
            return result;
        } catch (error) {
            throw error;
        } finally {
            await this.concurrencyLockService.releaseLock(lockKey);
        }
    }


}