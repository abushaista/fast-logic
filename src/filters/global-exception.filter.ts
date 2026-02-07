import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ConcurrencyException } from 'src/shared/exceptions/concurrency.exception';
import { DomainException } from 'src/shared/exceptions/domain-exception';
import { InfrastructureException } from 'src/shared/exceptions/infrastructure.exception';
import { ValidationException } from 'src/shared/exceptions/validation.exception';
import { CorrelationRequest } from 'src/shared/middleware/correlation-id.middleware';


@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<CorrelationRequest>();

        const mappedResponse = this.mapExceptionToResponse(exception);

        response.status(mappedResponse.status).json({
            success: false,
            error: {
                type: mappedResponse.type,
                message: mappedResponse.message,
            },
            correlationId: request.correlationId,
            timestamp: new Date().toISOString(),
        });
    }

    private mapExceptionToResponse(exception: any): {
        status: number;
        type: string;
        message: string;
    } {
        if (exception instanceof DomainException) {
            return {
                status: HttpStatus.BAD_REQUEST,
                type: exception.name,
                message: exception.message,
            };
        }

        if (exception instanceof ValidationException) {
            return {
                status: HttpStatus.BAD_REQUEST,
                type: 'ValidationError',
                message: exception.message,
            };
        }

        if (exception instanceof ConcurrencyException) {
            return {
                status: HttpStatus.CONFLICT,
                type: 'ConcurrencyError',
                message: exception.message,
            };
        }

        if (exception instanceof InfrastructureException) {
            return {
                status: HttpStatus.SERVICE_UNAVAILABLE,
                type: 'InfrastructureError',
                message: exception.message,
            };
        }

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const res = exception.getResponse();
            let message = '';
            let type = exception.name || 'HttpException';

            if (typeof res === 'string') {
                message = res;
            } else if (res && typeof res === 'object') {
                const body: any = res as any;
                if (Array.isArray(body.message)) {
                    message = body.message.join('; ');
                } else if (body.message) {
                    message = String(body.message);
                } else if (body.error) {
                    message = String(body.error);
                } else {
                    // fallback to stringified body
                    try {
                        message = JSON.stringify(body);
                    } catch {
                        message = String(body);
                    }
                }

                if (body.error) {
                    type = String(body.error);
                } else if (body.type) {
                    type = String(body.type);
                }
            } else {
                message = String(res);
            }

            return {
                status: status,
                type: type,
                message: message,
            };
        }

        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            type: 'InternalServerError',
            message: exception && exception.message ? exception.message : String(exception),
        };

    }

}