import { getRepository, Repository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  private transactionRepository: Repository<Transaction>;

  private categoryRepository: Repository<Category>;

  constructor() {
    this.transactionRepository = getRepository(Transaction);
    this.categoryRepository = getRepository(Category);
  }

  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);
    let foundCategory;
    let newCategory;
    // Check if category already exists:
    if (this.categoryExists(category)) {
      // If already exists, gets it from the database.
      foundCategory = await this.categoryRepository.findOne({
        where: { title: category },
      });
    } else {
      // If is a new one, create in database.
      newCategory = await this.createNewCategory(category);
    }

    // Create a new transaction with the retrieved category
    const transaction = await transactionRepository.save({
      category_id: foundCategory?.id ? foundCategory.id : newCategory?.id,
      title,
      type,
      value,
    });

    if (!transaction) {
      // Throws an Error if was not possible to create the transaction. eg: Database error.
      throw new AppError(
        'Error: it was not possible to create the transaction. Try again later.',
      );
    }

    return transaction;
  }

  private async categoryExists(category: string): Promise<boolean> {
    const foundCategory = await this.categoryRepository.findOne({
      where: { title: category },
    });

    if (foundCategory) {
      return true;
    }
    return false;
  }

  private async createNewCategory(title: string): Promise<Category> {
    const newCategory = await this.categoryRepository.save({ title });

    return newCategory;
  }
}

export default CreateTransactionService;
