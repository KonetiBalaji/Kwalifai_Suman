-- CreateEnum
CREATE TYPE "CalculatorType" AS ENUM ('MORTGAGE', 'REFINANCE', 'AFFORDABILITY', 'AMORTIZATION');

-- CreateTable
CREATE TABLE "calculator_scenarios" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "CalculatorType" NOT NULL,
    "name" TEXT,
    "inputs" JSONB NOT NULL,
    "results" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calculator_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "calculator_scenarios_user_id_idx" ON "calculator_scenarios"("user_id");

-- CreateIndex
CREATE INDEX "calculator_scenarios_type_idx" ON "calculator_scenarios"("type");

-- CreateIndex
CREATE INDEX "calculator_scenarios_created_at_idx" ON "calculator_scenarios"("created_at");

-- AddForeignKey
ALTER TABLE "calculator_scenarios" ADD CONSTRAINT "calculator_scenarios_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
