import { Response, NextFunction } from 'express';
import { IExtendedRequest, StatusCodes } from '../../../interfaces';
import { AuthService } from '../../../services';

type AuthConstructorParams = {
	authService: AuthService;
};

export class AuthController {
	private authService: AuthService;
	constructor({ authService }: AuthConstructorParams) {
		this.authService = authService;
	}

	async SignIn(req: IExtendedRequest, res: Response, next: NextFunction) {
		const { email, password } = req.body;
		this.authService
			.getUser(req, { email, password })
			.then((user) => {
				return res
					.status(StatusCodes.OK)
					.cookie('token', user.token, {
						httpOnly: true,
					})
					.json({ data: user, error: {} });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while signing in!',
					{ error },
				);
				next(error);
			});
	}

	async SignUp(req: IExtendedRequest, res: Response, next: NextFunction) {
		const { email, name, password } = req.body;
		this.authService
			.createUser(req, { email, name, password })
			.then((user) => {
				return res
					.status(StatusCodes.OK)
					.cookie('token', user.token, {
						httpOnly: true,
					})
					.json({ data: user, error: {} });
			})
			.catch((error) => {
				req?.log?.error(
					'An error occurred while signing up!',
					{ error },
				);
				next(error);
			});
	}
}
