-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "isEditing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "roomCodeSalt" TEXT;
