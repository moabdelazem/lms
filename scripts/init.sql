-- LMS Database Seed Data
-- This script seeds the database with test data for development

-- Create the LoanStatus enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "LoanStatus" AS ENUM ('BORROWED', 'RETURNED', 'OVERDUE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create tables if they don't exist (Prisma will handle this, but just in case)
CREATE TABLE IF NOT EXISTS "Author" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Book" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "isbn" VARCHAR(20) UNIQUE NOT NULL,
    "publishedYear" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "authorId" INTEGER NOT NULL REFERENCES "Author"("id"),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Member" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "phone" VARCHAR(20),
    "membershipDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Loan" (
    "id" SERIAL PRIMARY KEY,
    "bookId" INTEGER NOT NULL REFERENCES "Book"("id"),
    "memberId" INTEGER NOT NULL REFERENCES "Member"("id"),
    "borrowDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "status" "LoanStatus" NOT NULL DEFAULT 'BORROWED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- SEED DATA
-- ==============================================================================

-- Insert Authors
INSERT INTO "Author" ("name", "bio", "createdAt", "updatedAt") VALUES
('George Orwell', 'English novelist and essayist, journalist and critic. Best known for his dystopian novel 1984 and allegorical novella Animal Farm.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Jane Austen', 'English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mark Twain', 'American writer, humorist, entrepreneur, publisher, and lecturer. He was lauded as the "greatest humorist the United States has produced."', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Harper Lee', 'American novelist best known for her 1960 novel To Kill a Mockingbird. It won the 1961 Pulitzer Prize and has become a classic of modern American literature.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('F. Scott Fitzgerald', 'American novelist, essayist, and short story writer. He is best known for his novels depicting the flamboyance and excess of the Jazz Age.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ernest Hemingway', 'American novelist, short-story writer, and journalist. His economical and understated style had a strong influence on 20th-century fiction.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Virginia Woolf', 'English writer, considered one of the most important modernist 20th-century authors and a pioneer in the use of stream of consciousness as a narrative device.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Charles Dickens', 'English writer and social critic. He created some of the world''s best-known fictional characters and is regarded by many as the greatest novelist of the Victorian era.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert Books
INSERT INTO "Book" ("title", "isbn", "publishedYear", "quantity", "authorId", "createdAt", "updatedAt") VALUES
('1984', '978-0451524935', 1949, 5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Animal Farm', '978-0451526342', 1945, 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pride and Prejudice', '978-0141439518', 1813, 4, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sense and Sensibility', '978-0141439662', 1811, 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Emma', '978-0141439587', 1815, 3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Adventures of Tom Sawyer', '978-0486400778', 1876, 4, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Adventures of Huckleberry Finn', '978-0486280615', 1884, 3, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('To Kill a Mockingbird', '978-0061120084', 1960, 6, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Go Set a Watchman', '978-0062409850', 2015, 2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Great Gatsby', '978-0743273565', 1925, 5, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tender Is the Night', '978-0684801544', 1934, 2, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Old Man and the Sea', '978-0684801223', 1952, 4, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('A Farewell to Arms', '978-0684801469', 1929, 3, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('For Whom the Bell Tolls', '978-0684803357', 1940, 2, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mrs Dalloway', '978-0156628709', 1925, 3, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('To the Lighthouse', '978-0156907392', 1927, 2, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('A Tale of Two Cities', '978-0141439600', 1859, 4, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Great Expectations', '978-0141439563', 1861, 3, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Oliver Twist', '978-0141439747', 1837, 3, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('David Copperfield', '978-0140439441', 1850, 2, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("isbn") DO NOTHING;

-- Insert Members
INSERT INTO "Member" ("name", "email", "phone", "membershipDate", "createdAt", "updatedAt") VALUES
('Alice Johnson', 'alice.johnson@email.com', '+1-555-0101', CURRENT_TIMESTAMP - INTERVAL '1 year', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bob Smith', 'bob.smith@email.com', '+1-555-0102', CURRENT_TIMESTAMP - INTERVAL '10 months', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Carol Williams', 'carol.williams@email.com', '+1-555-0103', CURRENT_TIMESTAMP - INTERVAL '8 months', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('David Brown', 'david.brown@email.com', '+1-555-0104', CURRENT_TIMESTAMP - INTERVAL '6 months', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Emma Davis', 'emma.davis@email.com', '+1-555-0105', CURRENT_TIMESTAMP - INTERVAL '4 months', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Frank Miller', 'frank.miller@email.com', '+1-555-0106', CURRENT_TIMESTAMP - INTERVAL '3 months', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Grace Wilson', 'grace.wilson@email.com', '+1-555-0107', CURRENT_TIMESTAMP - INTERVAL '2 months', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Henry Taylor', 'henry.taylor@email.com', '+1-555-0108', CURRENT_TIMESTAMP - INTERVAL '1 month', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ivy Anderson', 'ivy.anderson@email.com', '+1-555-0109', CURRENT_TIMESTAMP - INTERVAL '2 weeks', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Jack Thomas', 'jack.thomas@email.com', '+1-555-0110', CURRENT_TIMESTAMP - INTERVAL '1 week', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO NOTHING;

-- Insert Loans (mix of borrowed, returned, and overdue)
INSERT INTO "Loan" ("bookId", "memberId", "borrowDate", "dueDate", "returnDate", "status", "createdAt", "updatedAt") VALUES
-- Returned loans
(1, 1, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '16 days', CURRENT_TIMESTAMP - INTERVAL '18 days', 'RETURNED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 2, CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '11 days', CURRENT_TIMESTAMP - INTERVAL '12 days', 'RETURNED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 3, CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '8 days', 'RETURNED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 4, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '3 days', 'RETURNED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Currently borrowed (not overdue)
(2, 5, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '9 days', NULL, 'BORROWED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 6, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '11 days', NULL, 'BORROWED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 7, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '12 days', NULL, 'BORROWED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 8, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '13 days', NULL, 'BORROWED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Overdue loans
(17, 9, CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '6 days', NULL, 'OVERDUE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(19, 10, CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_TIMESTAMP - INTERVAL '4 days', NULL, 'OVERDUE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Another active loan for member 1 (showing they can have multiple loans)
(5, 1, CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP + INTERVAL '10 days', NULL, 'BORROWED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Display summary
DO $$
DECLARE
    author_count INTEGER;
    book_count INTEGER;
    member_count INTEGER;
    loan_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO author_count FROM "Author";
    SELECT COUNT(*) INTO book_count FROM "Book";
    SELECT COUNT(*) INTO member_count FROM "Member";
    SELECT COUNT(*) INTO loan_count FROM "Loan";
    
    RAISE NOTICE '====================================';
    RAISE NOTICE 'LMS Database Seed Complete!';
    RAISE NOTICE '====================================';
    RAISE NOTICE 'Authors: %', author_count;
    RAISE NOTICE 'Books: %', book_count;
    RAISE NOTICE 'Members: %', member_count;
    RAISE NOTICE 'Loans: %', loan_count;
    RAISE NOTICE '====================================';
END $$;
