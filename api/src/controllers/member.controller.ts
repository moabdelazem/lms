import { Request, Response } from "express";
import prisma from "../config/database";
import { asyncHandler } from "../middlewares/asyncHandler";
import { CreateMemberInput, UpdateMemberInput } from "../types";

export const getAllMembers = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const members = await prisma.member.findMany();
    res.json({ success: true, data: members });
  }
);

export const getMemberById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    const member = await prisma.member.findUnique({
      where: { id },
      include: { loans: { include: { book: true } } },
    });

    if (!member) {
      res.status(404).json({ success: false, message: "Member not found" });
      return;
    }

    res.json({ success: true, data: member });
  }
);

export const createMember = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const data: CreateMemberInput = req.body;
    const member = await prisma.member.create({ data });
    res.status(201).json({ success: true, data: member });
  }
);

export const updateMember = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    const data: UpdateMemberInput = req.body;

    const member = await prisma.member.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: member });
  }
);

export const deleteMember = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);

    await prisma.member.delete({
      where: { id },
    });

    res.json({ success: true, message: "Member deleted successfully" });
  }
);
