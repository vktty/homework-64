import {
	IBoard,
	IExtendedRequest,
	IRepository,
	ITask,
	TaskUpdate,
} from '../interfaces';
import { BadRequest, Forbidden, Notfound } from '../modules/erros';

type TaskConstructorParams = {
	repository: IRepository;
};

export class TaskService {
	private readonly repository: IRepository;
	constructor({ repository }: TaskConstructorParams) {
		this.repository = repository;
	}
	public async getAll(req: IExtendedRequest) {
		const { boardId } = req.query;

		if (!boardId) throw new BadRequest('boardId required');
		const [board] = await this.repository.findByQuery<IBoard>({
			boardId: boardId as string,
		});

		if (!board) throw new Notfound('Board not found!');
		if (board.authorId != req.user!.id)
			throw new Forbidden(
				'You are not the author of this board!',
			);

		const tasks = await this.repository.findByQuery<ITask>({
			authorId: req.user!.id,
			boardId: boardId as string,
		});

		if (!tasks || tasks.length === 0)
			throw new Notfound('Tasks not found!');

		return tasks;
	}
	public async findById(id: string) {
		return this.repository.findById(id);
	}
	public async create(data: ITask) {
		return this.repository.create(data);
	}
	public async update(id: string, data: TaskUpdate) {
		return this.repository.update(id, data);
	}
	public async delete(id: string) {
		return this.repository.delete(id);
	}
}
