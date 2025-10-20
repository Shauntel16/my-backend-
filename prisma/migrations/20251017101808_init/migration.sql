-- CreateTable
CREATE TABLE `studentAssistant` (
    `stud_Assistance_id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdBy` INTEGER NOT NULL,
    `location_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'DEACTIVATED') NOT NULL DEFAULT 'ACTIVE',
    `created_Date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_Date` DATETIME(3) NOT NULL,

    UNIQUE INDEX `studentAssistant_email_key`(`email`),
    INDEX `studentAssistant_location_id_idx`(`location_id`),
    INDEX `studentAssistant_email_idx`(`email`),
    INDEX `studentAssistant_status_idx`(`status`),
    INDEX `studentAssistant_createdBy_idx`(`createdBy`),
    PRIMARY KEY (`stud_Assistance_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `administrator` (
    `admin_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_Date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_Date` DATETIME(3) NOT NULL,

    UNIQUE INDEX `administrator_email_key`(`email`),
    INDEX `administrator_email_idx`(`email`),
    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leaveRequest` (
    `leave_id` INTEGER NOT NULL AUTO_INCREMENT,
    `studAssi_id` INTEGER NOT NULL,
    `reviewed_by` INTEGER NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `start_Date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `leave_type` ENUM('SICK', 'MATERNITY_LEAVE', 'FAMILY_RESPONSIBILITY') NOT NULL,
    `isGranted` ENUM('PENDING', 'APPROVED', 'DECLINED') NOT NULL DEFAULT 'PENDING',
    `reviewed_at` DATETIME(3) NULL,

    INDEX `leaveRequest_studAssi_id_idx`(`studAssi_id`),
    INDEX `leaveRequest_isGranted_idx`(`isGranted`),
    INDEX `leaveRequest_start_Date_end_date_idx`(`start_Date`, `end_date`),
    PRIMARY KEY (`leave_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance` (
    `attendance_id` INTEGER NOT NULL AUTO_INCREMENT,
    `studAssi_id` INTEGER NOT NULL,
    `shiftFK_id` INTEGER NOT NULL,
    `work_date` DATETIME(3) NOT NULL,
    `check_in_time` DATETIME(3) NOT NULL,
    `check_out_time` DATETIME(3) NULL,
    `hours_worked` DECIMAL(5, 2) NULL,
    `attendance_Status` ENUM('ACTIVE', 'DEACTIVATED') NOT NULL DEFAULT 'ACTIVE',

    UNIQUE INDEX `attendance_shiftFK_id_key`(`shiftFK_id`),
    INDEX `attendance_studAssi_id_idx`(`studAssi_id`),
    INDEX `attendance_work_date_idx`(`work_date`),
    PRIMARY KEY (`attendance_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shift` (
    `shift_id` INTEGER NOT NULL AUTO_INCREMENT,
    `studAssi_id` INTEGER NOT NULL,
    `sched_id` INTEGER NOT NULL,
    `shift_date` DATETIME(3) NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `shift_Status` ENUM('ACTIVE', 'DEACTIVATED') NOT NULL DEFAULT 'ACTIVE',
    `end_time` DATETIME(3) NOT NULL,
    `updated_Date` DATETIME(3) NOT NULL,

    INDEX `shift_studAssi_id_shift_date_idx`(`studAssi_id`, `shift_date`),
    INDEX `shift_shift_date_idx`(`shift_date`),
    INDEX `shift_sched_id_idx`(`sched_id`),
    PRIMARY KEY (`shift_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shiftExchange` (
    `exchange_id` INTEGER NOT NULL AUTO_INCREMENT,
    `shiftFK_id` INTEGER NOT NULL,
    `requester_id` INTEGER NOT NULL,
    `accepter_id` INTEGER NULL,
    `reviewed_by` INTEGER NULL,
    `shift_Exchange_status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `created_Date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `shiftExchange_requester_id_idx`(`requester_id`),
    INDEX `shiftExchange_accepter_id_idx`(`accepter_id`),
    INDEX `shiftExchange_shift_Exchange_status_idx`(`shift_Exchange_status`),
    PRIMARY KEY (`exchange_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location` (
    `location_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`location_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedule` (
    `schedule_id` INTEGER NOT NULL AUTO_INCREMENT,
    `reviewed_by` INTEGER NOT NULL,
    `loc_id` INTEGER NOT NULL,
    `month_start` DATETIME(3) NOT NULL,
    `month_end` DATETIME(3) NOT NULL,
    `created_Date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `schedule_loc_id_idx`(`loc_id`),
    INDEX `schedule_month_start_month_end_idx`(`month_start`, `month_end`),
    PRIMARY KEY (`schedule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `libraryClosure` (
    `closure_id` INTEGER NOT NULL AUTO_INCREMENT,
    `reviewed_by` INTEGER NOT NULL,
    `loc_id` INTEGER NOT NULL,
    `closure_date` DATETIME(3) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `created_Date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `libraryClosure_loc_id_idx`(`loc_id`),
    INDEX `libraryClosure_closure_date_idx`(`closure_date`),
    PRIMARY KEY (`closure_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `studentAssistant` ADD CONSTRAINT `studentAssistant_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `administrator`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `studentAssistant` ADD CONSTRAINT `studentAssistant_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `location`(`location_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaveRequest` ADD CONSTRAINT `leaveRequest_studAssi_id_fkey` FOREIGN KEY (`studAssi_id`) REFERENCES `studentAssistant`(`stud_Assistance_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaveRequest` ADD CONSTRAINT `leaveRequest_reviewed_by_fkey` FOREIGN KEY (`reviewed_by`) REFERENCES `administrator`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_studAssi_id_fkey` FOREIGN KEY (`studAssi_id`) REFERENCES `studentAssistant`(`stud_Assistance_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_shiftFK_id_fkey` FOREIGN KEY (`shiftFK_id`) REFERENCES `shift`(`shift_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shift` ADD CONSTRAINT `shift_studAssi_id_fkey` FOREIGN KEY (`studAssi_id`) REFERENCES `studentAssistant`(`stud_Assistance_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shift` ADD CONSTRAINT `shift_sched_id_fkey` FOREIGN KEY (`sched_id`) REFERENCES `schedule`(`schedule_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shiftExchange` ADD CONSTRAINT `shiftExchange_shiftFK_id_fkey` FOREIGN KEY (`shiftFK_id`) REFERENCES `shift`(`shift_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shiftExchange` ADD CONSTRAINT `shiftExchange_requester_id_fkey` FOREIGN KEY (`requester_id`) REFERENCES `studentAssistant`(`stud_Assistance_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shiftExchange` ADD CONSTRAINT `shiftExchange_accepter_id_fkey` FOREIGN KEY (`accepter_id`) REFERENCES `studentAssistant`(`stud_Assistance_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shiftExchange` ADD CONSTRAINT `shiftExchange_reviewed_by_fkey` FOREIGN KEY (`reviewed_by`) REFERENCES `administrator`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule` ADD CONSTRAINT `schedule_reviewed_by_fkey` FOREIGN KEY (`reviewed_by`) REFERENCES `administrator`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule` ADD CONSTRAINT `schedule_loc_id_fkey` FOREIGN KEY (`loc_id`) REFERENCES `location`(`location_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryClosure` ADD CONSTRAINT `libraryClosure_reviewed_by_fkey` FOREIGN KEY (`reviewed_by`) REFERENCES `administrator`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryClosure` ADD CONSTRAINT `libraryClosure_loc_id_fkey` FOREIGN KEY (`loc_id`) REFERENCES `location`(`location_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
