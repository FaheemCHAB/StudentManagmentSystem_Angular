IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Batches] (
    [BatchId] uniqueidentifier NOT NULL,
    [BatchName] nvarchar(max) NOT NULL,
    [BatchTime] nvarchar(max) NOT NULL,
    [BatchDescription] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Batches] PRIMARY KEY ([BatchId])
);

CREATE TABLE [Colleges] (
    [CollegeId] uniqueidentifier NOT NULL,
    [CollegeName] nvarchar(max) NOT NULL,
    [Location] nvarchar(max) NOT NULL,
    [District] nvarchar(max) NOT NULL,
    [State] nvarchar(max) NOT NULL,
    [Phone] nvarchar(max) NULL,
    [Description] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Colleges] PRIMARY KEY ([CollegeId])
);

CREATE TABLE [Courses] (
    [CourseId] uniqueidentifier NOT NULL,
    [CourseName] nvarchar(max) NOT NULL,
    [CourseFee] float NOT NULL,
    [CourseDuration] nvarchar(max) NOT NULL,
    [CourseDescription] nvarchar(max) NOT NULL,
    [InstallmentCount] int NOT NULL,
    CONSTRAINT [PK_Courses] PRIMARY KEY ([CourseId])
);

CREATE TABLE [QualificationMaster] (
    [QualificationListId] uniqueidentifier NOT NULL,
    [QualificationName] nvarchar(max) NOT NULL,
    [QualificationDiscription] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_QualificationMaster] PRIMARY KEY ([QualificationListId])
);

CREATE TABLE [TrialStudents] (
    [TrialStudentId] uniqueidentifier NOT NULL,
    [FirstName] nvarchar(max) NOT NULL,
    [LastName] nvarchar(max) NOT NULL,
    [Address] nvarchar(max) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [studentStatus] int NOT NULL,
    [Phone] nvarchar(max) NOT NULL,
    [RegistrationTime] datetime2 NOT NULL,
    [CourseId] uniqueidentifier NULL,
    CONSTRAINT [PK_TrialStudents] PRIMARY KEY ([TrialStudentId]),
    CONSTRAINT [FK_TrialStudents_Courses_CourseId] FOREIGN KEY ([CourseId]) REFERENCES [Courses] ([CourseId])
);

CREATE TABLE [RegistrationFees] (
    [RegistrationFeeId] uniqueidentifier NOT NULL,
    [TrialStudentId] uniqueidentifier NOT NULL,
    [Fee] float NULL,
    [FeeStatus] int NULL,
    [FeeReceivedDate] datetime2 NULL,
    CONSTRAINT [PK_RegistrationFees] PRIMARY KEY ([RegistrationFeeId]),
    CONSTRAINT [FK_RegistrationFees_TrialStudents_TrialStudentId] FOREIGN KEY ([TrialStudentId]) REFERENCES [TrialStudents] ([TrialStudentId]) ON DELETE CASCADE
);

CREATE TABLE [StudentProfiles] (
    [StudentId] uniqueidentifier NOT NULL,
    [StudentReferenceId] nvarchar(max) NULL,
    [TrialStudentId] uniqueidentifier NULL,
    [EnrollmentType] int NOT NULL,
    [ReferredBy] int NOT NULL,
    [DOB] date NOT NULL,
    [Documents] varbinary(max) NULL,
    [IsFullyPaid] bit NOT NULL,
    [FirstName] nvarchar(max) NULL,
    [LastName] nvarchar(max) NULL,
    [Email] nvarchar(max) NULL,
    [Phone] nvarchar(max) NULL,
    [Address] nvarchar(max) NULL,
    [studentStatus] int NOT NULL,
    [RegistrationTime] datetime2 NOT NULL,
    [BatchId] uniqueidentifier NULL,
    [CourseId] uniqueidentifier NULL,
    CONSTRAINT [PK_StudentProfiles] PRIMARY KEY ([StudentId]),
    CONSTRAINT [FK_StudentProfiles_Batches_BatchId] FOREIGN KEY ([BatchId]) REFERENCES [Batches] ([BatchId]),
    CONSTRAINT [FK_StudentProfiles_Courses_CourseId] FOREIGN KEY ([CourseId]) REFERENCES [Courses] ([CourseId]),
    CONSTRAINT [FK_StudentProfiles_TrialStudents_TrialStudentId] FOREIGN KEY ([TrialStudentId]) REFERENCES [TrialStudents] ([TrialStudentId])
);

CREATE TABLE [CourseDetails] (
    [CourseDetailId] uniqueidentifier NOT NULL,
    [StudentProfileId] uniqueidentifier NOT NULL,
    [CourseId] uniqueidentifier NOT NULL,
    [BatchId] uniqueidentifier NOT NULL,
    [TimeSlot] nvarchar(max) NOT NULL,
    [Status] int NOT NULL,
    [Mode] int NOT NULL,
    CONSTRAINT [PK_CourseDetails] PRIMARY KEY ([CourseDetailId]),
    CONSTRAINT [FK_CourseDetails_Batches_BatchId] FOREIGN KEY ([BatchId]) REFERENCES [Batches] ([BatchId]) ON DELETE CASCADE,
    CONSTRAINT [FK_CourseDetails_Courses_CourseId] FOREIGN KEY ([CourseId]) REFERENCES [Courses] ([CourseId]) ON DELETE CASCADE,
    CONSTRAINT [FK_CourseDetails_StudentProfiles_StudentProfileId] FOREIGN KEY ([StudentProfileId]) REFERENCES [StudentProfiles] ([StudentId]) ON DELETE CASCADE
);

CREATE TABLE [Experiences] (
    [ExperienceId] uniqueidentifier NOT NULL,
    [StudentId] uniqueidentifier NOT NULL,
    [Position] nvarchar(max) NOT NULL,
    [CompanyName] nvarchar(max) NOT NULL,
    [TotalExperience] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Experiences] PRIMARY KEY ([ExperienceId]),
    CONSTRAINT [FK_Experiences_StudentProfiles_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [StudentProfiles] ([StudentId]) ON DELETE CASCADE
);

CREATE TABLE [Qualifications] (
    [QualificationId] uniqueidentifier NOT NULL,
    [StudentId] uniqueidentifier NOT NULL,
    [QualificationName] nvarchar(max) NOT NULL,
    [CollegeId] uniqueidentifier NOT NULL,
    [PassOutYear] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Qualifications] PRIMARY KEY ([QualificationId]),
    CONSTRAINT [FK_Qualifications_Colleges_CollegeId] FOREIGN KEY ([CollegeId]) REFERENCES [Colleges] ([CollegeId]) ON DELETE CASCADE,
    CONSTRAINT [FK_Qualifications_StudentProfiles_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [StudentProfiles] ([StudentId]) ON DELETE CASCADE
);

CREATE TABLE [ReturnFees] (
    [ReturnId] int NOT NULL IDENTITY,
    [ReturnMode] int NOT NULL,
    [ReturnAmount] float NOT NULL,
    [ReturnDate] datetime2 NOT NULL,
    [Remarks] nvarchar(max) NULL,
    [StudentId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_ReturnFees] PRIMARY KEY ([ReturnId]),
    CONSTRAINT [FK_ReturnFees_StudentProfiles_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [StudentProfiles] ([StudentId]) ON DELETE CASCADE
);

CREATE TABLE [Transactions] (
    [TransactionId] uniqueidentifier NOT NULL,
    [StudentId] uniqueidentifier NULL,
    [TrialStudentId] uniqueidentifier NULL,
    [TransactionAmount] float NOT NULL,
    [Status] int NOT NULL,
    [Remark] nvarchar(max) NULL,
    [TransactionDate] datetime2 NOT NULL,
    CONSTRAINT [PK_Transactions] PRIMARY KEY ([TransactionId]),
    CONSTRAINT [FK_Transactions_StudentProfiles_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [StudentProfiles] ([StudentId]),
    CONSTRAINT [FK_Transactions_TrialStudents_TrialStudentId] FOREIGN KEY ([TrialStudentId]) REFERENCES [TrialStudents] ([TrialStudentId])
);

CREATE TABLE [FeeStructures] (
    [InstallmentId] uniqueidentifier NOT NULL,
    [StudentId] uniqueidentifier NOT NULL,
    [CourseDetailId] uniqueidentifier NOT NULL,
    [TotalInstallment] int NOT NULL,
    CONSTRAINT [PK_FeeStructures] PRIMARY KEY ([InstallmentId]),
    CONSTRAINT [FK_FeeStructures_CourseDetails_CourseDetailId] FOREIGN KEY ([CourseDetailId]) REFERENCES [CourseDetails] ([CourseDetailId]) ON DELETE CASCADE,
    CONSTRAINT [FK_FeeStructures_StudentProfiles_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [StudentProfiles] ([StudentId]) ON DELETE NO ACTION
);

CREATE TABLE [Fees] (
    [FeeId] uniqueidentifier NOT NULL,
    [FeeStructureId] uniqueidentifier NOT NULL,
    [InstallmentNumber] int NOT NULL,
    [DueDate] date NOT NULL,
    [Amount] float NULL,
    [AmountReceived] float NULL,
    [DueAmount] float NULL,
    [CurrentReceivedAmount] float NULL,
    [AmountReceivedDate] datetime2 NULL,
    [Status] int NOT NULL,
    [PaymentMode] int NULL,
    [Remarks] nvarchar(max) NULL,
    CONSTRAINT [PK_Fees] PRIMARY KEY ([FeeId]),
    CONSTRAINT [FK_Fees_FeeStructures_FeeStructureId] FOREIGN KEY ([FeeStructureId]) REFERENCES [FeeStructures] ([InstallmentId]) ON DELETE CASCADE
);

CREATE INDEX [IX_CourseDetails_BatchId] ON [CourseDetails] ([BatchId]);

CREATE INDEX [IX_CourseDetails_CourseId] ON [CourseDetails] ([CourseId]);

CREATE INDEX [IX_CourseDetails_StudentProfileId] ON [CourseDetails] ([StudentProfileId]);

CREATE INDEX [IX_Experiences_StudentId] ON [Experiences] ([StudentId]);

CREATE INDEX [IX_Fees_FeeStructureId] ON [Fees] ([FeeStructureId]);

CREATE INDEX [IX_FeeStructures_CourseDetailId] ON [FeeStructures] ([CourseDetailId]);

CREATE INDEX [IX_FeeStructures_StudentId] ON [FeeStructures] ([StudentId]);

CREATE INDEX [IX_Qualifications_CollegeId] ON [Qualifications] ([CollegeId]);

CREATE INDEX [IX_Qualifications_StudentId] ON [Qualifications] ([StudentId]);

CREATE UNIQUE INDEX [IX_RegistrationFees_TrialStudentId] ON [RegistrationFees] ([TrialStudentId]);

CREATE INDEX [IX_ReturnFees_StudentId] ON [ReturnFees] ([StudentId]);

CREATE INDEX [IX_StudentProfiles_BatchId] ON [StudentProfiles] ([BatchId]);

CREATE INDEX [IX_StudentProfiles_CourseId] ON [StudentProfiles] ([CourseId]);

CREATE INDEX [IX_StudentProfiles_TrialStudentId] ON [StudentProfiles] ([TrialStudentId]);

CREATE INDEX [IX_Transactions_StudentId] ON [Transactions] ([StudentId]);

CREATE INDEX [IX_Transactions_TrialStudentId] ON [Transactions] ([TrialStudentId]);

CREATE INDEX [IX_TrialStudents_CourseId] ON [TrialStudents] ([CourseId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250922052838_new', N'9.0.5');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251023073012_context', N'9.0.5');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251023073413_contextk', N'9.0.5');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251023075219_cont', N'9.0.5');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251023084521_jj', N'9.0.5');

COMMIT;
GO

