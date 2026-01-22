// data.ts
export const courseData = {
  id: 'course-1',
  title: 'Web Development Fundamentals',
  chapters: [
    {
      id: 'chapter-1',
      title: '1. HTML Foundations',
      lessons: [
        {
          id: 'lesson-1-1',
          title: 'What is HTML?',
          theory: `
**HTML** (HyperText Markup Language) is the skeleton of the web.

It defines structure, not behavior or styling.
          
### Core Concepts
* **Elements**: The building blocks of pages.
* **Tags**: Used to mark the start and end of elements.
* **Attributes**: Provide additional information about elements.

\`\`\`html
<!DOCTYPE html>
<html>
  <body>My Page</body>
</html>
\`\`\`
          `,
          questions: [
            { id: 'q-1-1-1', text: 'What does HTML stand for?' },
            { id: 'q-1-1-2', text: 'Is HTML a programming language?' },
            { id: 'q-1-1-3', text: 'Which tag is used for the largest heading?' },
          ],
        },
        {
          id: 'lesson-1-2',
          title: 'Basic Tags',
          theory: `
HTML provides a set of predefined tags.

Common tags include:

\`\`\`html
<div> <p> <span>
\`\`\`
          `,
          questions: [
            { id: 'q-1-2-1', text: 'What tag is used to create a paragraph?' },
            { id: 'q-1-2-2', text: 'Which tag is non-semantic by default?' },
          ],
        },
      ],
    },
    {
      id: 'chapter-2',
      title: '2. CSS Basics',
      lessons: [
        {
          id: 'lesson-2-1',
          title: 'What is CSS?',
          theory: `
**CSS** controls how HTML looks.

It handles layout, colors, spacing, and animations.
          `,
          questions: [
            { id: 'q-2-1-1', text: 'What does CSS stand for?' },
            { id: 'q-2-1-3', text: 'Which property controls text color?' },
          ],
        },
      ],
    },
  ],
};
