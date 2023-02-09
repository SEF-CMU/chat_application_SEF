import express from 'express';
import { allMessages, sendMessage } from '../controllers/messageController';
import protect from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, sendMessage);
router.get('/:chatId', protect, allMessages);

export default router;
