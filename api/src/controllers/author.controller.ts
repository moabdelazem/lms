import { Request, Response } from "express";
import prisma from "../config/database";
import { asyncHandler } from "../middlewares/asyncHandler";
import { CreateAuthorInput, UpdateAuthorInput } from "../types";

export const getAllAuthors = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const authors = await prisma.author.findMany({
      include: { books: true },
    });
    res.json({ success: true, data: authors });
  }
);

export const getAuthorById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    const author = await prisma.author.findUnique({
      where: { id },
      include: { books: true },
    });

    if (!author) {
      res.status(404).json({ success: false, message: "Author not found" });
      return;
    }

    res.json({ success: true, data: author });
  }
);

export const createAuthor = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const data: CreateAuthorInput = req.body;
    const author = await prisma.author.create({ data });
    res.status(201).json({ success: true, data: author });
  }
);

export const updateAuthor = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    const data: UpdateAuthorInput = req.body;

    const author = await prisma.author.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: author });
  }
);

export const deleteAuthor = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);

    await prisma.author.delete({
      where: { id },
    });

    res.json({ success: true, message: "Author deleted successfully" });
  }
);

