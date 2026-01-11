import { Router } from "express";
import {
  getAllLoans,
  borrowBook,
  returnBook,
  getMemberLoans,
} from "../controllers/loan.controller";
import { validate } from "../middlewares/validate.middleware";
import { borrowBookSchema } from "../types";

const router = Router();

router.get("/", getAllLoans);
router.post("/borrow", validate(borrowBookSchema), borrowBook);
router.post("/return/:id", returnBook);
router.get("/member/:memberId", getMemberLoans);

export default router;
