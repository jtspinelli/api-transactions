import { v4 as uuid } from 'uuid';

export class Entity {
	private id: string;

	constructor(id: string = uuid()){
		this.id =id;
	}

	get Id(){
		return this.id;
	}
}