import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddJobApplicationFields1781311000000 implements MigrationInterface {
  name = 'AddJobApplicationFields1781311000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "job_applications" ADD COLUMN IF NOT EXISTS "country" character varying`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD COLUMN IF NOT EXISTS "whatsapp" character varying`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD COLUMN IF NOT EXISTS "call_number" character varying`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD COLUMN IF NOT EXISTS "pronoun" character varying`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD COLUMN IF NOT EXISTS "role" character varying`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD COLUMN IF NOT EXISTS "other_positions" character varying`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD COLUMN IF NOT EXISTS "heard_about" character varying`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD COLUMN IF NOT EXISTS "salary_agreement" boolean`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD COLUMN IF NOT EXISTS "voice_recording_url" character varying`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD COLUMN IF NOT EXISTS "english_level" character varying`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD COLUMN IF NOT EXISTS "seniority" character varying`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD COLUMN IF NOT EXISTS "portfolio" character varying`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD COLUMN IF NOT EXISTS "tools" text`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD COLUMN IF NOT EXISTS "other_tools" text`);
    await queryRunner.query(`ALTER TABLE "job_applications" ADD COLUMN IF NOT EXISTS "references" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "references"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "other_tools"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "tools"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "portfolio"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "seniority"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "english_level"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "voice_recording_url"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "salary_agreement"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "heard_about"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "other_positions"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "role"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "pronoun"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "call_number"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "whatsapp"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "country"`);
  }
}
