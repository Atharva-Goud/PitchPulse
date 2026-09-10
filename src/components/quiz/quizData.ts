export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

/**
 * A fixed pool of 10 football trivia questions.
 *
 * The quiz randomly selects 5 unique questions per session. Keeping the
 * data in a plain module (no fetching, no backend) means the quiz is
 * self-contained and adds zero runtime dependencies.
 */
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which country has won the FIFA World Cup the most times?',
    options: ['Germany', 'Brazil', 'Argentina', 'Italy'],
    answer: 1,
    explanation: 'Brazil have won the FIFA World Cup five times, more than any other nation.',
  },
  {
    id: 2,
    question: 'Which club has won the most UEFA Champions League titles?',
    options: ['Barcelona', 'Bayern Munich', 'Real Madrid', 'AC Milan'],
    answer: 2,
    explanation: 'Real Madrid have won the European Cup/UEFA Champions League more times than any other club.',
  },
  {
    id: 3,
    question: "Who is known as 'The King of Football'?",
    options: ['Diego Maradona', 'Pele', 'Johan Cruyff', 'Zinedine Zidane'],
    answer: 1,
    explanation: "Pele is widely known by the nickname 'The King of Football'.",
  },
  {
    id: 4,
    question: 'How many players does one team have on the pitch at the start of a standard football match?',
    options: ['9', '10', '11', '12'],
    answer: 2,
    explanation: 'A football team starts with 11 players on the pitch, including the goalkeeper.',
  },
  {
    id: 5,
    question: 'Which country won the 2018 FIFA World Cup?',
    options: ['France', 'Croatia', 'Germany', 'Brazil'],
    answer: 0,
    explanation: 'France defeated Croatia 4-2 in the 2018 FIFA World Cup final.',
  },
  {
    id: 6,
    question: "Which club is famously known as 'The Red Devils'?",
    options: ['Liverpool', 'Manchester United', 'Arsenal', 'AC Milan'],
    answer: 1,
    explanation: 'Manchester United are commonly known as the Red Devils.',
  },
  {
    id: 7,
    question: 'Which player won the Golden Ball at the 2022 FIFA World Cup?',
    options: ['Kylian Mbappe', 'Luka Modric', 'Lionel Messi', 'Antoine Griezmann'],
    answer: 2,
    explanation: "Lionel Messi won the Golden Ball as the tournament's best player at the 2022 World Cup.",
  },
  {
    id: 8,
    question: 'Which club plays its home matches at Anfield?',
    options: ['Everton', 'Liverpool', 'Manchester City', 'Chelsea'],
    answer: 1,
    explanation: 'Anfield is the home stadium of Liverpool Football Club.',
  },
  {
    id: 9,
    question: 'Which competition is contested by the top clubs from European domestic leagues?',
    options: ['UEFA Europa League', 'UEFA Conference League', 'UEFA Champions League', 'UEFA Nations League'],
    answer: 2,
    explanation: "The UEFA Champions League is Europe's premier club competition.",
  },
  {
    id: 10,
    question: 'Which position is primarily responsible for preventing the opposition from scoring and is the only position allowed to handle the ball inside its own penalty area?',
    options: ['Defender', 'Midfielder', 'Forward', 'Goalkeeper'],
    answer: 3,
    explanation: 'The goalkeeper is responsible for defending the goal and may handle the ball within their own penalty area, subject to the Laws of the Game.',
  },
];

export const QUIZ_LENGTH = 5;

/** Pick `count` unique questions, optionally shuffling answer options. */
export function pickQuizQuestions(count: number, shuffleAnswers = true): QuizQuestion[] {
  const pool = [...quizQuestions];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const selected = pool.slice(0, count);

  if (!shuffleAnswers) return selected;

  return selected.map(q => {
    const indexed = q.options.map((text, idx) => ({ text, idx }));
    for (let i = indexed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
    }
    const newAnswer = indexed.findIndex(o => o.idx === q.answer);
    return { ...q, options: indexed.map(o => o.text), answer: newAnswer };
  });
}

export function getPerformanceMessage(score: number, total: number): string {
  const pct = (score / total) * 100;
  if (pct === 100) return 'Perfect!';
  if (pct >= 80) return 'Great job!';
  if (pct >= 60) return 'Solid knowledge';
  if (pct >= 40) return 'Not bad - keep going';
  return 'Give it another go';
}
