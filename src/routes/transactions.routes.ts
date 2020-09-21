import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import uploadConfig from '../config/upload';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  try {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transactions = await transactionRepository.find();
    const balance = await transactionRepository.getBalance();
    return response.status(200).json({ transactions, balance });
  } catch (error) {
    return response
      .status(400)
      .json({ status: 'error', message: error.message });
  }
});

transactionsRouter.post('/', async (request, response) => {
  try {
    const { title, value, type, category } = request.body;
    const transactionService = new CreateTransactionService();
    const newTransaction = await transactionService.execute({
      title,
      value,
      type,
      category,
    });

    return response.status(200).json(newTransaction);
  } catch (error) {
    return response
      .status(400)
      .json({ status: 'error', message: error.message });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const transactionService = new DeleteTransactionService();
    await transactionService.execute({ transactionID: id });
    return response.status(204).send();
  } catch (error) {
    return response
      .status(401)
      .send({ status: 'error', message: error.message });
  }
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    try {
      const importTransactions = new ImportTransactionsService();
      const transactions = await importTransactions.execute(request.file.path);
      return response.status(201).json(transactions);
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Erro while importing the file. Please try again.',
      });
    }
  },
);

export default transactionsRouter;
