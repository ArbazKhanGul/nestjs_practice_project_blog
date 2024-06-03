import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBlogPost1716882370225 implements MigrationInterface {
    name = 'CreateBlogPost1716882370225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "author_id" uuid, CONSTRAINT "PK_dd2add25eac93daefc93da9d387" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD CONSTRAINT "FK_c3fc4a3a656aad74331acfcf2a9" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP CONSTRAINT "FK_c3fc4a3a656aad74331acfcf2a9"`);
        await queryRunner.query(`DROP TABLE "blog_posts"`);
    }

}
