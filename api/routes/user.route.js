import express from 'express';
import { test } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/test', test);// test ta asche user.controller.js file theke

export default router;