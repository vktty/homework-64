import { BaseRepository } from './base';

export class TaskRepository extends BaseRepository {
	constructor() {
		super('tasks');
	}
}
