export interface OrganizationResult {
    organizationId: string;
    organizationName: string;
    status: string;
    message?: string;
    correlationId: string;
    occurredAt: Date;
}