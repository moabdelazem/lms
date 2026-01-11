import { Router } from "express";
import {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/member.controller";
import { validate } from "../middlewares/validate.middleware";
import { createMemberSchema, updateMemberSchema } from "../types";

const router = Router();

router.get("/", getAllMembers);
router.get("/:id", getMemberById);
router.post("/", validate(createMemberSchema), createMember);
router.put("/:id", validate(updateMemberSchema), updateMember);
router.delete("/:id", deleteMember);

export default router;
