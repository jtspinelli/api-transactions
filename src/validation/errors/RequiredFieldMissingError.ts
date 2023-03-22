export class RequiredFieldMissingError extends Error {
	constructor(field: string){
		super();
		this.message = `Propriedade obrigatória '${field}' ausente no objeto enviado.`;
	}
}