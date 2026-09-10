'use client';

import { useState } from 'react';
import { Trophy, ChevronRight, RotateCcw, Play } from 'lucide-react';
import { QuizQuestion, pickQuizQuestions, getPerformanceMessage } from '@/components/quiz/quizData';

const TOTAL = 5;

interface FootballQuizProps {
  className?: string;
}

export default function FootballQuiz({ className = '' }: FootballQuizProps) {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const startQuiz = () => {
    setQuestions(pickQuizQuestions(TOTAL));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setStarted(true);
  };

  const handleAnswer = (index: number) => {
    if (selected !== null) return; // locked after first selection
    setSelected(index);
    if (index === questions[current].answer) {
      setScore(s => s + 1);
    }
  };

  const next = () => {
    if (current < TOTAL - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const retry = () => {
    setStarted(false);
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const q = questions[current];
  const isCorrect = selected === q?.answer;
  const pct = Math.round((score / TOTAL) * 100);

  return (
    <section
      className={`mx-auto max-w-2xl rounded-xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 ${className}`}
    >
      {!started ? (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Football Quiz</h2>
          <p className="mt-2 text-sm text-slate-400">
            Test your football knowledge with 5 questions from our pool.
          </p>
          <button
            onClick={startQuiz}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            <Play className="h-4 w-4" />
            Start Quiz
          </button>
        </div>
      ) : finished ? (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Your Score</h2>
          <div className="mt-6">
            <div className="text-5xl font-bold text-white">
              {score}<span className="text-2xl text-slate-500"> / {TOTAL}</span>
            </div>
            <div className="mt-2 text-emerald-400 font-medium">{pct}%</div>
          </div>
          <p className="mt-4 text-slate-400">{getPerformanceMessage(score, TOTAL)}</p>
          <button
            onClick={retry}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-medium rounded-lg transition-colors border border-white/20"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-6">
            <span>Question {current + 1} of {TOTAL}</span>
            <span>Score {score}</span>
          </div>

          <h3 className="text-lg font-semibold text-white mb-5">{q.question}</h3>

          <div className="space-y-3">
            {q.options.map((option, index) => {
              const isThisCorrect = index === q.answer;
              const isThisSelected = index === selected;
              let stateClass = 'border-white/10 bg-slate-950/40 hover:border-white/25 hover:bg-white/5';

              if (selected !== null) {
                if (isThisCorrect) {
                  stateClass = 'border-emerald-500/60 bg-emerald-500/10';
                } else if (isThisSelected) {
                  stateClass = 'border-red-500/60 bg-red-500/10';
                } else {
                  stateClass = 'border-white/5 bg-slate-950/20 opacity-60';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selected !== null}
                  className={`w-full text-left rounded-lg border px-4 py-3 text-sm font-medium text-white transition-colors disabled:cursor-default ${stateClass}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-white/20 text-xs text-slate-300">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className={`mt-5 rounded-lg border px-4 py-3 text-sm ${isCorrect ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-200' : 'border-red-500/30 bg-red-500/5 text-red-200'}`}>
              <span className="font-semibold">{isCorrect ? 'Correct!' : 'Incorrect.'}</span>{' '}
              {q.explanation}
            </div>
          )}

          {selected !== null && (
            <div className="mt-5 flex justify-end">
              <button
                onClick={next}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
              >
                {current === TOTAL - 1 ? 'See Results' : 'Next Question'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
