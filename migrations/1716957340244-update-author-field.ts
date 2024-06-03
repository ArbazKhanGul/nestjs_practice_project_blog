import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAuthorField1716957340244 implements MigrationInterface {
    name = 'UpdateAuthorField1716957340244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP CONSTRAINT "FK_c3fc4a3a656aad74331acfcf2a9"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD "authorIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP COLUMN "author_id"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD "author_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD CONSTRAINT "FK_7d129eab9a94aad5aa835662056" FOREIGN KEY ("authorIdId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP CONSTRAINT "FK_7d129eab9a94aad5aa835662056"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP COLUMN "author_id"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD "author_id" uuid`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP COLUMN "authorIdId"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD CONSTRAINT "FK_c3fc4a3a656aad74331acfcf2a9" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
