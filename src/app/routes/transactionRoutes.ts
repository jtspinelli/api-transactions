import { TransactionController } from '../controller/TransactionController';
import { Router } from 'express';

const transactionRouter = Router();
const transactionController = new TransactionController();

transactionRouter.post('/user/:userId/transactions', transactionController.Create);
transactionRouter.get('/user/:userId/transactions/:id', transactionController.GetById);
transactionRouter.get('/users/:userId/transactions', transactionController.GetAllTransactionsFromUser);
transactionRouter.delete('/users/:userId/transactions/:id', transactionController.Destroy);
transactionRouter.put('/users/:userId/transactions/:id', transactionController.Update);

export default transactionRouter;