-- CreateEnum
CREATE TYPE "RateAlertStatus" AS ENUM ('ACTIVE', 'TRIGGERED', 'INACTIVE', 'EXPIRED');

-- CreateTable
CREATE TABLE "rate_alerts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "loan_type" TEXT NOT NULL,
    "target_rate" DOUBLE PRECISION NOT NULL,
    "loan_amount" DOUBLE PRECISION,
    "property_address" TEXT,
    "timeframe" TEXT NOT NULL DEFAULT '90 days',
    "status" "RateAlertStatus" NOT NULL DEFAULT 'ACTIVE',
    "notifications_sent" INTEGER NOT NULL DEFAULT 0,
    "last_checked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "triggered_at" TIMESTAMP(3),
    "idempotency_key" TEXT,
    "broker_id" TEXT,
    "loan_officer_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_alert_notifications" (
    "id" TEXT NOT NULL,
    "rate_alert_id" TEXT NOT NULL,
    "current_rate" DOUBLE PRECISION NOT NULL,
    "message" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rate_alert_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "property_address" TEXT,
    "loan_amount" DOUBLE PRECISION,
    "loan_type" TEXT,
    "target_rate" DOUBLE PRECISION,
    "lead_source" TEXT NOT NULL,
    "lead_score" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'new',
    "alert_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rate_alerts_email_idx" ON "rate_alerts"("email");

-- CreateIndex
CREATE INDEX "rate_alerts_user_id_idx" ON "rate_alerts"("user_id");

-- CreateIndex
CREATE INDEX "rate_alerts_status_idx" ON "rate_alerts"("status");

-- CreateIndex
CREATE INDEX "rate_alerts_loan_type_idx" ON "rate_alerts"("loan_type");

-- CreateIndex
CREATE INDEX "rate_alerts_target_rate_idx" ON "rate_alerts"("target_rate");

-- CreateIndex
CREATE INDEX "rate_alerts_created_at_idx" ON "rate_alerts"("created_at");

-- CreateIndex
CREATE INDEX "rate_alerts_broker_id_idx" ON "rate_alerts"("broker_id");

-- CreateIndex
CREATE INDEX "rate_alerts_loan_officer_id_idx" ON "rate_alerts"("loan_officer_id");

-- CreateIndex
CREATE UNIQUE INDEX "rate_alerts_idempotency_key_key" ON "rate_alerts"("idempotency_key");

-- CreateIndex
CREATE INDEX "rate_alerts_idempotency_key_idx" ON "rate_alerts"("idempotency_key");

-- CreateIndex
CREATE INDEX "rate_alert_notifications_rate_alert_id_idx" ON "rate_alert_notifications"("rate_alert_id");

-- CreateIndex
CREATE INDEX "rate_alert_notifications_sent_at_idx" ON "rate_alert_notifications"("sent_at");

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "leads"("email");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_lead_source_idx" ON "leads"("lead_source");

-- CreateIndex
CREATE INDEX "leads_created_at_idx" ON "leads"("created_at");

-- CreateIndex
CREATE INDEX "leads_alert_id_idx" ON "leads"("alert_id");

-- AddForeignKey
ALTER TABLE "rate_alerts" ADD CONSTRAINT "rate_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_alert_notifications" ADD CONSTRAINT "rate_alert_notifications_rate_alert_id_fkey" FOREIGN KEY ("rate_alert_id") REFERENCES "rate_alerts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
