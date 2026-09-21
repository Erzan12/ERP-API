/*
  Warnings:

  - A unique constraint covering the columns `[party_id]` on the table `HrErCaseHearing` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HrErCaseHearing_party_id_key" ON "HrErCaseHearing"("party_id");
