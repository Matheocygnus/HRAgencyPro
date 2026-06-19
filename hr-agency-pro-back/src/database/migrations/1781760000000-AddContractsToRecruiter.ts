import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContractsToRecruiter1781760000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "roles" SET "permissions" = '["dashboard","prospects","heroes:read","interviews","invoices","companies","jobs","job-requests","contracts"]' WHERE "id" = 2`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "roles" SET "permissions" = '["dashboard","prospects","heroes:read","interviews","invoices","companies","jobs","job-requests"]' WHERE "id" = 2`,
    );
  }
}
