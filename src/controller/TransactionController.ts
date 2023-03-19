import { badRequest, internalError, notFound, success } from "./httpResponses";
import { RequiredFieldMissingError } from "../validationErrors/RequiredFieldMissingError";
import { InvalidPropertyTypeError } from "../validationErrors/InvalidPropertyTypeError";
import { EntityNotFoundError } from "../validationErrors/EntityNotFoundError";
import { Request, Response } from "express";
import { InvalidBodyError } from './../validationErrors/InvalidBodyError';
import { userRepository } from "..";

export class TransactionController {
	public Create(req: Request, res: Response){
		const { title, value, type } = req.body;
		const userId = req.params.userId;

		try {
			return success(
				res, { 
					status: 'created',
					transactionCreated: userRepository.CreateTransaction(userId, {title, value, type})
			 	}
			);
		} catch (error) {
			if(error instanceof RequiredFieldMissingError || error instanceof InvalidPropertyTypeError) return badRequest(res, error.message);
			if(error instanceof EntityNotFoundError) return notFound(res, error.message);
		}
	}

	public GetById(req: Request, res: Response) {
		const {userId, id: transactionId} = req.params;
		if(!userId) return badRequest(res, 'Id do usuário não encontrado.');
		if(!transactionId) return badRequest(res, 'Id da transação não encontrado.');

		try {
			return success(res, userRepository.GetTransactionById(userId, transactionId));
		} catch (error) {
			if(error instanceof EntityNotFoundError) return notFound(res, error.message);
			return internalError(res);
		}
	}

	public GetAllTransactionsFromUser(req: Request, res: Response) {
		const userId = req.params.userId;
		if(!userId) return badRequest(res, 'Id do usuário não encontrado.');

		try {
			const transactions = userRepository.GetAllTransactionsFromUser(userId);
			const response = {
				transactions,
				balance: transactions.reduce((acc, currentTransaction) => {
					if(currentTransaction.type === 'ENTRADA') {
						return {
							...acc,
							entradas: acc.entradas += currentTransaction.value,
							saldo: acc.saldo += currentTransaction.value
						}
					} 

					return {
						...acc,
						saidas: acc.saidas += currentTransaction.value,
						saldo: acc.saldo -= currentTransaction.value
					}
				}, {
					entradas: 0,
					saidas: 0,
					saldo: 0
				})
			}

			

			return success(res, response);
		} catch (error) {
			if(error instanceof EntityNotFoundError) return notFound(res, error.message);
			return internalError(res);
		}		
	}

	public Destroy(req: Request, res: Response) {
		const {userId, id : transactionId} = req.params;
		if(!userId) return badRequest(res, 'Id do usuário não encontrado');
		if(!transactionId) return badRequest(res, 'Id da transação não encontrado');

		try {			
			return success(res, {status: 'removed', removedTransactionId: userRepository.RemoveTransaction(userId, transactionId)});
		} catch (error) {
			if(error instanceof EntityNotFoundError) return notFound(res, error.message);
			return internalError(res);
		}		
	}

	public Update(req: Request, res: Response) {
		const {userId, id : transactionId} = req.params;
		if(!userId) return badRequest(res, 'Id do usuário não encontrado');
		if(!transactionId) return badRequest(res, 'Id da transação não encontrado');

		try {
			return success(res, {status: 'updated', updatedTransaction: userRepository.UpdateTransaction(userId, transactionId, req.body)});
		} catch (error) {
			if(error instanceof EntityNotFoundError || error instanceof InvalidBodyError || error instanceof InvalidPropertyTypeError) return notFound(res, error.message);
			return internalError(res);
		}
	}
}