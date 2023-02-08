/* eslint-disable import/no-import-module-exports */
import express from 'express';
import { allUsers } from '../controllers/userController';
import authController from '../controllers/authController';
import protect from '../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/', protect, allUsers);

export default router;
