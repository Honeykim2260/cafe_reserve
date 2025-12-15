-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "public"."ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."SeatType" AS ENUM ('INDIVIDUAL', 'COUPLE', 'GROUP', 'MEETING_ROOM');

-- CreateEnum
CREATE TYPE "public"."CancellationReason" AS ENUM ('USER_REQUEST', 'CAFE_CLOSURE', 'EMERGENCY', 'SYSTEM_ERROR', 'PAYMENT_FAILED');

-- CreateEnum
CREATE TYPE "public"."RefundStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CREDIT_CARD', 'BANK_TRANSFER', 'MOBILE_PAY', 'POINTS');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cafes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "website" TEXT,
    "images" TEXT[],
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "basePrice" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cafes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."seats" (
    "id" TEXT NOT NULL,
    "seatNumber" TEXT NOT NULL,
    "seatType" "public"."SeatType" NOT NULL DEFAULT 'INDIVIDUAL',
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "priceMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "hasOutlet" BOOLEAN NOT NULL DEFAULT false,
    "hasWindow" BOOLEAN NOT NULL DEFAULT false,
    "isQuietZone" BOOLEAN NOT NULL DEFAULT false,
    "cafeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reservations" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" "public"."ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" "public"."CancellationReason",
    "cancellationNote" TEXT,
    "userId" TEXT NOT NULL,
    "cafeId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "images" TEXT[],
    "userId" TEXT NOT NULL,
    "cafeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cancellation_policies" (
    "id" TEXT NOT NULL,
    "cafeId" TEXT NOT NULL,
    "freecancellationHours" INTEGER NOT NULL DEFAULT 24,
    "earlyRefundRate" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    "standardRefundRate" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "lateRefundRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "noRefundBeforeHours" INTEGER NOT NULL DEFAULT 2,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cancellation_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentGateway" TEXT,
    "transactionId" TEXT,
    "receiptUrl" TEXT,
    "paidAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."refunds" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "originalAmount" INTEGER NOT NULL,
    "refundAmount" INTEGER NOT NULL,
    "feeAmount" INTEGER NOT NULL,
    "refundStatus" "public"."RefundStatus" NOT NULL DEFAULT 'PENDING',
    "refundReason" TEXT NOT NULL,
    "hoursBeforeStart" INTEGER NOT NULL,
    "appliedFeeRate" DOUBLE PRECISION NOT NULL,
    "processedAt" TIMESTAMP(3),
    "refundMethod" "public"."PaymentMethod",
    "refundTransactionId" TEXT,
    "failureReason" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "adminNote" TEXT,
    "processedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."refund_logs" (
    "id" TEXT NOT NULL,
    "refundId" TEXT NOT NULL,
    "previousStatus" "public"."RefundStatus",
    "newStatus" "public"."RefundStatus" NOT NULL,
    "reason" TEXT,
    "processedBy" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refund_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "seats_cafeId_seatNumber_key" ON "public"."seats"("cafeId", "seatNumber");

-- CreateIndex
CREATE UNIQUE INDEX "reservations_seatId_startTime_endTime_key" ON "public"."reservations"("seatId", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_cafeId_key" ON "public"."reviews"("userId", "cafeId");

-- CreateIndex
CREATE UNIQUE INDEX "cancellation_policies_cafeId_key" ON "public"."cancellation_policies"("cafeId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_reservationId_key" ON "public"."payments"("reservationId");

-- CreateIndex
CREATE UNIQUE INDEX "refunds_reservationId_key" ON "public"."refunds"("reservationId");

-- AddForeignKey
ALTER TABLE "public"."cafes" ADD CONSTRAINT "cafes_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."seats" ADD CONSTRAINT "seats_cafeId_fkey" FOREIGN KEY ("cafeId") REFERENCES "public"."cafes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservations" ADD CONSTRAINT "reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservations" ADD CONSTRAINT "reservations_cafeId_fkey" FOREIGN KEY ("cafeId") REFERENCES "public"."cafes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservations" ADD CONSTRAINT "reservations_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "public"."seats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_cafeId_fkey" FOREIGN KEY ("cafeId") REFERENCES "public"."cafes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cancellation_policies" ADD CONSTRAINT "cancellation_policies_cafeId_fkey" FOREIGN KEY ("cafeId") REFERENCES "public"."cafes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "public"."reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."refunds" ADD CONSTRAINT "refunds_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "public"."reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
