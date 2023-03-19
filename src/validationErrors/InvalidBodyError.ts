export class InvalidBodyError extends Error {
	constructor(public message: string) {
		super();
		this.message = message;
	}
}