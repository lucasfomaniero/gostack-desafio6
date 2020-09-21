import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor() {
    this.transactionsRepository = getCustomRepository(TransactionsRepository);
  }

  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const foundCategory = await this.getCategory(category);
    const isValid = await this.isValidTransaction(value, type);

    if (!isValid) {
      throw new AppError(
        'Could not create the transaction. The value is greater than total balance.',
        400,
      );
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
      category: foundCategory,
    });

    await this.transactionsRepository.save(transaction);
    return transaction;
  }

  private async isValidTransaction(
    value: number,
    type: 'income' | 'outcome',
  ): Promise<boolean> {
    const { total } = await this.transactionsRepository.getBalance();
    let isValid = true;
    // Check if is outcome type and value is greater than total balance
    if (type === 'outcome' && value > total) isValid = false;
    return isValid;
  }

  private async getCategory(category: string): Promise<Category> {
    const categoryRepository = getRepository(Category);
    let foundCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!foundCategory) {
      foundCategory = await categoryRepository.save({ title: category });
    }
    return foundCategory;
  }
}

export default CreateTransactionService;
