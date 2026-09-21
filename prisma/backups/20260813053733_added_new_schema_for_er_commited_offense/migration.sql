-- CreateTable
CREATE TABLE "HrErCasePartyOffense" (
    "id" UUID NOT NULL,
    "party_id" UUID NOT NULL,
    "offense_id" UUID NOT NULL,

    CONSTRAINT "HrErCasePartyOffense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HrErCasePartyOffense_party_id_idx" ON "HrErCasePartyOffense"("party_id");

-- CreateIndex
CREATE UNIQUE INDEX "HrErCasePartyOffense_party_id_offense_id_key" ON "HrErCasePartyOffense"("party_id", "offense_id");

-- AddForeignKey
ALTER TABLE "HrErCasePartyOffense" ADD CONSTRAINT "HrErCasePartyOffense_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "HrErCaseParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCasePartyOffense" ADD CONSTRAINT "HrErCasePartyOffense_offense_id_fkey" FOREIGN KEY ("offense_id") REFERENCES "HrErCaseTypeOfOffense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
