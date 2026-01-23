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
          theory: `
# Mastering React Hooks
Hooks allow you to use state and other React features without writing a class. They provide a more direct API to the React concepts you already know.

### The Component Lifecycle
Understanding when hooks fire is critical for performance and bug prevention.

![React Lifecycle Diagram](test.png)

### Common Hooks
1. **useState**: For local state management.
2. **useEffect**: For side effects (API calls, subscriptions).
3. **useContext**: For consuming context without nesting.

\`\`\`javascript
const [count, setCount] = useState(0);

useEffect(() => {
  console.log("Component mounted");
}, []);
\`\`\`
          `,
          questions: [
            {
              id: 'q1',
              type: 'mcq',
              text: 'Which hook is used for side effects?',
              options: ['useState', 'useEffect', 'useMemo', 'useRef'],
              correctAnswer: 1,
              solution: "useEffect is designed for side effects like data fetching, subscriptions, and manual DOM mutations."
            },
            {
              id: 'q2',
              type: 'numerical',
              text: 'How many times will useEffect run if dependency array is empty?',
              correctAnswer: 1,
              solution: "An empty dependency array makes the effect run once after the initial render."
            },
            {
              id: 'q3',
              type: 'subjective',
              text: 'Explain the difference between useMemo and useCallback.',
              solution: "useMemo memoizes a computed value, while useCallback memoizes a function reference to prevent unnecessary re-creations."
            }
          ]
        },
        {
          id: 'l2',
          title: 'State Management',
          theory: `
# State Management Strategies
As applications grow, managing state across multiple components becomes challenging.

### Lifting State Up
The simplest way to share state is to move it to the closest common ancestor. 

### Context API
For global settings like **Theme** or **Auth**, the Context API avoids "prop drilling."

> **Tip:** Don't put high-frequency updates in Context, as it can trigger re-renders across the entire tree.
          `,
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
              solution: "Lifting state up allows multiple components to share and stay in sync with the same state."
            },
            {
              id: 'q5',
              type: 'subjective',
              text: 'When would you choose Context API over Redux?',
              solution: "Context API is suitable for low-frequency global state like themes or auth, while Redux fits complex, high-frequency updates."
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
          theory: `
# HTTP & RESTful Design
REST (Representational State Transfer) is an architectural style for providing standards between computer systems on the web.

### Key HTTP Methods
- **GET**: Retrieve data.
- **POST**: Create data.
- **PUT**: Replace data (Idempotent).
- **PATCH**: Partially update data.
- **DELETE**: Remove data.

### Status Codes
- **200**: OK
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **404**: Not Found
- **500**: Internal Server Error
          `,
          questions: [
            {
              id: 'q6',
              type: 'numerical',
              text: 'In standard HTTP, which port is used for HTTPS?',
              correctAnswer: 443,
              solution: "Port 443 is the default port for HTTPS traffic."
            },
            {
              id: 'q7',
              type: 'mcq',
              text: 'Which HTTP method is idempotent?',
              options: ['POST', 'PATCH', 'PUT', 'CONNECT'],
              correctAnswer: 2,
              solution: "PUT is idempotent because multiple identical requests result in the same state."
            },
            {
              id: 'q8',
              type: 'subjective',
              text: 'What does statelessness mean in REST APIs?',
              solution: "Statelessness means each request contains all information needed to process it, and the server stores no client session."
            }
          ]
        },
        {
          id: 'l4',
          title: 'Authentication',
          theory: `
# Modern Authentication
Securing your application involves verifying user identity (Authentication) and checking permissions (Authorization).

### JSON Web Tokens (JWT)
JWTs consist of three parts separated by dots:
1. **Header** (Algorithm & Token Type)
2. **Payload** (Data/Claims)
3. **Signature** (To verify the sender)

\`\`\`bash
# Anatomy of a JWT
header.payload.signature
\`\`\`
          `,
          questions: [
            {
              id: 'q9',
              type: 'mcq',
              text: 'Which token format is commonly used in JWT?',
              options: ['XML', 'Binary', 'Base64URL', 'Hex'],
              correctAnswer: 2,
              solution: "JWTs are Base64URL encoded, making them safe for transport in HTTP headers."
            },
            {
              id: 'q10',
              type: 'subjective',
              text: 'Explain why storing JWTs in localStorage can be risky.',
              solution: "localStorage is vulnerable to XSS attacks, allowing attackers to steal tokens if malicious scripts execute."
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
          theory: `
# SQL & Relational Databases
Relational databases store data in tables with predefined schemas.

### The SELECT Statement
You use SQL (Structured Query Language) to interact with databases like PostgreSQL or MySQL.

\`\`\`sql
SELECT name, email 
FROM users 
WHERE active = true 
ORDER BY created_at DESC;
\`\`\`
          `,
          questions: [
            {
              id: 'q11',
              type: 'mcq',
              text: 'Which SQL clause is used to filter rows?',
              options: ['ORDER BY', 'GROUP BY', 'WHERE', 'HAVING'],
              correctAnswer: 2,
              solution: "WHERE filters rows before grouping or aggregation."
            },
            {
              id: 'q12',
              type: 'numerical',
              text: 'If a table has 1,000 rows and no WHERE clause, how many rows does SELECT * return?',
              correctAnswer: 1000,
              solution: "Without filters, SELECT * returns all rows in the table."
            }
          ]
        },
        {
          id: 'l6',
          title: 'Indexes & Optimization',
          theory: `
# Performance Tuning
When queries become slow, indexes are the first line of defense.

### How Indexes Work
Think of an index like a library's card catalog. Instead of searching every shelf (Table Scan), the database looks at the index (B-Tree) to find the exact location of the data.

### Trade-offs
- **Pros**: Faster Reads.
- **Cons**: Slower Writes, more disk space.
          `,
          questions: [
            {
              id: 'q13',
              type: 'subjective',
              text: 'What trade-offs come with adding database indexes?',
              solution: "Indexes speed up reads but slow down writes and consume additional storage."
            },
            {
              id: 'q14',
              type: 'mcq',
              text: 'Which data structure is commonly used for database indexes?',
              options: ['Linked List', 'Hash Map', 'B-Tree', 'Queue'],
              correctAnswer: 2,
              solution: "B-Trees balance read and write performance and are widely used in databases."
            }
          ]
        }
      ]
    }
  ]
};
