-- CreateTable
CREATE TABLE "myschema"."FacebookPage" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "tasks" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacebookPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FacebookPage_userId_pageId_key" ON "myschema"."FacebookPage"("userId", "pageId");

-- AddForeignKey
ALTER TABLE "myschema"."FacebookPage" ADD CONSTRAINT "FacebookPage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "myschema"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
