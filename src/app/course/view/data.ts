export const courseData = {
  id: 'c1',
  title: 'Fullstack Mastery',
  chapters: [{
    id: 'ch1',
    title: 'Chapter 1',
    lessons: [{
      id: 'l1',
      title: 'React Hooks',
      questions: [
        {
          id: 'q1',
          type: 'mcq',
          text: 'Which hook is used for side effects?',
          options: ['useState', 'useEffect', 'useMemo', 'useRef'],
          correctAnswer: 1,
          solution: "The 'useEffect' hook lets you perform side effects in function components. This includes data fetching, setting up a subscription, and manually changing the DOM in React components."
        },
        {
          id: 'q2',
          type: 'numerical',
          text: 'In standard HTTP, which port number is used for HTTPS?',
          correctAnswer: 443,
          solution: "Port 443 is the standard port for all secured HTTP traffic. Port 80 is used for unencrypted, standard HTTP."
        },
        {
          id: 'q3',
          type: 'subjective',
          text: 'Briefly explain why we use the dependency array in useEffect.',
          solution: "The dependency array tells React when to re-run the effect. If a value in the array changes between renders, the effect runs again. Leaving it empty [] means the effect runs only once after the initial render."
        }
      ]
    }]
  }]
};
