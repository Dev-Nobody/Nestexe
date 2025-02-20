-- DropForeignKey
ALTER TABLE `JobApplication` DROP FOREIGN KEY `JobApplication_jobId_fkey`;

-- DropForeignKey
ALTER TABLE `JobApplication` DROP FOREIGN KEY `JobApplication_userId_fkey`;

-- DropIndex
DROP INDEX `JobApplication_jobId_fkey` ON `JobApplication`;

-- DropIndex
DROP INDEX `JobApplication_userId_fkey` ON `JobApplication`;

-- AddForeignKey
ALTER TABLE `JobApplication` ADD CONSTRAINT `JobApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobApplication` ADD CONSTRAINT `JobApplication_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
