import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QuizQuestion, Course } from "../types";
import { HelpCircle, Sparkles, CheckCircle2, XCircle, ArrowRight, RefreshCw, PlusCircle, Trophy } from "lucide-react";

interface QuizGeneratorProps {
  courses: Course[];
  activeCourseId?: string;
  onQuizCompleted: (score: number) => void;
}

export default function QuizGenerator({ courses, activeCourseId, onQuizCompleted }: QuizGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(activeCourseId || (courses[0]?.id || ""));
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const loadingMessages = [
    "Contacting AI Learning Professor...",
    "Reviewing course guidelines and textbook resources...",
    "Formulating 5 challenging multi-choice questions...",
    "Composing detailed educational explanations...",
    "Perfecting grading rubrics..."
  ];

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopic = topic.trim() || courses.find(c => c.id === selectedCourse)?.title || "General Artificial Intelligence";
    
    setLoading(true);
    setLoadingStep(0);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setCorrectAnswersCount(0);
    setQuizFinished(false);

    // Simulate loading steps for engaging visual feedback
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      const response = await fetch("/api/gemini/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: finalTopic, courseId: selectedCourse })
      });
      const data = await response.json();
      if (data.quiz && Array.isArray(data.quiz)) {
        setQuestions(data.quiz);
      } else {
        throw new Error(data.error || "Failed to parse questions");
      }
    } catch (err) {
      console.error(err);
      // fallback in case of catastrophic network failures
      setQuestions([
        {
          question: `Which fundamental principle dictates modular design in ${finalTopic}?`,
          options: [
            "Encapsulation and clear separation of concerns",
            "Linear parameter dependencies",
            "Continuous server-side telemetry logging",
            "Manual memory pointers allocation"
          ],
          correctOptionIndex: 0,
          explanation: "Encapsulation restricts direct access to some of an object's components, which facilitates clean modularity and debugging."
        }
      ]);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleOptionClick = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    const correct = selectedOption === questions[currentIndex].correctOptionIndex;
    if (correct) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
      const calculatedScore = Math.round((correctAnswersCount / questions.length) * 100);
      onQuizCompleted(calculatedScore);
    }
  };

  const activeQuestion = questions[currentIndex];

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {/* QUIZ CONFIGURATION SCREEN */}
        {!loading && questions.length === 0 && !quizFinished && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 custom-shadow space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
              <div className="bg-primary-fixed text-primary p-2.5 rounded-xl">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">AI Quiz Generator</h3>
                <p className="font-label-md text-label-md text-on-surface-variant">Generate customized, interactive multiple-choice challenges</p>
              </div>
            </div>

            <form onSubmit={handleStartQuiz} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-label-md font-bold text-on-surface">Select Course Context</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3.5 text-body-md font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                >
                  <option value="">-- Custom Topic (No specific course) --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-label-md font-bold text-on-surface">Custom Topic Focus</label>
                  <span className="text-[11px] text-primary font-bold uppercase tracking-wider bg-primary-fixed/30 px-2 py-0.5 rounded">Optional</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Backpropagation, Python decorators, Vector space embeddings..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3.5 text-body-md font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md py-4 rounded-xl font-bold custom-shadow active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate Quiz Questions
              </button>
            </form>
          </motion.div>
        )}

        {/* LOADING SCREEN */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 custom-shadow flex flex-col items-center justify-center text-center space-y-6 min-h-[350px]"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary-fixed border-t-primary rounded-full animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md">
              <h4 className="font-body-lg text-body-lg font-bold text-on-surface">AI is composing your quiz...</h4>
              <p className="font-label-md text-label-md text-primary animate-pulse min-h-[40px] font-medium">
                {loadingMessages[loadingStep]}
              </p>
            </div>
          </motion.div>
        )}

        {/* ACTIVE QUIZ SCREEN */}
        {!loading && questions.length > 0 && !quizFinished && activeQuestion && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            {/* Status progress bar */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 custom-shadow flex justify-between items-center">
              <div className="flex-1 mr-4">
                <div className="flex justify-between items-center mb-1 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  <span>Question {currentIndex + 1} of {questions.length}</span>
                  <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% complete</span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-primary-fixed/30 text-primary-fixed-dim bg-opacity-30 border border-outline-variant rounded-lg py-1 px-2.5 font-mono text-xs font-bold text-primary">
                Score: {correctAnswersCount}/{questions.length}
              </div>
            </div>

            {/* Question card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 custom-shadow space-y-6">
              <h4 className="font-body-lg text-body-lg font-bold text-on-surface leading-snug">
                {activeQuestion.question}
              </h4>

              <div className="space-y-3">
                {activeQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  let optionStyle = "border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low hover:border-primary-fixed";
                  
                  if (isSubmitted) {
                    if (idx === activeQuestion.correctOptionIndex) {
                      optionStyle = "border-secondary-container bg-secondary-container bg-opacity-10 text-on-secondary-container border-2";
                    } else if (isSelected) {
                      optionStyle = "border-error bg-error-container bg-opacity-10 text-on-error-container border-2";
                    } else {
                      optionStyle = "border-outline-variant bg-surface-container-lowest opacity-60";
                    }
                  } else if (isSelected) {
                    optionStyle = "border-primary bg-primary-fixed/35 border-2 text-primary font-semibold";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isSubmitted}
                      onClick={() => handleOptionClick(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-body-md font-medium transition-all duration-200 active:scale-[0.99] flex items-center justify-between gap-3 ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {isSubmitted && idx === activeQuestion.correctOptionIndex && (
                        <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                      )}
                      {isSubmitted && isSelected && idx !== activeQuestion.correctOptionIndex && (
                        <XCircle className="w-5 h-5 text-error shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanations section */}
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border ${
                    selectedOption === activeQuestion.correctOptionIndex
                      ? "bg-secondary-fixed bg-opacity-15 border-secondary-fixed-dim text-on-secondary-fixed-variant"
                      : "bg-error-container bg-opacity-10 border-error-container text-on-error-container"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {selectedOption === activeQuestion.correctOptionIndex ? (
                      <Trophy className="w-5 h-5 text-secondary" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-error" />
                    )}
                    <span className="font-label-sm uppercase tracking-wider font-bold">
                      {selectedOption === activeQuestion.correctOptionIndex ? "Correct Answer!" : "Incorrect Answer"}
                    </span>
                  </div>
                  <p className="font-label-md text-label-md leading-relaxed">{activeQuestion.explanation}</p>
                </motion.div>
              )}

              {/* Submission actions */}
              <div className="pt-2">
                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className={`w-full font-label-md text-label-md py-3.5 rounded-xl font-bold transition-all ${
                      selectedOption === null
                        ? "bg-surface-container-low text-on-surface-variant opacity-50 cursor-not-allowed"
                        : "bg-primary hover:bg-primary-container text-on-primary custom-shadow active:scale-95"
                    }`}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-3.5 rounded-xl font-bold custom-shadow active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* COMPLETED/FINISHED SCREEN */}
        {quizFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 custom-shadow text-center space-y-6"
          >
            <div className="w-20 h-20 bg-secondary-fixed bg-opacity-25 rounded-full flex items-center justify-center mx-auto text-secondary">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Quiz Completed!</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">Outstanding job solidifying your knowledge</p>
            </div>

            <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-5 max-w-sm mx-auto flex items-center justify-around">
              <div>
                <div className="font-mono text-3xl font-bold text-primary">
                  {Math.round((correctAnswersCount / questions.length) * 100)}%
                </div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Grade</div>
              </div>
              <div className="w-px h-10 bg-outline-variant"></div>
              <div>
                <div className="font-mono text-3xl font-bold text-secondary">
                  +{correctAnswersCount * 15} XP
                </div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Experience</div>
              </div>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto italic">
              {correctAnswersCount === questions.length 
                ? "Flawless score! You have truly mastered this topic. Your study streak burns brighter!"
                : "Great attempt! Reviewing the wrong options will accelerate your comprehension even more. Keep learning!"}
            </p>

            <button
              onClick={() => {
                setQuestions([]);
                setTopic("");
                setQuizFinished(false);
              }}
              className="w-full max-w-xs bg-primary hover:bg-primary-container text-on-primary font-label-md py-3.5 rounded-xl font-bold custom-shadow active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              Take Another Quiz
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
