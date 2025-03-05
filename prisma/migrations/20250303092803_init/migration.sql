/*
  Warnings:

  - You are about to drop the `EventImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Events` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Booking` DROP FOREIGN KEY `Booking_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `EventApprovalRequest` DROP FOREIGN KEY `EventApprovalRequest_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `EventCategories` DROP FOREIGN KEY `EventCategories_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `EventImages` DROP FOREIGN KEY `EventImages_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `Events` DROP FOREIGN KEY `Events_userId_fkey`;

-- DropIndex
DROP INDEX `Booking_eventId_fkey` ON `Booking`;

-- DropTable
DROP TABLE `EventImages`;

-- DropTable
DROP TABLE `Events`;

-- CreateTable
CREATE TABLE `events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `eventTitle` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `eventDate` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `totalSeats` INTEGER NOT NULL,
    `ticketPrice` DECIMAL(65, 30) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,
    `eventBanner` VARCHAR(191) NOT NULL,

    INDEX `events_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eventImages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventApprovalRequest` ADD CONSTRAINT `EventApprovalRequest_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventCategories` ADD CONSTRAINT `EventCategories_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventImages` ADD CONSTRAINT `eventImages_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
