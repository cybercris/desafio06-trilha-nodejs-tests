import {MigrationInterface, QueryRunner} from "typeorm";

export class TransferStatement1635715296249 implements MigrationInterface {
    name = 'TransferStatement1635715296249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fin"."statements" DROP CONSTRAINT "statements"`);
        await queryRunner.query(`ALTER TABLE "fin"."statements" ADD "sender_id" uuid`);
        await queryRunner.query(`COMMENT ON COLUMN "fin"."users"."id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "fin"."users"."email" IS NULL`);
        await queryRunner.query(`ALTER TABLE "fin"."users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`COMMENT ON COLUMN "fin"."statements"."id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "fin"."statements" ADD CONSTRAINT "FK_85827f527e4dd79f678babefe1c" FOREIGN KEY ("user_id") REFERENCES "fin"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fin"."statements" ADD CONSTRAINT "FK_9991f1bfc6ad6237dd7a29b5ddc" FOREIGN KEY ("sender_id") REFERENCES "fin"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fin"."statements" DROP CONSTRAINT "FK_9991f1bfc6ad6237dd7a29b5ddc"`);
        await queryRunner.query(`ALTER TABLE "fin"."statements" DROP CONSTRAINT "FK_85827f527e4dd79f678babefe1c"`);
        await queryRunner.query(`COMMENT ON COLUMN "fin"."statements"."id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "fin"."users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`COMMENT ON COLUMN "fin"."users"."email" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "fin"."users"."id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "fin"."statements" DROP COLUMN "sender_id"`);
        await queryRunner.query(`ALTER TABLE "fin"."statements" ADD CONSTRAINT "statements" FOREIGN KEY ("user_id") REFERENCES "fin"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
