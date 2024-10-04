-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "category" TEXT,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'Medium';
