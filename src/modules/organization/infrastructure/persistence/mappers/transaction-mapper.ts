export class TransactionMapper {
  toResponse(entity: any) {
    return {
      transactionId: entity.id,
      status: entity.status,
    };
  }
}