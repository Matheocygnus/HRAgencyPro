import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClientIdToUsers1781570000000 implements MigrationInterface {
  name = 'AddClientIdToUsers1781570000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "client_id" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "client_id"`);
  }
}
