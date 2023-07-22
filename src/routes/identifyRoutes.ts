import express  from "express";
import { identifyController } from "../controllers/identifyController";

const router = express.Router();

//Router for POST requests to /identify endpoint
router.post('/', identifyController);

export default router;