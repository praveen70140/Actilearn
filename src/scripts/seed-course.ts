// 1. Load dotenv FIRST before any other imports
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

// 2. Now import the rest of your app
import connectDB from '../lib/mongoose';
import Course from '../db/models/Course';
import { seedCourseData } from '../app/(course)/course/view/data';

async function seed() {
  console.log('🌱 Starting seed process...');

  try {
    // Check if URI exists here just in case
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is still not defined after loading dotenv.');
    }

    await connectDB();
    console.log('✅ Connected to MongoDB');

    // seedCourseData is an array of 11 courses from your data.ts
    for (const course of seedCourseData) {
      console.log(`📖 Processing: ${course.name}...`);

      const courseToInsert = {
        ...course,
        slug: course.id,
        isPrivate: false,
        creator: 'system',
      };

      const result = await Course.findOneAndUpdate(
        { slug: course.id },
        courseToInsert,
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      console.log(`   ✅ Seeded: ${result.name}`);
    }

    console.log('🏁 All courses seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    process.exit(1);
  }
}

seed();
