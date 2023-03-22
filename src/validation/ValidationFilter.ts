import { badRequest, internalError, notFound } from '../helper/httpResponses';
import { Request, Response, NextFunction } from 'express';
import { RequiredFieldMissingError } from './errors/RequiredFieldMissingError';
import { EmailRegisteredError } from './errors/EmailRegisteredError';
import { EntityNotFoundError } from './errors/EntityNotFoundError';
import { CpfRegisteredError } from './errors/CpfRegisteredError';
import { userRepository } from '..';

export abstract class ValidationFilter {
	static CheckUser(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		try {
			res.locals.user = userRepository.GetById(id);
			next();
		} catch (error) {
			if(error instanceof EntityNotFoundError) return notFound(res, error.message);
			return internalError(res);
		}	
	}

	static CheckEmail(req: Request, res: Response, next: NextFunction) {
		try {
			userRepository.emailRegisteredByAnotherId(req.body.email, res.locals.user.Id);
			next();			
		} catch (error) {
			if(error instanceof EmailRegisteredError) return badRequest(res, error.message);
			return internalError(res);
		}
	}

	static CheckRequiredFields(req: Request, res: Response, next: NextFunction) {
		const { name, cpf, email, age } = req.body;
		try {
			if(!name) throw new RequiredFieldMissingError('name');
			if(!cpf) throw new RequiredFieldMissingError('cpf');
			if(userRepository.cpfRegistered(cpf)) throw new CpfRegisteredError();
			if(!email) throw new RequiredFieldMissingError('email');
			if(userRepository.emailRegistered(email)) throw new EmailRegisteredError();
			if(!age) throw new RequiredFieldMissingError('age');
			next();
		} catch (error) {
			if(error instanceof CpfRegisteredError || error instanceof EmailRegisteredError ||error instanceof RequiredFieldMissingError) return badRequest(res, error.message);
			return internalError(res);
		}		
	}	
}