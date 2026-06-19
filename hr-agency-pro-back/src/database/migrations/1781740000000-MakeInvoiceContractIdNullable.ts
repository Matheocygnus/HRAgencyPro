import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeInvoiceContractIdNullable1781740000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "contract_id" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "invoices" SET "contract_id" = 0 WHERE "contract_id" IS NULL`);
    await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "contract_id" SET NOT NULL`);
  }
}
