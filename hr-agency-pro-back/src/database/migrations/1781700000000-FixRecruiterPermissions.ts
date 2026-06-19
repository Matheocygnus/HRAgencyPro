import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixRecruiterPermissions1781700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "roles" SET "permissions" = '["dashboard","prospects","heroes","contracts","invoices","interviews","jobs","job-requests"]' WHERE "id" = 2`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "roles" SET "permissions" = '["interviews","prospects","dashboard","job-requests"]' WHERE "id" = 2`,
    );
  }
}
