/*
  Warnings:

  - You are about to drop the column `orderId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `deliveryFee` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryTimeMinutes` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotalPrice` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalDiscounts` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_barbershopId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "orderId",
ADD COLUMN     "deliveryFee" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "deliveryTimeMinutes" INTEGER NOT NULL,
ADD COLUMN     "status" "OrderStatus" NOT NULL,
ADD COLUMN     "subtotalPrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "totalDiscounts" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "totalPrice" DECIMAL(10,2) NOT NULL;

-- DropTable
DROP TABLE "Order";
