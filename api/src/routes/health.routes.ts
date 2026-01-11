import { Router } from "express";
import { healthCheck, readyCheck } from "../controllers/health.controller";

const router = Router();

router.get("/health", healthCheck);
router.get("/ready", readyCheck);

export default router;
