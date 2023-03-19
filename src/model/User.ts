import { Transaction } from "./Transaction";
import { Entity } from "./Entity";

export class User extends Entity {
	private transactions: Transaction[];

	constructor(
		private name: string,
		private cpf: string,
		private email: string,
		private age: number,
	){
		super();
		this.name = name;
		this.cpf = cpf;
		this.email = email;
		this.age = age;
		this.transactions = []
	}

	get Name(){
		return this.name;
	}

	get Cpf(){
		return this.cpf;
	}

	get Email(){
		return this.email;
	}

	get Age() {
		return this.age;
	}

	get Transactions(){
		return this.transactions;
	}

	setName(newName: string) {
		this.name = newName;
	}

	setEmail(newEmail: string) {
		this.email = newEmail;
	}
}