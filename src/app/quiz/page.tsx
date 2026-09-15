import FootballQuiz from '@/components/quiz/FootballQuiz';
import { Trophy } from 'lucide-react';

export default function QuizPage() {
  return (
    <div className="min-h-screen">
      <div className="container-page section-spacing">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 mb-4">
              <Trophy className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold text-white">PitchPulse Quiz</h1>
            <p className="text-[var(--text-secondary)] mt-3">
              Test your football knowledge with 5 questions from our pool.
            </p>
          </div>
          <FootballQuiz />
        </div>
      </div>
    </div>
  );
}