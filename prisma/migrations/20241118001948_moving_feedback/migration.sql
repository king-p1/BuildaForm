/*
  Warnings:

  - You are about to drop the column `formFeedback` on the `Form` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "formFeedback";

-- AlterTable
ALTER TABLE "FormSubmissions" ADD COLUMN     "feedback" TEXT NOT NULL DEFAULT '';
