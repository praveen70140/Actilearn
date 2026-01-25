import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

import connectDB from '@/lib/mongoose';
import Course from '@/db/models/Course';
import { seedCourseData } from '@/app/(course)/course/[id]/data';
import { QuestionTypes } from '@/lib/enum/question-types';

async function seed() {
  console.log('🌱 Starting seed...');

  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Transform courseData to match Schema requirements
    // - id -> slug
    // - add isPrivate (default false)
    // - add creator (placeholder)
    // - ensure question body types are correct

    const courseToInsert = {
      ...seedCourseData,
      slug: seedCourseData.slug,
      isPrivate: false,
      creator: 'system',
      // Mongoose might not like 'id' field if it's not in schema, so we rely on spread to include known fields
      // and explicitly set the ones that map differently.
      // However, spread will include 'id', which isn't in schema. Mongoose strict mode (default true) will ignore it.
    };

    // Upsert the course based on slug (id)
    const result = await Course.findOneAndUpdate(
      { slug: seedCourseData.slug },
      courseToInsert,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    console.log(`✅ Course "${result.name}" seeded successfully!`);
    console.log(`🆔 ID (Slug): ${result.slug}`);
  } catch (error) {
    console.error('❌ Error seeding course:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
