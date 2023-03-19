import { v4 as uuid } from 'uuid';

export class Entity {
	private id: string;

	constructor(){
		this.id = uuid();
	}

	get Id(){
		return this.id;
	}
}