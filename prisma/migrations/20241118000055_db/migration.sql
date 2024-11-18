/*
  Warnings:

  - Added the required column `createdBy` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastUpdatedAt` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `FormSubmissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastUpdatedAt` to the `FormSubmissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "allowMultipleSubmissions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "formFeedback" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "isDeactivated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastUpdatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "maxSubmissions" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "FormSubmissions" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "lastUpdatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft';
