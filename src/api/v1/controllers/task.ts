import { NextFunction, Response } from 'express';
import { IExtendedRequest, StatusCodes } from '../../../interfaces';
import { TaskService } from '../../../services';

type TaskConstructorParams = {
	taskService: TaskService;
};

export class TaskController {
	private taskService: TaskService;
	constructor({ taskService }: TaskConstructorParams) {
		this.taskService = taskService;
	}
	async getTasks(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		this.taskService
			.getAll(req)
			.then((tasks) => {
				return res
					.status(StatusCodes.OK)
					.json({ data: tasks, error: {} });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while getting tasks!',
					{ error },
				);
				next(error);
			});
	}
	async getTaskById(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const { taskId } = req.params;
		if (!taskId || Array.isArray(taskId))
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: 'Invalid taskId',
			});
		this.taskService
			.findById(taskId)
			.then((task) => {
				return res
					.status(StatusCodes.OK)
					.json({ data: task, error: {} });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while getting task!',
					{ error },
				);
				next(error);
			});
	}

	async createTask(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const data = req.body;
		this.taskService
			.create(data)
			.then((task) => {
				return res
					.status(StatusCodes.CREATED)
					.json({ data: task, error: {} });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while creating task!',
					{ error },
				);
				next(error);
			});
	}

	async updateTask(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const { taskId } = req.params;
		if (!taskId || Array.isArray(taskId))
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({
					error: 'Invalid taskId',
				});
		const data = req.body;
		this.taskService
			.update(taskId, data)
			.then((task) => {
				return res
					.status(StatusCodes.OK)
					.json({ data: task, error: {} });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while updating task!',
					{ error },
				);
				next(error);
			});
	}

	async deleteTask(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const { taskId } = req.params;
		if (!taskId || Array.isArray(taskId))
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({
					error: 'Invalid taskId',
				});
		this.taskService
			.delete(taskId)
			.then(() => {
				return res.status(StatusCodes.OK).json({
					data: {},
					error: {},
				});
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while deleting task!',
					{ error },
				);
				next(error);
			});
	}
}
