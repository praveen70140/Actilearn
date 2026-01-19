import { InferSelectModel } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';

export const tagCategory = pgTable('tag-category', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  icon: text('icon'),
  label: text('label').unique().notNull(),
});

export type TagCategory = InferSelectModel<typeof tagCategory>;
