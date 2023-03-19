import { Entity } from "./Entity";

export class Transaction extends Entity {
	constructor(		
		public title: string,
		public value: number,
		public type: 'ENTRADA' | 'SAIDA',
		id?: string
	){
		super(id);
		this.title = title;
		this.value = value;
		this.type = type;
	}
}