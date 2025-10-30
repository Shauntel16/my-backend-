-- AlterTable: Make reviewed_by nullable in leaveRequest table
-- This allows creating leave requests without specifying reviewed_by
-- It will be set when an admin approves or declines the request

ALTER TABLE `leaveRequest` 
  MODIFY COLUMN `reviewed_by` INTEGER NULL;

