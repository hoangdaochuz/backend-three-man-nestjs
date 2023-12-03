-- AlterTable
ALTER TABLE "Credentials" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Credentials_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Credentials" ADD CONSTRAINT "Credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
