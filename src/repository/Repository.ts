import { EntityNotFoundError } from '../validationErrors/EntityNotFoundError';
import { Entity } from "../model/Entity";

export abstract class Repository<T extends Entity> {
	protected db: T[] = [];

	private entityName: string;

	constructor(initialDb: T[], entityName: string) {
		this.db = initialDb;
		this.entityName = entityName;
	}

	public GetAll(): T[] {
		return this.db;
	}

	public GetById(id: string): T {
		const entity = this.db.find(entity => entity.Id === id);
		if(!entity) throw new EntityNotFoundError(this.entityName);

		return entity;
	}

	public Add(entity: T) {
		this.db.push(entity);
	}

	public Remove(id: string) {
		// using for-loop because there is no way to stop a foreach loop		
		for(let i = 0; i < this.db.length; i++) {
			if(this.db[i].Id === id) {
				this.db.splice(i, 1);
				return true;
			}
		}

		throw new EntityNotFoundError(this.entityName);
	}
}