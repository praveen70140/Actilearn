
/**
 * This script is used to seed the database with initial course data.
 * It connects to MongoDB, then upserts a list of predefined courses,
 * which means it will update existing courses or insert new ones if they don't exist.
 */

import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local and .env files.
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

import connectDB from '@/lib/mongoose';
import Course from '@/db/models/Course';
import { seedCourseData } from '@/app/(course)/course/[id]/data';
import { seedCourseData2 } from '@/app/(course)/course/[id]/data2';

import { seedCourseData3 } from '@/app/(course)/course/[id]/data3';

// An array containing all the course data to be seeded.
const coursesToSeed = [seedCourseData, seedCourseData2, seedCourseData3];

/**
 * The main seed function that connects to the database and seeds the courses.
 */
async function seed() {
  console.log('🌱 Starting seed...');

  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    for (const courseData of coursesToSeed) {
      const courseToInsert = {
        ...courseData,
        slug: courseData.slug,
        isPrivate: false,
        creator: 'system',
      };

      const result = await Course.findOneAndUpdate(
        { slug: courseData.slug },
        courseToInsert,
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      console.log(`✅ Course "${result.name}" seeded successfully!`);
      console.log(`🆔 ID (Slug): ${result.slug}`);
    }
  } catch (error) {
    console.error('❌ Error seeding course:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Execute the seed function.
seed();

