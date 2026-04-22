import {
	BoardUpdate,
	IBoard,
	IExtendedRequest,
	IRepository,
	ITask,
} from '../interfaces';
import {
	BadRequest,
	Forbidden,
	Notfound,
	Unauthorized,
} from '../modules/erros';

type BoardConstructorParams = {
	boardRepository: IRepository;
	taskRepository: IRepository;
};

export class BoardService {
	private readonly boardRepository: IRepository;
	private readonly taskRepository: IRepository;

	constructor({
		boardRepository,
		taskRepository,
	}: BoardConstructorParams) {
		this.boardRepository = boardRepository;
		this.taskRepository = taskRepository;
	}
	public async getAllBoards(req: IExtendedRequest) {
		if (!req.user!.id)
			throw new Unauthorized('You are not authorized!');
		const authorId = req.user!.id;

		const boards = await this.boardRepository.findByQuery<IBoard>({
			authorId,
		});
		return boards;
	}
	public async getAllBoardTasks(req: IExtendedRequest) {
		const { boardId } = req.params;
		const { boardId: boardIdQuery } = req.query;

		if (boardId !== boardIdQuery)
			throw new BadRequest(
				'boardId in query must match params',
			);

		if (!boardId) throw new BadRequest('Board not found!');
		const board = await this.boardRepository.findById<IBoard>(
			boardId as string,
		);

		if (!board) throw new Notfound('Board not found!');
		if (board.authorId != req.user!.id)
			throw new Forbidden(
				'You are not the author of this board!',
			);

		const tasks = await this.taskRepository.findByQuery<ITask>({
			authorId: req.user!.id,
			boardId: boardId as string,
		});

		if (!tasks || tasks.length === 0)
			throw new Notfound('Tasks not found!');

		return tasks;
	}
	public async findById(id: string) {
		return this.boardRepository.findById(id);
	}
	public async create(data: IBoard) {
		return this.boardRepository.create(data);
	}
	public async update(id: string, data: BoardUpdate) {
		return this.boardRepository.update(id, data);
	}
	public async delete(id: string) {
		return this.boardRepository.delete(id);
	}
}
