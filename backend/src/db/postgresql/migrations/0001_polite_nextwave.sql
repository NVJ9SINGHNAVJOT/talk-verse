ALTER TABLE "comment" ALTER COLUMN "comment_text" SET DATA TYPE varchar(200);--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "category" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "title" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "media_urls" SET DATA TYPE varchar(255)[];--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "media_urls" SET DEFAULT ARRAY[]::varchar[];--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "tags" SET DATA TYPE varchar(255)[];--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::varchar[];--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "content" SET DEFAULT ARRAY[]::varchar[];--> statement-breakpoint
ALTER TABLE "query" ALTER COLUMN "query_text" SET DATA TYPE varchar(450)[];--> statement-breakpoint
ALTER TABLE "story" ALTER COLUMN "story_url" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "ref_id" SET DATA TYPE char(24);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "first_name" SET DATA TYPE varchar(15);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "last_name" SET DATA TYPE varchar(15);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "user_name" SET DATA TYPE varchar(15);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "image_url" SET DATA TYPE varchar(255);