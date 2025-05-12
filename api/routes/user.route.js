import express from 'express';
import { test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);// test ta asche user.controller.js file theke
router.put('/update/:userId',verifyToken,updateUser);

export default router;