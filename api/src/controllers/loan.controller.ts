import { Request, Response } from "express";
import prisma from "../config/database";
import { asyncHandler } from "../middlewares/asyncHandler";
import { BorrowBookInput } from "../types";

export const getAllLoans = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const loans = await prisma.loan.findMany({
      include: { book: true, member: true },
    });
    res.json({ success: true, data: loans });
  }
);

export const borrowBook = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { bookId, memberId, dueDate }: BorrowBookInput = req.body;

    // Check if book exists and has available copies
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }

    // Count active loans for this book
    const activeLoans = await prisma.loan.count({
      where: { bookId, status: "BORROWED" },
    });

    if (activeLoans >= book.quantity) {
      res
        .status(400)
        .json({ success: false, message: "No copies available for borrowing" });
      return;
    }

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      res.status(404).json({ success: false, message: "Member not found" });
      return;
    }

    // Create loan with default 14-day due date
    const loan = await prisma.loan.create({
      data: {
        bookId,
        memberId,
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      include: { book: true, member: true },
    });

    res.status(201).json({ success: true, data: loan });
  }
);

export const returnBook = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);

    const loan = await prisma.loan.findUnique({
      where: { id },
    });

    if (!loan) {
      res.status(404).json({ success: false, message: "Loan not found" });
      return;
    }

    if (loan.status === "RETURNED") {
      res.status(400).json({ success: false, message: "Book already returned" });
      return;
    }

    const updatedLoan = await prisma.loan.update({
      where: { id },
      data: {
        status: "RETURNED",
        returnDate: new Date(),
      },
      include: { book: true, member: true },
    });

    res.json({ success: true, data: updatedLoan });
  }
);

export const getMemberLoans = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const memberId = parseInt(req.params.memberId as string);

    const loans = await prisma.loan.findMany({
      where: { memberId },
      include: { book: true },
      orderBy: { borrowDate: "desc" },
    });

    res.json({ success: true, data: loans });
  }
);
