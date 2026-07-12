import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;
const API_KEY = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({
    apiKey: API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  console.log("Successfully initialized Google GenAI client.");
} else {
  console.warn(
    "WARNING: GEMINI_API_KEY is missing. LearnAI will operate in rich educational-demo mode with local simulated intelligent responses."
  );
}

// Custom courses data for fallback and quick loading
const INITIAL_COURSES = [
  {
    id: "nn-intro",
    title: "Introduction to Neural Networks",
    category: "Foundations of AI",
    progress: 65,
    lessonsCount: 18,
    completedLessons: 12,
    description: "Learn about perceptrons, multi-layer architectures, backpropagation, and fundamental building blocks of deep neural models.",
    lessons: [
      { id: "nn-1", title: "What is a Neural Network?", completed: true, content: "Neural networks are computational models inspired by biological brain networks. They consist of layers of interconnected nodes (neurons) that process inputs to predict outputs." },
      { id: "nn-2", title: "Perceptrons and Activation Functions", completed: true, content: "Perceptrons are the simplest form of neural networks. Activation functions like ReLU, Sigmoid, and Tanh introduce non-linearity, allowing the network to learn complex patterns." },
      { id: "nn-3", title: "Forward Propagation explained", completed: true, content: "Forward propagation is the process where input data travels through the neural network layers, multiplied by weights and passed through activations, to produce an output prediction." },
      { id: "nn-4", title: "Understanding Loss Functions", completed: true, content: "Loss functions measure the difference between a model's prediction and the actual ground truth. Common examples include Mean Squared Error (MSE) and Cross-Entropy Loss." },
      { id: "nn-5", title: "Gradient Descent & Backpropagation", completed: false, content: "Backpropagation calculates the gradients of the loss function with respect to the weights using the chain rule. Gradient descent then updates these weights to minimize overall loss." },
      { id: "nn-6", title: "Building your first PyTorch Perceptron", completed: false, content: "In this hand-on module, we code a binary classifier perceptron in PyTorch from scratch, visualizing decision boundaries and learning curves step by step." }
    ]
  },
  {
    id: "py-patterns",
    title: "Advanced Python Patterns",
    category: "Software Engineering",
    progress: 30,
    lessonsCount: 12,
    completedLessons: 4,
    description: "Master decorators, context managers, generators, metaclasses, and functional programming patterns in clean, modern Python.",
    lessons: [
      { id: "py-1", title: "Mastering Decorators", completed: true, content: "Decorators are a powerful way to modify or extend the behavior of functions or classes without permanently changing their source code. They wrap target functions." },
      { id: "py-2", title: "Context Managers & 'with' statement", completed: true, content: "Context managers automate resource allocation and release. Standard pattern implements __enter__ and __exit__ methods or uses contextlib generators." },
      { id: "py-3", title: "Generators and Lazy Evaluation", completed: false, content: "Generators return an iterator using the 'yield' keyword. This facilitates lazy evaluation, enabling memory-efficient traversal of massive datasets or infinite streams." },
      { id: "py-4", title: "Metaclasses & Class Creators", completed: false, content: "Metaclasses are 'classes of classes' that define how classes behave and instantiate. They can enforce interface invariants or auto-register classes at runtime." }
    ]
  },
  {
    id: "nlp-basics",
    title: "Natural Language Processing",
    category: "AI Recommended",
    progress: 0,
    lessonsCount: 10,
    completedLessons: 0,
    description: "Dive deep into TF-IDF, Word Embeddings, Recurrent Networks, Attention mechanisms, and LLMs for textual comprehension.",
    lessons: [
      { id: "nlp-1", title: "Tokenization & Text Preprocessing", completed: false, content: "Tokenization breaks continuous raw text into clean linguistic chunks (tokens). Additional steps include lemmatization, stopword removal, and case normalization." },
      { id: "nlp-2", title: "Word Vectors (Word2Vec, GloVe)", completed: false, content: "Word embeddings represent text tokens as high-dimensional vectors, mapping semantic similarities as proximity coordinates in space." },
      { id: "nlp-3", title: "Understanding the Attention Mechanism", completed: false, content: "Attention mechanisms allow models to focus dynamically on different segments of a text query, weighting relevance instead of compressing whole sentences into static state vectors." }
    ]
  }
];

// Helper to provide realistic rich fallback quizzes
const LOCAL_MOCK_QUIZZES: Record<string, any[]> = {
  "nn-intro": [
    {
      question: "Which activation function is most commonly used inside hidden layers of deep neural networks to prevent vanishing gradients?",
      options: ["Sigmoid", "ReLU (Rectified Linear Unit)", "Tanh", "Step Function"],
      correctOptionIndex: 1,
      explanation: "ReLU outputs x if x > 0, otherwise 0. Its constant gradient of 1 for positive inputs dramatically mitigates vanishing gradients, speeding up training."
    },
    {
      question: "What is the main objective of backpropagation in neural network training?",
      options: [
        "To normalize input training features",
        "To make forward inferences on validation batches",
        "To calculate the partial derivatives of the loss function with respect to weights",
        "To shuffle data samples to prevent overfitting"
      ],
      correctOptionIndex: 2,
      explanation: "Backpropagation uses the calculus chain rule to compute gradients of the loss function relative to parameters, guiding gradient updates."
    }
  ],
  "py-patterns": [
    {
      question: "What does the 'yield' keyword do inside a Python function?",
      options: [
        "It terminates function execution and returns a list",
        "It pauses function execution, returning a value, and creates a generator iterator",
        "It creates a multithreaded background lock for safety",
        "It imports an external library dynamically into the local scope"
      ],
      correctOptionIndex: 1,
      explanation: "The 'yield' keyword transforms a standard function into a generator, producing values lazily on demand while preserving state between iterations."
    }
  ]
};

// 1. API: Get Courses
app.get("/api/courses", (req, res) => {
  res.json({ courses: INITIAL_COURSES });
});

// 2. API: Generate Dynamic Quiz using Gemini
app.post("/api/gemini/quiz", async (req, res) => {
  const { topic, courseId } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  // If no AI client, or it fails, fallback to realistic pre-generated quiz
  if (!ai) {
    console.log("Using rich simulated quiz for offline development mode.");
    const fallbackQuiz = LOCAL_MOCK_QUIZZES[courseId || ""] || [
      {
        question: `What is the core principle behind ${topic}?`,
        options: [
          "Optimizing data processing throughput and modular efficiency",
          "Establishing persistent transactional checkpoints",
          "Automating hyperparameter scheduling dynamically",
          "Encapsulating procedural functions into static structures"
        ],
        correctOptionIndex: 0,
        explanation: `This is the primary operational cornerstone of ${topic}, guiding modular structures and design decisions.`
      },
      {
        question: `Which of the following is a key advantage of studying ${topic}?`,
        options: [
          "Eliminating the need for system memory buffers",
          "Enabling smarter data-driven pattern matching and automation",
          "Preventing code complexity from growing linearly",
          "Restricting network bandwidth usage"
        ],
        correctOptionIndex: 1,
        explanation: `Studying ${topic} expands analytical frameworks, leading to high-quality architectures and predictive automation.`
      }
    ];
    return res.json({ quiz: fallbackQuiz });
  }

  try {
    const prompt = `Generate a set of exactly 4 unique multiple-choice questions for an educational quiz about: "${topic}".
    The target student is an eager developer learning AI and system design.
    Provide varied, highly technical, educational questions. Make sure the explanation is friendly, clear, and explains *why* the correct answer is right.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite computer science professor and AI researcher. Your goal is to produce engaging, challenging, and clear quiz questions with full explanations.",
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of multiple-choice quiz questions",
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "The quiz question. Must be highly clear, accurate, and challenging." },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 4 options for the student to choose from."
              },
              correctOptionIndex: { type: Type.INTEGER, description: "The 0-based index of the correct option (0, 1, 2, or 3)." },
              explanation: { type: Type.STRING, description: "Engaging explanation of why the answer is correct." }
            },
            required: ["question", "options", "correctOptionIndex", "explanation"]
          }
        }
      }
    });

    const parsedText = response.text ? response.text.trim() : "[]";
    const quiz = JSON.parse(parsedText);
    res.json({ quiz });
  } catch (error: any) {
    console.error("Gemini quiz generation error:", error);
    res.status(500).json({ error: "Failed to generate quiz", details: error.message });
  }
});

// 3. API: Chat with AI Learning Assistant
app.post("/api/gemini/chat", async (req, res) => {
  const { messages, currentCourse } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  if (!ai) {
    // Simulated chat tutor fallback
    const lastUserMessage = messages[messages.length - 1]?.content || "Hello";
    let simulatedReply = `As your offline study partner, I suggest we look closer at this topic! It links perfectly to our ongoing course.`;
    
    if (lastUserMessage.toLowerCase().includes("perceptron")) {
      simulatedReply = `A perceptron is the fundamental neuron element! It computes a weighted sum of inputs, adds a bias, and passes it to an activation function. In our 'Introduction to Neural Networks' course, we will implement this with PyTorch in lesson 6!`;
    } else if (lastUserMessage.toLowerCase().includes("python") || lastUserMessage.toLowerCase().includes("decorator")) {
      simulatedReply = `Python decorators are incredibly handy wrappers! They use the '@' syntax and allow you to inject logger or timing statistics around any target function. Try checking out our 'Advanced Python Patterns' module.`;
    } else if (lastUserMessage.toLowerCase().includes("quiz") || lastUserMessage.toLowerCase().includes("test")) {
      simulatedReply = `Quizzes are a fantastic way to solidify memory! Try selecting one of the courses above or type a custom topic in the AI recommended field to generate an interactive challenge.`;
    }

    return res.json({
      reply: simulatedReply,
      suggestedTopics: ["Tell me about Backpropagation", "Show me a Python Decorator example", "What is Gradient Descent?"]
    });
  }

  try {
    // Map messages format to Gemini SDK standard
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const lastMessageText = messages[messages.length - 1].content;

    const courseContext = currentCourse 
      ? `The student is currently active in the course: "${currentCourse.title}" (${currentCourse.category}).`
      : "The student is exploring AI topics.";

    const systemInstruction = `You are "LearnAI Tutor", a highly supportive, knowledgeable, and engaging AI study assistant.
    ${courseContext}
    Provide conversational, structured, and easy-to-understand educational explanations. Use markdown bullet points and code block examples where relevant.
    Suggest 2-3 short, relevant follow-up questions at the very end of your response, formatted clearly as suggestions. Keep answers concise to prevent cognitive fatigue.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [...history, { role: "user", parts: [{ text: lastMessageText }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || "I was unable to process that. Let's try another approach!";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: "Failed to communicate with AI", details: error.message });
  }
});

// 4. API: Generate Dynamic Learning Path / Recommendations
app.post("/api/gemini/recommend", async (req, res) => {
  const { completedCourses, interests } = req.body;

  if (!ai) {
    // Rich fallback recommendation
    return res.json({
      recommendations: [
        {
          title: "Natural Language Processing (NLP)",
          reason: "Since you completed 12 lessons of foundational math and showed keen interest in text patterns, this connects Word Vectors directly with neural modeling.",
          difficulty: "Intermediate",
          estimatedHours: "8 hours",
          chaptersCount: 5
        },
        {
          title: "Introduction to Computer Vision",
          reason: "Building on neural networks, computer vision unlocks image parsing, CNNs, and object detection with PyTorch.",
          difficulty: "Intermediate",
          estimatedHours: "10 hours",
          chaptersCount: 6
        }
      ]
    });
  }

  try {
    const interestString = interests ? interests.join(", ") : "AI, Software Engineering";
    const prompt = `Based on the student's learning interests ("${interestString}") and completed topics, generate exactly 2 highly appealing personalized course recommendations.
    Explain precisely why this fits their learning path.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an academic advisor for computer science. Recommend courses with detailed, inspiring rationale in JSON format.",
        temperature: 0.85,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "Personalized list of course recommendations",
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Name of the recommended course" },
              reason: { type: Type.STRING, description: "Compelling explanation linking it to their interests" },
              difficulty: { type: Type.STRING, description: "Beginner, Intermediate, or Advanced" },
              estimatedHours: { type: Type.STRING, description: "Estimated completion time, e.g., '12 hours'" },
              chaptersCount: { type: Type.INTEGER, description: "Number of standard chapters" }
            },
            required: ["title", "reason", "difficulty", "estimatedHours", "chaptersCount"]
          }
        }
      }
    });

    const recommendations = JSON.parse(response.text || "[]");
    res.json({ recommendations });
  } catch (error: any) {
    console.error("Gemini recommendation error:", error);
    res.status(500).json({ error: "Failed to generate recommendations", details: error.message });
  }
});

// Serve frontend build static files & configure development server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Integrated Vite development server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production build files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[LearnAI] Development server running on http://localhost:${PORT}`);
  });
}

startServer();
