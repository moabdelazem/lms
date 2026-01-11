import { Router } from "express";
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../controllers/author.controller";
import { validate } from "../middlewares/validate.middleware";
import { createAuthorSchema, updateAuthorSchema } from "../types";

const router = Router();

router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.post("/", validate(createAuthorSchema), createAuthor);
router.put("/:id", validate(updateAuthorSchema), updateAuthor);
router.delete("/:id", deleteAuthor);

export default router;
