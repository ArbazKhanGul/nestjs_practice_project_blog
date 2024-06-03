import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostComment1717392966879 implements MigrationInterface {
    name = 'CreatePostComment1717392966879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "author_id" uuid NOT NULL, "title" character varying(100) NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_dd2add25eac93daefc93da9d387" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "author_id" character varying, "post_id" character varying NOT NULL, "parent_comment_id" uuid, "content" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "authorId" uuid, "postId" uuid, CONSTRAINT "PK_2e99e04b4a1b31de6f833c18ced" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD CONSTRAINT "FK_c3fc4a3a656aad74331acfcf2a9" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_comments" ADD CONSTRAINT "FK_2b93091c2f4d6c9cf7c9b32e29f" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_comments" ADD CONSTRAINT "FK_ac65d744abc05279aee0b290857" FOREIGN KEY ("postId") REFERENCES "blog_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_comments" ADD CONSTRAINT "FK_47e60da1f7aeb75961190bff75d" FOREIGN KEY ("parent_comment_id") REFERENCES "post_comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_comments" DROP CONSTRAINT "FK_47e60da1f7aeb75961190bff75d"`);
        await queryRunner.query(`ALTER TABLE "post_comments" DROP CONSTRAINT "FK_ac65d744abc05279aee0b290857"`);
        await queryRunner.query(`ALTER TABLE "post_comments" DROP CONSTRAINT "FK_2b93091c2f4d6c9cf7c9b32e29f"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP CONSTRAINT "FK_c3fc4a3a656aad74331acfcf2a9"`);
        await queryRunner.query(`DROP TABLE "post_comments"`);
        await queryRunner.query(`DROP TABLE "blog_posts"`);
    }

}
