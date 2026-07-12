import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Course, Lesson } from "../types";
import { ArrowLeft, BookOpen, CheckCircle, Clock, Award, Sparkles, MessageSquare, Play, HelpCircle } from "lucide-react";

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onCompleteLesson: (lessonId: string) => void;
  onOpenChat: () => void;
  onOpenQuiz: () => void;
}

export default function CourseDetail({ course, onBack, onCompleteLesson, onOpenChat, onOpenQuiz }: CourseDetailProps) {
  const [activeLessonId, setActiveLessonId] = useState<string>(
    course.lessons.find((l) => !l.completed)?.id || course.lessons[0]?.id || ""
  );

  const activeLesson = course.lessons.find((l) => l.id === activeLessonId);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header section with back button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 bg-surface-container-lowest hover:bg-surface-container rounded-full border border-outline-variant active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <div>
          <span className="text-[10px] text-primary font-bold uppercase tracking-wider bg-primary-fixed/30 py-0.5 px-2 rounded">
            {course.category}
          </span>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface leading-tight mt-1">
            {course.title}
          </h2>
        </div>
      </div>

      {/* Main split dashboard view */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side: Lessons List */}
        <div className="md:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 custom-shadow space-y-4">
          <div className="flex justify-between items-center border-b border-outline-variant pb-3">
            <h3 className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Syllabus Units
            </h3>
            <span className="text-xs text-on-surface-variant font-bold">
              {course.completedLessons}/{course.lessonsCount} Done
            </span>
          </div>

          <div className="space-y-2.5 max-h-[350px] overflow-y-auto no-scrollbar">
            {course.lessons.map((lesson, idx) => {
              const isActive = lesson.id === activeLessonId;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                    isActive
                      ? "bg-primary border-primary text-white shadow-md font-bold scale-[1.01]"
                      : "bg-surface border-outline-variant text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs shrink-0 ${
                    lesson.completed
                      ? isActive 
                        ? "bg-white text-primary" 
                        : "bg-secondary text-white"
                      : isActive 
                        ? "bg-white text-primary" 
                        : "bg-surface-container-high text-on-surface-variant"
                  }`}>
                    {lesson.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className="text-body-md truncate">{lesson.title}</span>
                </button>
              );
            })}
          </div>

          {/* Quick study metrics summary */}
          <div className="pt-2 flex gap-2">
            <button
              onClick={onOpenChat}
              className="flex-1 bg-primary-fixed bg-opacity-35 hover:bg-primary-fixed-dim/45 border border-outline-variant text-primary font-label-md text-xs py-2.5 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              Ask AI Partner
            </button>
            <button
              onClick={onOpenQuiz}
              className="flex-1 bg-secondary-container bg-opacity-25 hover:bg-secondary-container/40 border border-outline-variant text-secondary font-label-md text-xs py-2.5 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              Take Quiz
            </button>
          </div>
        </div>

        {/* Right side: Lesson Content Viewer */}
        <div className="md:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {activeLesson ? (
              <motion.div
                key={activeLesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 custom-shadow space-y-5"
              >
                <div className="flex justify-between items-start gap-4 border-b border-outline-variant pb-4">
                  <div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface leading-tight">
                      {activeLesson.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-on-surface-variant font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        15 mins study
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-secondary" />
                        +50 XP reward
                      </span>
                    </div>
                  </div>

                  {activeLesson.completed && (
                    <span className="bg-secondary text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full flex items-center gap-1 shrink-0 shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  )}
                </div>

                {/* Simulated high-quality markdown educational course materials */}
                <div className="prose prose-slate max-w-none text-body-md text-on-surface-variant leading-relaxed space-y-4">
                  <p>{activeLesson.content}</p>
                  
                  <div className="p-4 bg-surface border border-outline-variant rounded-xl flex items-start gap-3 mt-4">
                    <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-label-md font-bold text-on-surface">AI Study Insight</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5">
                        This unit is fundamental for answering the final quiz questions! Click "Complete Lesson" to save your progress, then open the Tutor Chat to ask clarifying questions about activation formulas.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lesson Complete Call-to-action button */}
                <div className="border-t border-outline-variant pt-4 flex justify-between items-center gap-4">
                  <div className="text-xs text-on-surface-variant">
                    Ready for the next unit? Mark this completed to advance.
                  </div>
                  {!activeLesson.completed ? (
                    <button
                      onClick={() => onCompleteLesson(activeLesson.id)}
                      className="bg-primary hover:bg-primary-container text-on-primary font-label-md py-3 px-6 rounded-xl font-bold custom-shadow active:scale-95 transition-all flex items-center gap-2 shrink-0"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete Lesson
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-surface-container border border-outline-variant text-on-surface-variant/60 font-label-md py-3 px-6 rounded-xl font-bold shrink-0 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      Completed!
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center text-on-surface-variant/60">
                Please select a unit from the left syllabus panel to begin study.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
