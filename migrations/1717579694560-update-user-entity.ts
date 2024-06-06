import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserEntity1717579694560 implements MigrationInterface {
    name = 'UpdateUserEntity1717579694560'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profileImage"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "profileImage" character varying NOT NULL`);
    }

}
