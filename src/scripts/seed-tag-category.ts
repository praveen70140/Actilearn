/**
 * This script is used to seed the database with initial tag category data.
 * It connects to MongoDB, then 'upserts' a list of predefined tag categories,
 * which means it will update existing categories or insert new ones if they don't exist.
 */

import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local and .env files.
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

import connectDB from '@/lib/mongoose';
import TagCategory from '@/db/models/TagCategory';

// An array containing all the tag category data to be seeded.
const tagCategoriesToSeed = [
  {
    name: 'Web Development',
    label: 'Web Development',
    icon: '',
    tags: [
      { name: 'fullstack', label: 'Fullstack', icon: '' },
      { name: 'react', label: 'React', icon: '' },
      { name: 'typescript', label: 'TypeScript', icon: '' },
      { name: 'backend', label: 'Backend', icon: '' },
    ],
  },
  {
    name: 'Programming Languages',
    label: 'Programming Languages',
    icon: '',
    tags: [{ name: 'python', label: 'Python', icon: '' }],
  },
  {
    name: 'High School',
    label: 'High School',
    icon: '',
    tags: [
      { name: '11th', label: '11th Grade', icon: '' },
      { name: '12th', label: '12th Grade', icon: '' },
      { name: 'physics', label: 'Physics', icon: '' },
      { name: 'chemistry', label: 'Chemistry', icon: '' },
      { name: 'math', label: 'Math', icon: '' },
    ],
  },
];

/**
 * The main seed function that connects to the database and seeds the tag categories.
 */
async function seedTagCategories() {
  console.log('🌱 Starting tag category seed...');

  try {
    // Establish a connection to the MongoDB database.
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Iterate over the array of tag categories and seed each one.
    for (const categoryData of tagCategoriesToSeed) {
      // Use findOneAndUpdate with 'upsert' to either insert a new category or update an existing one based on the name.
      const result = await TagCategory.findOneAndUpdate(
        { name: categoryData.name },
        categoryData,
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      // Log a success message for each seeded category.
      console.log(`✅ Tag Category "${result.name}" seeded successfully!`);
    }
  } catch (error) {
    // Log any errors that occur during the seeding process and exit.
    console.error('❌ Error seeding tag categories:', error);
    process.exit(1);
  } finally {
    // Exit the process once seeding is complete.
    process.exit(0);
  }
}

// Execute the seed function.
seedTagCategories();
