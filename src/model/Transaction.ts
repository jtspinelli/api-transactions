import { Entity } from "./Entity";

export class Transaction extends Entity {
	constructor(		
		public title: string,
		public value: number,
		public type: 'ENTRADA' | 'SAIDA'
	){
		super();
		this.title = title;
		this.value = value;
		this.type = type;
	}
}