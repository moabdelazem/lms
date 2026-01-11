import { z } from "zod";

// Author schemas
export const createAuthorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
});

export const updateAuthorSchema = createAuthorSchema.partial();

// Book schemas
export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  isbn: z.string().min(1, "ISBN is required"),
  publishedYear: z.number().int().optional(),
  quantity: z.number().int().min(0).default(1),
  authorId: z.number().int().positive("Author ID is required"),
});

export const updateBookSchema = createBookSchema.partial();

// Member schemas
export const createMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
});

export const updateMemberSchema = createMemberSchema.partial();

// Loan schemas
export const borrowBookSchema = z.object({
  bookId: z.number().int().positive("Book ID is required"),
  memberId: z.number().int().positive("Member ID is required"),
  dueDate: z.string().datetime().optional(),
});

// Type exports
export type CreateAuthorInput = z.infer<typeof createAuthorSchema>;
export type UpdateAuthorInput = z.infer<typeof updateAuthorSchema>;
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
export type BorrowBookInput = z.infer<typeof borrowBookSchema>;
