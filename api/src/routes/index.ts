import { Router } from "express";
import authorRoutes from "./author.routes";
import bookRoutes from "./book.routes";
import memberRoutes from "./member.routes";
import loanRoutes from "./loan.routes";

const router = Router();

router.use("/authors", authorRoutes);
router.use("/books", bookRoutes);
router.use("/members", memberRoutes);
router.use("/loans", loanRoutes);

export default router;
