-- CreateEnum
CREATE TYPE "StatementStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'ANALYZED', 'FAILED');

-- CreateEnum
CREATE TYPE "StatementSource" AS ENUM ('MANUAL', 'OCR', 'API');

-- CreateEnum
CREATE TYPE "AnalysisVersion" AS ENUM ('V1', 'V2_OCR', 'V3_AI');

-- CreateTable
CREATE TABLE "statements" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "session_id" TEXT,
    "status" "StatementStatus" NOT NULL DEFAULT 'UPLOADED',
    "source" "StatementSource" NOT NULL DEFAULT 'MANUAL',
    "idempotency_key" TEXT,
    "customer_name" TEXT,
    "customer_email" TEXT,
    "customer_phone" TEXT,
    "broker_id" TEXT,
    "loan_officer_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statement_files" (
    "id" TEXT NOT NULL,
    "statement_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "storage_type" TEXT NOT NULL DEFAULT 'local',
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statement_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statement_analyses" (
    "id" TEXT NOT NULL,
    "statement_id" TEXT NOT NULL,
    "version" "AnalysisVersion" NOT NULL DEFAULT 'V1',
    "current_balance" DOUBLE PRECISION,
    "current_rate" DOUBLE PRECISION,
    "monthly_payment" DOUBLE PRECISION,
    "property_address" TEXT,
    "lender_name" TEXT,
    "escrow_balance" DOUBLE PRECISION,
    "loan_number" TEXT,
    "next_payment_date" TEXT,
    "results" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "error_message" TEXT,
    "analyzed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statement_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "statements_idempotency_key_key" ON "statements"("idempotency_key");

-- CreateIndex
CREATE INDEX "statements_user_id_idx" ON "statements"("user_id");

-- CreateIndex
CREATE INDEX "statements_session_id_idx" ON "statements"("session_id");

-- CreateIndex
CREATE INDEX "statements_status_idx" ON "statements"("status");

-- CreateIndex
CREATE INDEX "statements_broker_id_idx" ON "statements"("broker_id");

-- CreateIndex
CREATE INDEX "statements_loan_officer_id_idx" ON "statements"("loan_officer_id");

-- CreateIndex
CREATE INDEX "statements_idempotency_key_idx" ON "statements"("idempotency_key");

-- CreateIndex
CREATE INDEX "statements_created_at_idx" ON "statements"("created_at");

-- CreateIndex
CREATE INDEX "statement_files_statement_id_idx" ON "statement_files"("statement_id");

-- CreateIndex
CREATE INDEX "statement_files_uploaded_at_idx" ON "statement_files"("uploaded_at");

-- CreateIndex
CREATE INDEX "statement_analyses_statement_id_idx" ON "statement_analyses"("statement_id");

-- CreateIndex
CREATE INDEX "statement_analyses_version_idx" ON "statement_analyses"("version");

-- CreateIndex
CREATE INDEX "statement_analyses_is_active_idx" ON "statement_analyses"("is_active");

-- CreateIndex
CREATE INDEX "statement_analyses_analyzed_at_idx" ON "statement_analyses"("analyzed_at");

-- AddForeignKey
ALTER TABLE "statements" ADD CONSTRAINT "statements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statement_files" ADD CONSTRAINT "statement_files_statement_id_fkey" FOREIGN KEY ("statement_id") REFERENCES "statements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statement_analyses" ADD CONSTRAINT "statement_analyses_statement_id_fkey" FOREIGN KEY ("statement_id") REFERENCES "statements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
