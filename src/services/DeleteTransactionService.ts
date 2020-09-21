import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  transactionID: string;
}

class DeleteTransactionService {
  public async execute({ transactionID }: Request): Promise<void> {
    const repository = getCustomRepository(TransactionRepository);
    const transaction = await repository.findOne(transactionID);
    if (!transaction) {
      throw new AppError(
        `The transaction with ID ${transactionID} doesn't exist.`,
        401,
      );
    }
    // TODO: dois tipos de modos de remoção;
    // await repository.delete(transaction.id);
    await repository.remove(transaction);
  }
}

export default DeleteTransactionService;
