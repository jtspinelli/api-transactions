import { Request, Response, Router } from 'express';
import { UserController } from '../controller/UserController';
import { ValidationFilter } from '../validation/ValidationFilter';

const userRoutes = Router();
const userController = new UserController();

userRoutes.get('/', (_req: Request, res: Response) => {
	res.send("API is Rock and Rolling!");
});

userRoutes.get('/users', userController.GetAll.bind(userController));
userRoutes.get('/users/:id', ValidationFilter.CheckUser, userController.GetById.bind(userController));
userRoutes.post('/users', ValidationFilter.CheckRequiredFields, userController.Create);
userRoutes.delete('/users/:id', ValidationFilter.CheckUser, userController.Destroy);
userRoutes.put('/users/:id', ValidationFilter.CheckUser, ValidationFilter.CheckEmail, userController.Update);

export default userRoutes;