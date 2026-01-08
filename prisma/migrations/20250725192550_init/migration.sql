/*
  Warnings:

  - You are about to drop the column `stampImageUrl` on the `Place` table. All the data in the column will be lost.
  - Added the required column `carrer` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Place" DROP COLUMN "stampImageUrl";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "carrer" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "User_id_seq";
