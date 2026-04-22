import { NextFunction, Response } from 'express';
import { IExtendedRequest, StatusCodes } from '../../../interfaces';
import { BoardService } from '../../../services';

type BoardConstructorParams = {
	boardService: BoardService;
};

export class BoardController {
	private boardService: BoardService;
	constructor({ boardService }: BoardConstructorParams) {
		this.boardService = boardService;
	}
	async getBoards(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		this.boardService
			.getAllBoards(req)
			.then((boards) => {
				return res
					.status(StatusCodes.OK)
					.json({ data: boards, error: {} });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while getting boards!',
					{ error },
				);
				next(error);
			});
	}
	async getBoardTasks(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const { boardId } = req.params;
		if (!boardId || Array.isArray(boardId))
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({
					error: 'Invalid boardId',
				});

		this.boardService
			.getAllBoardTasks(req)
			.then((tasks) => {
				return res.status(StatusCodes.OK).json({
					data: tasks,
					error: {},
				});
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while getting tasks!',
					{ error },
				);
				next(error);
			});
	}
	async getBoardById(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const { boardId } = req.params;
		if (!boardId || Array.isArray(boardId))
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({
					error: 'Invalid boardId',
				});
		this.boardService
			.findById(boardId)
			.then((board) => {
				return res
					.status(StatusCodes.OK)
					.json({ data: board, error: {} });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while getting board!',
					{ error },
				);
				next(error);
			});
	}

	async createBoard(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const data = req.body;
		this.boardService
			.create(data)
			.then((board) => {
				return res
					.status(StatusCodes.CREATED)
					.json({ data: board, error: {} });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while creating board!',
					{ error },
				);
				next(error);
			});
	}

	async updateBoard(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const { boardId } = req.params;
		if (!boardId || Array.isArray(boardId))
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({
					error: 'Invalid boardId',
				});

		const data = req.body;
		this.boardService
			.update(boardId, data)
			.then((board) => {
				return res
					.status(StatusCodes.OK)
					.json({ data: board, error: {} });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while updating board!',
					{ error },
				);
				next(error);
			});
	}

	async deleteBoard(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const { boardId } = req.params;
		if (!boardId || Array.isArray(boardId))
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({
					error: 'Invalid boardId',
				});
		this.boardService
			.delete(boardId)
			.then(() => {
				return res.status(StatusCodes.OK).json({
					data: {},
					error: {},
				});
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while deleting board!',
					{ error },
				);
				next(error);
			});
	}
}
