// Sample quiz data
const sampleQuizzes = [
    {
        id: 1,
        title: "General Knowledge",
        description: "Test your knowledge on various topics",
        category: "General",
        difficulty: "Easy",
        questions: [
            {
                id: 1,
                text: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correctAnswer: 2
            },
            {
                id: 2,
                text: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correctAnswer: 1
            },
            {
                id: 3,
                text: "What is the largest mammal in the world?",
                options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
                correctAnswer: 1
            },
            {
                id: 4,
                text: "Who painted the Mona Lisa?",
                options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
                correctAnswer: 2
            },
            {
                id: 5,
                text: "What is the chemical symbol for gold?",
                options: ["Go", "Gd", "Au", "Ag"],
                correctAnswer: 2
            }
        ]
    },
    {
        id: 2,
        title: "JavaScript Basics",
        description: "Test your JavaScript knowledge",
        category: "Programming",
        difficulty: "Medium",
        questions: [
            {
                id: 1,
                text: "Which keyword is used to declare a variable in JavaScript?",
                options: ["var", "let", "const", "All of the above"],
                correctAnswer: 3
            },
            {
                id: 2,
                text: "What does DOM stand for?",
                options: ["Document Object Model", "Data Object Model", "Digital Object Management", "Document Orientation Mode"],
                correctAnswer: 0
            },
            {
                id: 3,
                text: "Which method is used to add an element to the end of an array?",
                options: ["push()", "pop()", "shift()", "unshift()"],
                correctAnswer: 0
            },
            {
                id: 4,
                text: "What will typeof null return?",
                options: ["null", "undefined", "object", "number"],
                correctAnswer: 2
            },
            {
                id: 5,
                text: "Which operator is used for strict equality comparison?",
                options: ["==", "===", "=", "!="],
                correctAnswer: 1
            }
        ]
    },
    {
        id: 3,
        title: "World History",
        description: "Test your knowledge of world history",
        category: "History",
        difficulty: "Medium",
        questions: [
            {
                id: 1,
                text: "In which year did World War II end?",
                options: ["1944", "1945", "1946", "1947"],
                correctAnswer: 1
            },
            {
                id: 2,
                text: "Who was the first president of the United States?",
                options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
                correctAnswer: 1
            },
            {
                id: 3,
                text: "Which ancient civilization built the Machu Picchu?",
                options: ["Aztec", "Maya", "Inca", "Egyptian"],
                correctAnswer: 2
            },
            {
                id: 4,
                text: "When was the Berlin Wall demolished?",
                options: ["1987", "1988", "1989", "1990"],
                correctAnswer: 2
            },
            {
                id: 5,
                text: "Who discovered America?",
                options: ["Christopher Columbus", "Vasco da Gama", "Ferdinand Magellan", "James Cook"],
                correctAnswer: 0
            }
        ]
    }
];