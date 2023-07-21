import express  from "express";
import { identityController } from "../controllers/identityController";

const router = express.Router();

//Router for POST requests to /identify endpoint
router.post('/', identityController);

export default router;