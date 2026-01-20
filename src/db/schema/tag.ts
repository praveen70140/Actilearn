import { InferSelectModel } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { tagCategory } from './tag-categories';

export const tag = pgTable('tag', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  label: text('label').notNull(),
  icon: text('icon'),
  category: text('category').references(() => tagCategory.id, {
    onDelete: 'set null',
  }),
});

export type Tag = InferSelectModel<typeof tag>;
