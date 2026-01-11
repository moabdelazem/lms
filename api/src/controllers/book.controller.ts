import { Request, Response } from "express";
import prisma from "../config/database";
import { asyncHandler } from "../middlewares/asyncHandler";
import { CreateBookInput, UpdateBookInput } from "../types";

export const getAllBooks = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const books = await prisma.book.findMany({
      include: { author: true },
    });
    res.json({ success: true, data: books });
  }
);

export const getBookById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    const book = await prisma.book.findUnique({
      where: { id },
      include: { author: true, loans: true },
    });

    if (!book) {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }

    res.json({ success: true, data: book });
  }
);

export const createBook = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const data: CreateBookInput = req.body;
    const book = await prisma.book.create({
      data,
      include: { author: true },
    });
    res.status(201).json({ success: true, data: book });
  }
);

export const updateBook = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    const data: UpdateBookInput = req.body;

    const book = await prisma.book.update({
      where: { id },
      data,
      include: { author: true },
    });

    res.json({ success: true, data: book });
  }
);

export const deleteBook = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);

    await prisma.book.delete({
      where: { id },
    });

    res.json({ success: true, message: "Book deleted successfully" });
  }
);
