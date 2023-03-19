import { badRequest, internalError, notFound, success } from "./httpResponses";
import { RequiredFieldMissingError } from "../validationErrors/RequiredFieldMissingError";
import { EmailRegisteredError } from "../validationErrors/EmailRegisteredError";
import { EntityNotFoundError } from '../validationErrors/EntityNotFoundError';
import { CpfRegisteredError } from "../validationErrors/CpfRegisteredError";
import { Request, Response } from 'express';
import { userRepository } from './../index';
import { User } from "../model/User";

export class UserController{
	public GetAll(_req: Request, res: Response) {
		const users = userRepository.GetAll().map((user: User) => ({
			id: user.Id,
			name: user.Name,
			cpf: user.Cpf,
			email: user.Email,
			age: user.Age
		}));

		return success(res, users);
	}

	public GetById(req: Request, res: Response) {
		const id = req.params.id;
		if(!id) return badRequest(res, 'Id não encontrado.');

		try {
			return success(res, userRepository.GetById(id));
		} catch(error) {
			if(error instanceof EntityNotFoundError) return notFound(res, error.message);
			return internalError(res);
		}
	}

	public Create(req: Request, res: Response) {
		const { name, cpf, email, age } = req.body;

		try {
			return success(res, { status: 'created', createdUser: userRepository.Create(name, cpf, email, age) })
		} catch (error) {
			if(error instanceof CpfRegisteredError || error instanceof EmailRegisteredError || error instanceof RequiredFieldMissingError) return badRequest(res, error.message);
			return internalError(res);
		}
	}

	public Destroy(req: Request, res: Response) {
		const id = req.params.id;
		if(!id) return badRequest(res, 'Id não encontrado.');

		try {
			userRepository.Remove(id);
			return success(res, { status: 'removed', idRemoved: id });
		} catch (error) {
			if(error instanceof EntityNotFoundError) return notFound(res, error.message);
			return internalError(res);
		}
	}

	public Update(req: Request, res: Response) {
		const { name, email } = req.body;
		const id = req.params.id;
		if(!id) return badRequest(res, 'Id não encontrado.');

		try {
			return success(res, { status: 'updated', updatedUser: userRepository.Update(id, {name, email}) });
		} catch (error) {
			if(error instanceof EntityNotFoundError) return notFound(res, error.message);
			if(error instanceof EmailRegisteredError) return badRequest(res, error.message);
			return internalError(res);
		}	
	}
}