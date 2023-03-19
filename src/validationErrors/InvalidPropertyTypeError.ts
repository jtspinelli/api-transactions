export class InvalidPropertyTypeError extends Error {
	constructor(property: string){
		super();
		this.message = `Propriedade '${property}' com formato inválido.`;
	}
}