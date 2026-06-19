import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateJobRequestFields1781621073126 implements MigrationInterface {
  name = 'UpdateJobRequestFields1781621073126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "location"`);
    await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "salary"`);
    await queryRunner.query(`ALTER TABLE "job_requests" ADD "open_positions" integer NOT NULL DEFAULT 1`);
    await queryRunner.query(`ALTER TABLE "job_requests" ADD "start_date" date`);
    await queryRunner.query(`ALTER TABLE "job_requests" ADD "nice_to_have_skills" text`);
    await queryRunner.query(`ALTER TABLE "job_requests" ADD "tools" text`);
    await queryRunner.query(`ALTER TABLE "job_requests" ADD "working_hours" character varying`);
    await queryRunner.query(`ALTER TABLE "job_requests" ADD "timezone" character varying`);
    await queryRunner.query(`ALTER TABLE "job_requests" ADD "reports_to" text`);
    await queryRunner.query(`ALTER TABLE "job_requests" ADD "languages" text`);
    await queryRunner.query(`ALTER TABLE "job_requests" ADD "seniority" character varying`);
    await queryRunner.query(`ALTER TABLE "job_requests" ADD "requires_proficiency_test" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "job_requests" ADD "interview_questions" text`);
    await queryRunner.query(`ALTER TABLE "job_requests" ADD "testing_requirements" text`);
    await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "description" TYPE text USING description::text`);
    await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "requirements" TYPE text USING requirements::text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "requirements" TYPE character varying`);
    await queryRunner.query(`ALTER TABLE "job_requests" ALTER COLUMN "description" TYPE character varying`);
    await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "testing_requirements"`);
    await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "interview_questions"`);
    await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "requires_proficiency_test"`);
    await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "seniority"`);
    await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "languages"`);
    await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "reports_to"`);
    await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "timezone"`);
    await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "working_hours"`);
    await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "tools"`);
    await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "nice_to_have_skills"`);
    await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "start_date"`);
    await queryRunner.query(`ALTER TABLE "job_requests" DROP COLUMN "open_positions"`);
    await queryRunner.query(`ALTER TABLE "job_requests" ADD "salary" double precision`);
    await queryRunner.query(`ALTER TABLE "job_requests" ADD "location" character varying NOT NULL DEFAULT ''`);
  }
}
