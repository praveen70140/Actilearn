CREATE TABLE "attempt" (
	"id" text PRIMARY KEY NOT NULL,
	"course-id" text NOT NULL,
	"student-id" text NOT NULL,
	"start-time" timestamp DEFAULT now() NOT NULL,
	"end-time" timestamp,
	"chapter-index" integer NOT NULL,
	"lesson-index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chapter" (
	"id" text PRIMARY KEY NOT NULL,
	"course-id" text NOT NULL,
	"name" text,
	"index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course-tag" (
	"id" text PRIMARY KEY NOT NULL,
	"course-id" text,
	"tag-id" text
);
--> statement-breakpoint
CREATE TABLE "course" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"creator" text,
	"created" timestamp DEFAULT now(),
	CONSTRAINT "course_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "lesson" (
	"id" text PRIMARY KEY NOT NULL,
	"chapter-id" text NOT NULL,
	"name" text,
	"index" integer NOT NULL,
	"theory" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question" (
	"id" text PRIMARY KEY NOT NULL,
	"lesson-id" text NOT NULL,
	"question-type" smallint NOT NULL,
	"question-text" text NOT NULL,
	"arguments" text NOT NULL,
	"answer" text NOT NULL,
	"solution" text NOT NULL,
	"index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "response" (
	"id" text PRIMARY KEY NOT NULL,
	"question-id" text NOT NULL,
	"student-id" text NOT NULL,
	"response-text" text,
	"evaluation" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag-category" (
	"id" text PRIMARY KEY NOT NULL,
	"icon" text,
	"label" text NOT NULL,
	CONSTRAINT "tag-category_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"icon" text,
	"category" text
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" smallint DEFAULT -1 NOT NULL;--> statement-breakpoint
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_course-id_course_id_fk" FOREIGN KEY ("course-id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_student-id_user_id_fk" FOREIGN KEY ("student-id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter" ADD CONSTRAINT "chapter_course-id_course_id_fk" FOREIGN KEY ("course-id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course-tag" ADD CONSTRAINT "course-tag_course-id_course_id_fk" FOREIGN KEY ("course-id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course-tag" ADD CONSTRAINT "course-tag_tag-id_tag_id_fk" FOREIGN KEY ("tag-id") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_creator_user_id_fk" FOREIGN KEY ("creator") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_chapter-id_chapter_id_fk" FOREIGN KEY ("chapter-id") REFERENCES "public"."chapter"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question" ADD CONSTRAINT "question_lesson-id_lesson_id_fk" FOREIGN KEY ("lesson-id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "response" ADD CONSTRAINT "response_question-id_question_id_fk" FOREIGN KEY ("question-id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "response" ADD CONSTRAINT "response_student-id_user_id_fk" FOREIGN KEY ("student-id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag" ADD CONSTRAINT "tag_category_tag-category_id_fk" FOREIGN KEY ("category") REFERENCES "public"."tag-category"("id") ON DELETE set null ON UPDATE no action;