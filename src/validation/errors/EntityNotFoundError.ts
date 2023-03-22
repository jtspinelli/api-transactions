export class EntityNotFoundError extends Error {
	constructor(entityName: string){
		super();
		this.message = `Nenhum(a) ${entityName} associado(a) ao id informado.`;
	}
}