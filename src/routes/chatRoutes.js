import express from 'express';
import protect from '../middleware/authMiddleware';
import {
  createChats,
  createGroup,
  getAllChats,
  removeFromGroup,
  addToGroup,
} from '../controllers/chatController';

const router = express.Router();
router.route('/').post(protect, createChats).get(protect, getAllChats);
router.route('/group').post(protect, createGroup);
router.route('/groupadd').patch(protect, addToGroup);
router.route('/groupremove').patch(protect, removeFromGroup);

export default router;
