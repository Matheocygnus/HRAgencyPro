import { MigrationInterface, QueryRunner } from 'typeorm';

export class Baseline1700000000001 implements MigrationInterface {
  name = 'Baseline1700000000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create refresh_tokens table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        token_hash VARCHAR NOT NULL,
        user_id INTEGER NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        revoked BOOLEAN NOT NULL DEFAULT false,
        replaced_by_token_hash VARCHAR,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    // 2. FK refresh_tokens.user_id → users.id
    await queryRunner.query(`
      ALTER TABLE refresh_tokens
        ADD CONSTRAINT fk_refresh_tokens_user_id
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    `);

    // 3. FK constraints for relational columns
    await queryRunner.query(`
      ALTER TABLE companies
        ADD CONSTRAINT fk_companies_client_id
        FOREIGN KEY (client_id) REFERENCES clients(id)
    `);

    await queryRunner.query(`
      ALTER TABLE heroes
        ADD CONSTRAINT fk_heroes_prospect_id
        FOREIGN KEY (prospect_id) REFERENCES prospects(id)
    `);

    await queryRunner.query(`
      ALTER TABLE heroes
        ADD CONSTRAINT fk_heroes_contract_id
        FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE heroes
        ADD CONSTRAINT fk_heroes_client_id
        FOREIGN KEY (client_id) REFERENCES clients(id)
    `);

    await queryRunner.query(`
      ALTER TABLE heroes
        ADD CONSTRAINT fk_heroes_company_id
        FOREIGN KEY (company_id) REFERENCES companies(id)
    `);

    await queryRunner.query(`
      ALTER TABLE contracts
        ADD CONSTRAINT fk_contracts_hero_id
        FOREIGN KEY (hero_id) REFERENCES heroes(id)
    `);

    await queryRunner.query(`
      ALTER TABLE contracts
        ADD CONSTRAINT fk_contracts_client_id
        FOREIGN KEY (client_id) REFERENCES clients(id)
    `);

    await queryRunner.query(`
      ALTER TABLE contracts
        ADD CONSTRAINT fk_contracts_company_id
        FOREIGN KEY (company_id) REFERENCES companies(id)
    `);

    await queryRunner.query(`
      ALTER TABLE invoices
        ADD CONSTRAINT fk_invoices_contract_id
        FOREIGN KEY (contract_id) REFERENCES contracts(id)
    `);

    await queryRunner.query(`
      ALTER TABLE invoices
        ADD CONSTRAINT fk_invoices_hero_id
        FOREIGN KEY (hero_id) REFERENCES heroes(id)
    `);

    await queryRunner.query(`
      ALTER TABLE invoices
        ADD CONSTRAINT fk_invoices_client_id
        FOREIGN KEY (client_id) REFERENCES clients(id)
    `);

    await queryRunner.query(`
      ALTER TABLE invoices
        ADD CONSTRAINT fk_invoices_company_id
        FOREIGN KEY (company_id) REFERENCES companies(id)
    `);

    await queryRunner.query(`
      ALTER TABLE interviews
        ADD CONSTRAINT fk_interviews_prospect_id
        FOREIGN KEY (prospect_id) REFERENCES prospects(id)
    `);

    await queryRunner.query(`
      ALTER TABLE job_applications
        ADD CONSTRAINT fk_job_applications_job_opening_id
        FOREIGN KEY (job_opening_id) REFERENCES job_openings(id)
    `);

    await queryRunner.query(`
      ALTER TABLE job_requests
        ADD CONSTRAINT fk_job_requests_client_id
        FOREIGN KEY (client_id) REFERENCES clients(id)
    `);

    await queryRunner.query(`
      ALTER TABLE job_requests
        ADD CONSTRAINT fk_job_requests_company_id
        FOREIGN KEY (company_id) REFERENCES companies(id)
    `);

    await queryRunner.query(`
      ALTER TABLE job_openings
        ADD CONSTRAINT fk_job_openings_client_id
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE job_openings
        ADD CONSTRAINT fk_job_openings_company_id
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
    `);

    // 4. Add role_id column to users
    await queryRunner.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id INTEGER
    `);

    // 5. Populate role_id from existing role column (case-insensitive to handle inconsistencies)
    await queryRunner.query(`
      UPDATE users u SET role_id = r.id FROM roles r WHERE LOWER(r.name) = LOWER(u.role)
    `);

    // 6. Verify no unmatched roles
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM users WHERE role_id IS NULL) THEN
          RAISE EXCEPTION 'Baseline migration failed: users with unmatched role values found';
        END IF;
      END $$
    `);

    // 7. Set NOT NULL on role_id
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN role_id SET NOT NULL
    `);

    // 8. Add FK constraint
    await queryRunner.query(`
      ALTER TABLE users
        ADD CONSTRAINT fk_users_role_id
        FOREIGN KEY (role_id) REFERENCES roles(id)
    `);

    // 9. Drop old role column
    await queryRunner.query(`
      ALTER TABLE users DROP COLUMN IF EXISTS role
    `);

    // 10. Drop session table if exists
    await queryRunner.query(`DROP TABLE IF EXISTS session`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS session (sid VARCHAR PRIMARY KEY, sess JSON NOT NULL, expire TIMESTAMP NOT NULL)`);

    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR`);
    await queryRunner.query(`UPDATE users u SET role = r.name FROM roles r WHERE r.id = u.role_id`);
    await queryRunner.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_role_id`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS role_id`);

    const fks = [
      'job_openings.fk_job_openings_company_id',
      'job_openings.fk_job_openings_client_id',
      'job_requests.fk_job_requests_company_id',
      'job_requests.fk_job_requests_client_id',
      'job_applications.fk_job_applications_job_opening_id',
      'interviews.fk_interviews_prospect_id',
      'invoices.fk_invoices_company_id',
      'invoices.fk_invoices_client_id',
      'invoices.fk_invoices_hero_id',
      'invoices.fk_invoices_contract_id',
      'contracts.fk_contracts_company_id',
      'contracts.fk_contracts_client_id',
      'contracts.fk_contracts_hero_id',
      'heroes.fk_heroes_company_id',
      'heroes.fk_heroes_client_id',
      'heroes.fk_heroes_contract_id',
      'heroes.fk_heroes_prospect_id',
      'companies.fk_companies_client_id',
      'refresh_tokens.fk_refresh_tokens_user_id',
    ];

    for (const fk of fks) {
      const [table, constraint] = fk.split('.');
      await queryRunner.query(
        `ALTER TABLE ${table} DROP CONSTRAINT IF EXISTS ${constraint}`,
      );
    }

    await queryRunner.query(`DROP TABLE IF EXISTS refresh_tokens`);
  }
}
