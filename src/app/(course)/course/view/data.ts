
export const courseData = {
  id: 'c1',
  title: 'Fullstack Mastery',
  chapters: [
    {
      id: 'ch1',
      title: 'Frontend Core',
      lessons: [
        {
          id: 'l1',
          title: 'React Hooks',
          questions: [
            {
              id: 'q1',
              type: 'mcq',
              text: 'Which hook is used for side effects?',
              options: ['useState', 'useEffect', 'useMemo', 'useRef'],
              correctAnswer: 1,
              solution:
                "useEffect is designed for side effects like data fetching, subscriptions, and manual DOM mutations."
            },
            {
              id: 'q2',
              type: 'numerical',
              text: 'How many times will useEffect run if dependency array is empty?',
              correctAnswer: 1,
              solution:
                "An empty dependency array makes the effect run once after the initial render."
            },
            {
              id: 'q3',
              type: 'subjective',
              text: 'Explain the difference between useMemo and useCallback.',
              solution:
                "useMemo memoizes a computed value, while useCallback memoizes a function reference to prevent unnecessary re-creations."
            }
          ]
        },
        {
          id: 'l2',
          title: 'State Management',
          questions: [
            {
              id: 'q4',
              type: 'mcq',
              text: 'Which problem does lifting state up solve?',
              options: [
                'Code splitting',
                'Shared state between components',
                'Memory leaks',
                'Improving bundle size'
              ],
              correctAnswer: 1,
              solution:
                "Lifting state up allows multiple components to share and stay in sync with the same state."
            },
            {
              id: 'q5',
              type: 'subjective',
              text: 'When would you choose Context API over Redux?',
              solution:
                "Context API is suitable for low-frequency global state like themes or auth, while Redux fits complex, high-frequency updates."
            }
          ]
        }
      ]
    },
    {
      id: 'ch2',
      title: 'Backend Fundamentals',
      lessons: [
        {
          id: 'l3',
          title: 'HTTP & REST',
          questions: [
            {
              id: 'q6',
              type: 'numerical',
              text: 'In standard HTTP, which port is used for HTTPS?',
              correctAnswer: 443,
              solution:
                "Port 443 is the default port for HTTPS traffic."
            },
            {
              id: 'q7',
              type: 'mcq',
              text: 'Which HTTP method is idempotent?',
              options: ['POST', 'PATCH', 'PUT', 'CONNECT'],
              correctAnswer: 2,
              solution:
                "PUT is idempotent because multiple identical requests result in the same state."
            },
            {
              id: 'q8',
              type: 'subjective',
              text: 'What does statelessness mean in REST APIs?',
              solution:
                "Statelessness means each request contains all information needed to process it, and the server stores no client session."
            }
          ]
        },
        {
          id: 'l4',
          title: 'Authentication',
          questions: [
            {
              id: 'q9',
              type: 'mcq',
              text: 'Which token format is commonly used in JWT?',
              options: ['XML', 'Binary', 'Base64URL', 'Hex'],
              correctAnswer: 2,
              solution:
                "JWTs are Base64URL encoded, making them safe for transport in HTTP headers."
            },
            {
              id: 'q10',
              type: 'subjective',
              text: 'Explain why storing JWTs in localStorage can be risky.',
              solution:
                "localStorage is vulnerable to XSS attacks, allowing attackers to steal tokens if malicious scripts execute."
            }
          ]
        }
      ]
    },
    {
      id: 'ch3',
      title: 'Databases & Performance',
      lessons: [
        {
          id: 'l5',
          title: 'SQL Basics',
          questions: [
            {
              id: 'q11',
              type: 'mcq',
              text: 'Which SQL clause is used to filter rows?',
              options: ['ORDER BY', 'GROUP BY', 'WHERE', 'HAVING'],
              correctAnswer: 2,
              solution:
                "WHERE filters rows before grouping or aggregation."
            },
            {
              id: 'q12',
              type: 'numerical',
              text: 'If a table has 1,000 rows and no WHERE clause, how many rows does SELECT * return?',
              correctAnswer: 1000,
              solution:
                "Without filters, SELECT * returns all rows in the table."
            }
          ]
        },
        {
          id: 'l6',
          title: 'Indexes & Optimization',
          questions: [
            {
              id: 'q13',
              type: 'subjective',
              text: 'What trade-offs come with adding database indexes?',
              solution:
                "Indexes speed up reads but slow down writes and consume additional storage."
            },
            {
              id: 'q14',
              type: 'mcq',
              text: 'Which data structure is commonly used for database indexes?',
              options: ['Linked List', 'Hash Map', 'B-Tree', 'Queue'],
              correctAnswer: 2,
              solution:
                "B-Trees balance read and write performance and are widely used in databases."
            }
          ]
        }
      ]
    }
  ]
};

