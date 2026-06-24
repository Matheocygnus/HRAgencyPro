import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLengthMonthsToContracts1781780000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contracts" ADD COLUMN IF NOT EXISTS "length_months" integer`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contracts" DROP COLUMN IF EXISTS "length_months"`,
    );
  }
}
