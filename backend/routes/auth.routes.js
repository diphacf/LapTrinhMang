import express from 'express';
import {
    register,
    login,
    refreshToken,
    getMe,
    logout,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);


router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
