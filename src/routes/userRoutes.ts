import { Request, Response, Router } from 'express';
import { UserController } from '../controller/UserController';

const userRoutes = Router();
const userController = new UserController();

userRoutes.get('/', (_req: Request, res: Response) => {
	res.send("API is Rock and Rolling!");
});

userRoutes.get('/users', userController.GetAll);
userRoutes.get('/users/:id', userController.GetById);
userRoutes.post('/users', userController.Create);
userRoutes.delete('/users/:id', userController.Destroy);
userRoutes.put('/users/:id', userController.Update);

export default userRoutes;