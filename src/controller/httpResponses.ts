import { Response } from "express"

/**
 * @returns Response with status code 200 (OK).
 */
export const success = (res: Response, data: any) => {
	return res.status(200).json(data);
}

/**
 * @returns Response with status code 400 (Bad Request).
 */
export const badRequest = (res: Response, message: string) => {
	return res.status(400).json({message});
}

/**
 * @returns Response with status code 404 (Not Found).
 */
export const notFound = (res: Response, message: string) => {
	return res.status(404).json({message});
}

/**
 * 
 * @returns Response with status code 500 (Internal Server Error).
 */
export const internalError = (res: Response) => {
	return res.status(500).json({message: 'Erro no servidor. Tente novamente.'});
}