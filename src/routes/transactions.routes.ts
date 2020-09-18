import { Router } from 'express';

// import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

// transactionsRouter.get('/', async (request, response) => {
//   // TODO
// });

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
    return response.json({ message: error.message });
  }
});

// transactionsRouter.delete('/:id', async (request, response) => {
//   // TODO
// });

// transactionsRouter.post('/import', async (request, response) => {
//   // TODO
// });

export default transactionsRouter;
