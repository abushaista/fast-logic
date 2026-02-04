import { NestMiddleware } from "@nestjs/common";
import { createHash } from "crypto";
import { Request, Response, NextFunction } from "express";

export class ChecksumMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        try {
            const checksum = req.headers['x-checksum'] as string;
            if (!checksum) {
                res.status(400).send('Missing checksum header');
                return;
            }
            const organizationId = req.headers['x-organization-id'];
            if (!organizationId) {
                res.status(400).send('Missing organization id header');
                return;
            }

            const body = req.body;

            const computedChecksum = this.computeChecksum(body, organizationId as string);
            if (computedChecksum !== checksum) {
                res.status(400).send('Invalid checksum');
                return;
            }
        } catch (err) {
            console.error('checksum middleware error', err);
        }
        next();
    }
    computeChecksum(body: any, secret: string): string {
        const payload = (body) ? JSON.stringify(body).trim() : "";
        const normalized = payload.replace(/\s+/g, '');
        const calculated = createHash('sha256')
            .update(normalized + secret)
            .digest('hex');
        return calculated;
    }
}