import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTransaction1600465591600
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.createTable(
      new Table(
        new Table({
          name: 'transactions',
          columns: [
            {
              name: 'id',
              type: 'varchar',
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'title',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'type',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'value',
              type: 'decimal',
              isNullable: false,
              precision: 10,
              scale: 2,
            },
            {
              name: 'category_id',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        }),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
  }
}
