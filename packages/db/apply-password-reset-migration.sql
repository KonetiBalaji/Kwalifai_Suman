-- Manual migration script for password reset
-- Run this manually if migrate dev fails

-- Step 1: Add PENDING to UserStatus enum
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'PENDING' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserStatus')
    ) THEN
        ALTER TYPE "UserStatus" ADD VALUE 'PENDING';
    END IF;
END $$;

-- Step 2: Add PASSWORD_RESET to VerificationType enum
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'PASSWORD_RESET' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'VerificationType')
    ) THEN
        ALTER TYPE "VerificationType" ADD VALUE 'PASSWORD_RESET';
    END IF;
END $$;

-- Step 3: Change default status to PENDING
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'PENDING';
