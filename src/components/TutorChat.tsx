import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage, Course } from "../types";
import { Send, Sparkles, MessageSquare, Bot, HelpCircle, ArrowRight, BookOpen } from "lucide-react";

interface TutorChatProps {
  currentCourse?: Course;
  courses: Course[];
}

export default function TutorChat({ currentCourse, courses }: TutorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I am your **LearnAI Study Partner**. 🚀

I'm ready to explain complex concepts, write code snippets, or quiz you on anything you are learning today. 

What can I help you master?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedPrompts = currentCourse?.id === "nn-intro" 
    ? [
        "Explain backpropagation clearly",
        "What does an activation function do?",
        "Show a PyTorch perceptron sample"
      ]
    : currentCourse?.id === "py-patterns"
    ? [
        "What are Python decorators?",
        "When should I use context managers?",
        "Explain lazy evaluation generators"
      ]
    : [
        "What is gradient descent?",
        "Explain Neural Network training",
        "How does Natural Language Processing work?"
      ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          currentCourse: currentCourse || null
        })
      });
      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            role: "assistant",
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
      } else {
        throw new Error(data.error || "No reply from AI");
      }
    } catch (err) {
      console.error(err);
      // fallback helpful advice in case of offline dev mode / network issue
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: `I've prepared standard study tips on that subject for you!
          
- Make sure to review **forward propagation matrices** and how weights are multiplied.
- Try coding a small binary classifier from scratch in PyTorch to lock in the logic.
- Don't hesitate to take a dynamic AI-generated quiz using our top panel to challenge your understanding!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl custom-shadow flex flex-col h-[520px] overflow-hidden">
      {/* Chat header */}
      <div className="p-4 bg-surface border-b border-outline-variant flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary-container text-on-primary-container p-2.5 rounded-xl text-white">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-label-md text-label-md font-bold text-on-surface">LearnAI Tutor</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-ping"></span>
              <span className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">
                {currentCourse ? `Helping with ${currentCourse.title}` : "AI Copilot Online"}
              </span>
            </div>
          </div>
        </div>

        {currentCourse && (
          <div className="hidden sm:flex items-center gap-1 bg-primary-fixed/30 text-primary-fixed-dim bg-opacity-30 border border-outline-variant py-1 px-2 rounded-lg text-[10px] font-bold text-primary">
            <BookOpen className="w-3.5 h-3.5" />
            Active Context
          </div>
        )}
      </div>

      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div key={m.id} className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
              {/* Avatar circle */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-sm ${
                isUser ? "bg-primary text-on-primary font-bold text-xs" : "bg-tertiary text-on-tertiary"
              }`}>
                {isUser ? (
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQz31mZ8-5DmE_aoRAiEf9iAsB7-FHPdRmkVT4zo7QdAUB-JHAX1eQKe6q0B3bPLxRsIbx5qGje894VPMssFCmh0rLtxV64iDymZ49E_nEKI7Ry_CoNNQvvY22_GRyaAxFzqxK5vbQcAFUOrb6kZRmkTeh22pEnPRRsc0OZvUywA79bBJfzTM9G7XlDHWc9qze-g8Hy9GXCVfwEgiahBYNob_BzjZ7vfYBJsDPkOEYj_sUScVzL9Ml"
                    alt="Alex"
                  />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div className="space-y-1">
                {/* Message speech bubble */}
                <div className={`p-3.5 rounded-2xl text-body-md leading-relaxed whitespace-pre-wrap shadow-sm border ${
                  isUser 
                    ? "bg-primary text-on-primary rounded-tr-none border-primary-container" 
                    : "bg-surface-container-low text-on-surface rounded-tl-none border-outline-variant"
                }`}>
                  {m.content}
                </div>
                <div className={`text-[9px] text-on-surface-variant font-medium px-1 ${isUser ? "text-right" : "text-left"}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested academic prompts list */}
      <div className="p-3 bg-surface border-t border-outline-variant space-y-1.5">
        <div className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-1">
          <HelpCircle className="w-3.5 h-3.5 text-primary" />
          <span>Quick Ask</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="bg-surface-container-lowest hover:bg-primary hover:text-white hover:border-primary active:scale-95 text-[11px] font-medium text-on-surface border border-outline-variant rounded-full py-1.5 px-3 whitespace-nowrap transition-all shrink-0 cursor-pointer shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-3 bg-surface-container-lowest border-t border-outline-variant flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={currentCourse ? `Ask about ${currentCourse.title}...` : "Ask a question about AI or Coding..."}
          className="flex-1 bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className={`p-2.5 rounded-xl transition-all ${
            !input.trim() || loading
              ? "bg-surface-container text-on-surface-variant cursor-not-allowed opacity-55"
              : "bg-primary hover:bg-primary-container text-on-primary shadow"
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
