import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { UuidUtil } from "../utils/uuid.util";

export interface CorrelationRequest extends Request {
    correlationId?: string;
}

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
    use(req: CorrelationRequest, res: Response, next: NextFunction) {
        try {
            const incomingId = req.headers['x-correlation-id'] as string | undefined;
            const correlationId = incomingId ?? UuidUtil.generate();
            req.correlationId = correlationId;
            res.setHeader('X-Correlation-Id', correlationId);
        } catch (error) {
            console.error('CorrelationIdMiddleware error', error);
        }
        next();
    }
}