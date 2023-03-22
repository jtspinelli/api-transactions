import { RequiredFieldMissingError } from '../../app/validation/errors/RequiredFieldMissingError';
import { InvalidPropertyTypeError } from '../../app/validation/errors/InvalidPropertyTypeError';
import { EmailRegisteredError } from "../../app/validation/errors/EmailRegisteredError";
import { EntityNotFoundError } from '../../app/validation/errors/EntityNotFoundError';
import { InvalidBodyError } from '../../app/validation/errors/InvalidBodyError';
import { IUserRepository } from '../../domain/contract/IUserRepository';
import { Transaction } from '../../domain/model/Transaction';
import { Repository } from "./Repository";
import { User } from "../../domain/model/User";
import transactionsDB from '../db/transactions';

export class UserRepository extends Repository<User> implements IUserRepository {
	constructor(initialDb: User[]){
		super(initialDb, 'usuário');
		this.initDefaultTransactions();		
	}

	/* #region User Logic */
	public Create(name: string, cpf: string, email: string, age: number){		
		const newUser = new User(name, cpf, email, age);
		this.Add(newUser);

		return newUser;
	}

	public Update(id: string, data: {name: string, email: string}) {
		const user = this.GetById(id);

		if(data.email) user.setEmail(data.email);
		if(data.name) user.setName(data.name);

		return user;
	}
	/* #endregion */

	/* #region User's Transaction Logic */
	private AddTransaction(user: User, transaction: Transaction) {
		user.Transactions.push(transaction);
	}	

	public GetTransactionById(userId: string, transactionId: string) {
		const user = this.GetById(userId);
		const transaction = user.Transactions.find(transaction => transaction.Id === transactionId);
		if(!transaction) throw new EntityNotFoundError('transação');

		return transaction;
	}

	public GetAllTransactionsFromUser(userId: string) {
		const user = this.GetById(userId);
		return user.Transactions;
	}

	public CreateTransaction(userId: string, transactionData: {title: string, value: string, type: 'SAIDA' | 'ENTRADA'}) {
		const requiredFields = ['title', 'value', 'type'];
		[transactionData.title, transactionData.value, transactionData.type].forEach((requiredField, index) => {
			if(!requiredField) throw new RequiredFieldMissingError(requiredFields[index]);
			
		});

		if(isNaN(Number(transactionData.value))) throw new InvalidPropertyTypeError('value');
		if(!['SAIDA', 'ENTRADA'].includes(transactionData.type)) throw new InvalidPropertyTypeError('type');

		const newTransaction = new Transaction(transactionData.title, Number(transactionData.value), transactionData.type);

		this.AddTransaction( 
			this.GetById(userId),
			newTransaction
		);

		return newTransaction;
	}

	public RemoveTransaction(userId: string, transactionId: string) {
		const user = this.GetById(userId);

		// using for-loop because there is no way to stop a foreach loop
		for(let i = 0; i < user.Transactions.length; i++) {
			if(user.Transactions[i].Id === transactionId) {
				user.Transactions.splice(i, 1);
				return transactionId;
			}
		}

		throw new EntityNotFoundError('transação');
	}

	public UpdateTransaction(userId: string, transactionId: string, transactionData: { title: string, value: string, type: 'ENTRADA' | 'SAIDA' }) {
		const transaction = this.GetTransactionById(userId, transactionId);

		if(!transactionData.title && !transactionData.value && !transactionData.type) throw new InvalidBodyError('Propriedades da transação ausentes no objeto enviado.');
		if(transactionData.type && !['SAIDA', 'ENTRADA'].includes(transactionData.type)) throw new InvalidPropertyTypeError('type');
		if(transactionData.value && isNaN(Number(transactionData.value))) throw new InvalidPropertyTypeError('value');

		if(transactionData.title) transaction.title = transactionData.title;
		if(transactionData.value) transaction.value = Number(transactionData.value);
		if(transactionData.type) transaction.type = transactionData.type;

		return transaction;
	}
	/* #endregion */
	
	/* #region Helper Methods */
	private findByEmail(email: string) {
		return this.db.find(user => user.Email === email);
	}

	public emailRegistered(email: string) {
		return this.db.find(user => user.Email === email) !== undefined;
	}

	public emailRegisteredByAnotherId (email: string, interestedId: string) {
		const foundUser = this.findByEmail(email);
		if(foundUser !== undefined && foundUser.Id !== interestedId) {
			throw new EmailRegisteredError();
		}

		return false;
	}

	public cpfRegistered(cpf: string) {
		return this.db.find(user => user.Cpf === cpf) !== undefined;
	}

	private initDefaultTransactions() {
		transactionsDB.forEach(transaction => {
			this.AddTransaction(this.db[0], transaction);
		});
	}
	/* #endregion */
}