-- CreateTable
CREATE TABLE "Credentials" (
    "userId" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "lastPassword" TEXT NOT NULL,
    "passwordUpdatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Credentials_userId_key" ON "Credentials"("userId");
