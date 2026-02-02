import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
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

        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            type: 'InternalServerError',
            message: 'An unexpected error occurred.',
        };

    }

}