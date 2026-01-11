import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/book.controller";
import { validate } from "../middlewares/validate.middleware";
import { createBookSchema, updateBookSchema } from "../types";

const router = Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", validate(createBookSchema), createBook);
router.put("/:id", validate(updateBookSchema), updateBook);
router.delete("/:id", deleteBook);

export default router;
