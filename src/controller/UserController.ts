import { success } from "../helper/httpResponses";
import { Request, Response } from 'express';
import { userRepository } from './../index';
import { User } from "../model/User";

export class UserController{
	public GetAll(_req: Request, res: Response) {
		const users = userRepository.GetAll().map((user: User) => this.GetUserViewModel(user));
		return success(res, users);
	}

	public GetById(_req: Request, res: Response) {
		return success(res, this.GetUserViewModel(res.locals.user));
	}

	public Create(req: Request, res: Response) {
		const { name, cpf, email, age } = req.body;
		return success(res, { status: 'created', createdUser: userRepository.Create(name, cpf, email, age) });
	}

	public Destroy(_req: Request, res: Response) {
		userRepository.Remove(res.locals.user.Id);
		return success(res, {status: 'removed', idRemoved: res.locals.user.Id});
	}

	public Update(req: Request, res: Response) {
		const {name, email} = req.body;
		const id = req.params.id;
		return success(res, { status: 'updated', updatedUser: userRepository.Update(id, {name, email}) });	
	}

	public GetUserViewModel(user: User) {
		return {
			id: user.Id,
			name: user.Name,
			cpf: user.Cpf,
			email: user.Email,
			age: user.Age
		}
	}
}