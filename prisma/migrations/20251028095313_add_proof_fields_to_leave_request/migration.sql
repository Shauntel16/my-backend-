-- AlterTable
-- This migration adds proof fields to the leaveRequest table
-- These fields allow storing proof documents uploaded by student assistants
-- Note: If these columns already exist (from a previous migration), this migration will fail
-- In that case, you can safely ignore the error or manually check column existence

ALTER TABLE `leaveRequest` 
  ADD COLUMN `proof_url` VARCHAR(191) NULL,
  ADD COLUMN `proof_file_content` LONGBLOB NULL,
  ADD COLUMN `proof_file_type` VARCHAR(191) NULL,
  ADD COLUMN `proof_file_name` VARCHAR(191) NULL;

