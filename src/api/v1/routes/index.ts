import { Router } from 'express';
import { auth } from './auth';
import { board } from './boards';
import { tasks } from './tasks';

const router = Router();

router.use('/auth', auth());
router.use('/boards', board());
router.use('/tasks', tasks());

export { router };
