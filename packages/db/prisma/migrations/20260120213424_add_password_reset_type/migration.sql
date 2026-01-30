-- Add PASSWORD_RESET to VerificationType enum
ALTER TYPE "VerificationType" ADD VALUE 'PASSWORD_RESET';

-- Change default status to PENDING (after enum value is committed)
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'PENDING';
