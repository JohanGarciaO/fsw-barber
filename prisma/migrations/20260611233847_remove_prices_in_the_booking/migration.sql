/*
  Warnings:

  - You are about to drop the column `deliveryFee` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryTimeMinutes` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `subtotalPrice` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `totalDiscounts` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "deliveryFee",
DROP COLUMN "deliveryTimeMinutes",
DROP COLUMN "subtotalPrice",
DROP COLUMN "totalDiscounts",
DROP COLUMN "totalPrice";
