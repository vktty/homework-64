import { Router } from 'express';
import { body } from 'express-validator';
import { AuthRepository } from '../../../repositories';
import { AuthService } from '../../../services';
import { AuthController } from '../controllers';

export const auth = () => {
	const router = Router();

	const repository = new AuthRepository();
	const service = new AuthService({ repository });
	const controller = new AuthController({ authService: service });

	router.post(
		'/sign-in',
		[
			body('email')
				.isEmail()
				.notEmpty()
				.withMessage('Email is required!')
				.trim(),
			body('password')
				.notEmpty()
				.withMessage('Password is required!')
				.trim()
				.isLength({ min: 5 })
				.withMessage(
					'Password must have at least 5 characters!',
				),
		],
		controller.SignIn.bind(controller),
	);

	router.post(
		'/sign-up',
		[
			body('name')
				.notEmpty()
				.withMessage('Name is required!')
				.trim(),
			body('email')
				.isEmail()
				.notEmpty()
				.withMessage('Email is required!')
				.trim(),
			body('password')
				.notEmpty()
				.withMessage('Password is required!')
				.trim()
				.isLength({ min: 5 })
				.withMessage(
					'Password must have at least 5 characters!',
				),
		],
		controller.SignUp.bind(controller),
	);

	return router;
};
