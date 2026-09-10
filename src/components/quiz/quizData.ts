export type Difficulty = 'medium' | 'hard' | 'expert';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  difficulty: Difficulty;
  explanation: string;
  label?: string;
}

export const QUIZ_POOL_SIZE = 30;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which club did Manchester United beat in the 1999 Champions League final to complete the Treble?',
    options: ['Bayern Munich', 'Juventus', 'Barcelona', 'Real Madrid'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'United came from behind to beat Bayern Munich 2-1 at the Camp Nou, with goals from Teddy Sheringham and Ole Gunnar Solskjaer in the last 3 minutes of stoppage time.',
    label: 'Treble Talk',
  },
  {
    id: 2,
    question: 'Who scored a hat-trick as England beat Argentina 6-1 in the 1982 World Cup second round?',
    options: ['Gary Lineker', 'Kevin Keegan', 'Bobby Charlton', 'Geoff Hurst'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'Gary Lineker scored three of England\'s six goals in that famous 6-1 win in Barcelona, a record for an English player in a single World Cup match.',
    label: 'Three Kings',
  },
  {
    id: 3,
    question: 'Which nation won the 1998 World Cup final, and by how many goals?',
    options: ['France 3-0', 'Brazil 3-2', 'Italy 4-3', 'Germany 2-0'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'France beat Brazil 3-0 on home soil at the Stade de France, with Zinedine Zidane scoring two headers and Emmanuel Petit adding a third in the 90th minute.',
    label: 'Les Bleus',
  },
  {
    id: 4,
    question: 'Which team won the Champions League in 2012 by beating Bayern Munich on penalties at the Allianz Arena?',
    options: ['Chelsea', 'Manchester City', 'Bayern Munich', 'Barcelona'],
    answer: 0,
    difficulty: 'hard',
    explanation: 'Chelsea won 4-3 on penalties after a 1-1 draw, with Didier Drogba scoring the equaliser in the 88th minute and saving the final penalty as a 10-man side.',
    label: 'Blue Miracle',
  },
  {
    id: 5,
    question: 'Which player holds the record for the most goals in a single Premier League season?',
    options: ['Alan Shearer', 'Thierry Henry', 'Mohamed Salah', 'Erling Haaland'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'Alan Shearer scored 34 goals for Blackburn Rovers in the 1994-95 season, a record that still stands today.',
    label: 'Shearer\'s Record',
  },
  {
    id: 6,
    question: 'Which nation won the 2002 World Cup, beating Germany 2-0 in the final in Yokohama?',
    options: ['Brazil', 'Germany', 'Turkey', 'South Korea'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'Brazil won their fifth World Cup with a 2-0 victory, goals from Ronaldo (who scored both) after recovering from two serious knee injuries earlier in the tournament.',
    label: 'Ronaldo Returns',
  },
  {
    id: 7,
    question: 'Which club won the 1993 Champions League, beating AC Milan 1-0 in the final in Munich to become the first French winners?',
    options: ['Marseille', 'Paris Saint-Germain', 'Monaco', 'Lyon'],
    answer: 0,
    difficulty: 'hard',
    explanation: 'Olympique Marseille won 1-0 with a Basile Boli goal, becoming the first and only French club to win the Champions League under its current format.',
    label: 'First French',
  },
  {
    id: 8,
    question: 'Who scored the fastest goal in World Cup final history, in the 2002 final between Brazil and Germany?',
    options: ['Hakan Sukur', 'Ronaldo', 'Oliver Kahn', 'Claudio Lopez'],
    answer: 0,
    difficulty: 'expert',
    explanation: 'Hakan Sukur of Turkey scored in the 11th second of the 2002 third-place play-off, not the final. No one has scored in the final itself that early, making this a trick question.',
    label: 'Trick Ball',
  },
  {
    id: 9,
    question: 'Which team won the 1954 World Cup, beating the heavily favoured Hungary 3-2 in the "Miracle of Bern"?',
    options: ['West Germany', 'Hungary', 'Brazil', 'Uruguay'],
    answer: 0,
    difficulty: 'hard',
    explanation: 'West Germany beat the "Golden Squad" of Hungary 3-2 in Bern, with Helmut Rahn scoring the winning goal, in one of the greatest upsets in football history.',
    label: 'Miracle of Bern',
  },
  {
    id: 10,
    question: 'Which club did Manchester United beat in the 1968 European Cup final to become the first English club to win it?',
    options: ['Benfica', 'Real Madrid', 'Inter Milan', 'Ajax'],
    answer: 0,
    difficulty: 'hard',
    explanation: 'United beat Benfica 4-1 after extra time at Wembley, with goals from Bobby Charlton (two) and Brian Kidd (two), becoming the first English club to win the European Cup.',
    label: 'First English',
  },
  {
    id: 11,
    question: 'Which country won the 2010 World Cup, beating the Netherlands in the final in Johannesburg?',
    options: ['Spain', 'Germany', 'Brazil', 'Italy'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'Spain won their first World Cup with a 1-0 extra-time goal from Andres Iniesta, after a 0-0 draw and a red card for the Netherlands\' John Heitinga.',
    label: 'La Furia Roja',
  },
  {
    id: 12,
    question: 'Which team won the 2014 World Cup, beating Argentina 1-0 in the final in Rio de Janeiro?',
    options: ['Germany', 'Brazil', 'Italy', 'Netherlands'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'Germany won their fourth World Cup with a 1-0 victory, Mario Gotze scoring the only goal in the 113th minute of extra time.',
    label: 'Gotze Magic',
  },
  {
    id: 13,
    question: 'Which club did Barcelona beat 3-1 in the 2011 Champions League final at Wembley to win their fourth European Cup?',
    options: ['Manchester United', 'Chelsea', 'Arsenal', 'Liverpool'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'Barcelona beat Manchester United 3-1 with goals from Lionel Messi and Pedro, plus an own goal from Rafael da Silva, in a match widely regarded as one of the best ever played.',
    label: 'La Masia',
  },
  {
    id: 14,
    question: 'Who scored the winning goal for Manchester United in the 1999 Champions League final against Bayern Munich?',
    options: ['Ole Gunnar Solskjaer', 'Teddy Sheringham', 'David Beckham', 'Paul Scholes'],
    answer: 0,
    difficulty: 'hard',
    explanation: 'Ole Gunnar Solskjaer scored the winning goal in the 90th minute of stoppage time, coming off the bench to complete the dramatic comeback from 1-0 down.',
    label: 'Baby Faced Assassin',
  },
  {
    id: 15,
    question: 'Which nation won the 1966 World Cup, beating West Germany 4-2 in extra time at Wembley?',
    options: ['England', 'Brazil', 'Italy', 'Argentina'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'England won their only World Cup with a 4-2 victory, Geoff Hurst scoring a hat-trick including the controversial third goal that bounced off the crossbar.',
    label: 'It\'s Coming Home',
  },
  {
    id: 16,
    question: 'Which team won the 1994 World Cup final, beating Italy on penalties 3-2 after a 0-0 draw in Los Angeles?',
    options: ['Brazil', 'Italy', 'Germany', 'Argentina'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'Brazil won their fourth World Cup with a 3-2 penalty shootout win, with Dunga scoring the decisive penalty after Roberto Baggio missed for Italy.',
    label: '0-0 in LA',
  },
  {
    id: 17,
    question: 'Which club won the 2023 Champions League final, beating Inter Milan 1-0 in Istanbul?',
    options: ['Manchester City', 'Chelsea', 'Real Madrid', 'Liverpool'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'Manchester City won their first Champions League title under Pep Guardiola, with Rodri scoring the only goal in the 68th minute.',
    label: 'Treble Winners',
  },
  {
    id: 18,
    question: 'Which team won the 2022 World Cup, beating France on penalties in the final in Lusail?',
    options: ['Argentina', 'Brazil', 'Germany', 'Spain'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'Argentina won their third World Cup, beating France 4-2 on penalties after a 3-3 draw, with Lionel Messi scoring two goals and Kylian Mbappe scoring a hat-trick.',
    label: 'Messi\'s Moment',
  },
  {
    id: 19,
    question: 'Which club did Real Madrid beat 4-1 in the 2014 Champions League final to win their tenth European Cup (La Decima)?',
    options: ['Atletico Madrid', 'Chelsea', 'Bayern Munich', 'Juventus'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'Real Madrid beat their city rivals Atletico Madrid 4-1 in extra time in Lisbon, with Sergio Ramos equalising in the 90th minute and Gareth Bale, Marcelo, and Cristiano Ronaldo scoring in extra time.',
    label: 'La Decima',
  },
  {
    id: 20,
    question: 'Which player won the Ballon d\'Or in 1995, becoming the first African to win it?',
    options: ['George Weah', 'Didier Drogba', 'Samuel Eto\'o', 'Yaya Toure'],
    answer: 0,
    difficulty: 'hard',
    explanation: 'George Weah of Liberia won the Ballon d\'Or in 1995 after a stellar season with Paris Saint-Germain and AC Milan, becoming the first African and only Liberian to win the award.',
    label: 'King George',
  },
  {
    id: 21,
    question: 'Which club won the 2020 Champions League, beating Paris Saint-Germain 1-0 in the final in Lisbon?',
    options: ['Bayern Munich', 'Manchester City', 'Real Madrid', 'Juventus'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'Bayern Munich won their sixth Champions League title with a 1-0 victory, Kingsley Coman scoring the only goal against his former club.',
    label: 'Coman\'s Goal',
  },
  {
    id: 22,
    question: 'Which player scored a hat-trick as Barcelona beat Real Madrid 4-0 in the 2015 Clasico at the Bernabeu?',
    options: ['Neymar', 'Lionel Messi', 'Cristiano Ronaldo', 'Luis Suarez'],
    answer: 0,
    difficulty: 'hard',
    explanation: 'Neymar scored a hat-trick in that 4-0 win, with Messi also scoring, in a pivotal match in the 2014-15 La Liga season.',
    label: 'Neymar\'s Night',
  },
  {
    id: 23,
    question: 'Which club did Chelsea beat 2-1 in the 2021 Champions League final in Porto to win their second title?',
    options: ['Manchester City', 'Real Madrid', 'Barcelona', 'Bayern Munich'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'Chelsea beat Manchester City 2-1 with goals from Kai Havertz and Mason Mount, winning their second Champions League under Thomas Tuchel.',
    label: 'Blue Again',
  },
  {
    id: 24,
    question: 'Which team won the 2019 World Cup, beating the Netherlands 2-0 in the final in Lyon?',
    options: ['United States', 'Netherlands', 'Sweden', 'England'],
    answer: 0,
    difficulty: 'expert',
    explanation: 'The United States won the 2019 Women\'s World Cup, beating the Netherlands 2-0 with goals from Megan Rapinoe and Rose Lavelle.',
    label: 'USWNT',
  },
  {
    id: 25,
    question: 'Which club did Ajax beat in the 1995 Champions League final to win their fourth title in Amsterdam?',
    options: ['AC Milan', 'Barcelona', 'Juventus', 'Bayern Munich'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'Ajax beat AC Milan 1-0 in Vienna, with Patrick Kluivert scoring the only goal in the 85th minute, becoming the youngest goalscorer in a final.',
    label: 'Kluivert\'s Goal',
  },
  {
    id: 26,
    question: 'Which player holds the record for the most goals in UEFA Champions League history (excluding qualifiers)?',
    options: ['Cristiano Ronaldo', 'Lionel Messi', 'Robert Lewandowski', 'Karim Benzema'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'Cristiano Ronaldo holds the record with 140 goals in the Champions League proper, ahead of Lionel Messi with 129.',
    label: 'Ronaldo\'s Record',
  },
  {
    id: 27,
    question: 'Which club won the 2021 Copa America, beating Brazil 1-0 in the final in Rio de Janeiro?',
    options: ['Argentina', 'Uruguay', 'Chile', 'Colombia'],
    answer: 0,
    difficulty: 'hard',
    explanation: 'Argentina beat Brazil 1-0 with a goal from Angel Di Maria, winning their first Copa America in 28 years and Lionel Messi\'s first major international trophy.',
    label: 'Messi\'s First',
  },
  {
    id: 28,
    question: 'Which player scored 6 goals for Liverpool in a single Champions League match against Rangers in 2022?',
    options: ['Mohamed Salah', 'Cristiano Ronaldo', 'Robert Lewandowski', 'Erling Haaland'],
    answer: 0,
    difficulty: 'expert',
    explanation: 'Mohamed Salah scored 6 goals in 6 minutes and 12 seconds against Rangers in September 2022, the fastest hat-trick in Champions League history.',
    label: 'Salah\'s Six',
  },
  {
    id: 29,
    question: 'Which club did Manchester United beat 1-0 in the 2008 Champions League final in Moscow to win their third title?',
    options: ['Chelsea', 'Barcelona', 'Arsenal', 'Liverpool'],
    answer: 0,
    difficulty: 'medium',
    explanation: 'Manchester United beat Chelsea 1-0 after extra time, with Cristiano Ronaldo scoring the only goal, winning their third European Cup.',
    label: 'Moscow 2008',
  },
  {
    id: 30,
    question: 'Which club did Ajax beat 4-1 away at the Bernabeu in the 2019 Champions League round of 16, and who scored their first goal?',
    options: ['Hakim Ziyech', 'Dusan Tadic', 'Mathijs de Ligt', 'Frenkie de Jong'],
    answer: 0,
    difficulty: 'expert',
    explanation: 'Ajax beat Real Madrid 4-1 at the Bernabeu in February 2019. Hakim Ziyech opened the scoring in the 15th minute, followed by Dusan Tadic, before a late collapse from Real Madrid saw Ajax score two more.',
    label: 'Ajax in Madrid',
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickQuizQuestions(count: number): QuizQuestion[] {
  const pool = shuffle(QUIZ_QUESTIONS);
  return pool.slice(0, Math.min(count, QUIZ_POOL_SIZE)).map(q => {
    const indexed = q.options.map((opt, i) => ({ opt, i }));
    const shuffled = shuffle(indexed);
    const answer = shuffled.findIndex(s => s.i === q.answer);
    return {
      ...q,
      options: shuffled.map(s => s.opt),
      answer,
    };
  });
}

export interface ScoreClassification {
  title: string;
  emoji: string;
  message: string;
}

export function getScoreClassification(score: number, total: number): ScoreClassification {
  const pct = total > 0 ? score / total : 0;
  if (pct >= 1) return { title: 'GENERATIONAL BALL KNOWLEDGE', emoji: '🗿', message: 'You actually know ball. This is concerning.' };
  if (pct >= 0.8) return { title: 'CERTIFIED BALL KNOWER', emoji: '🧠', message: 'Solid knowledge. Not many people get this right.' };
  if (pct >= 0.6) return { title: 'DECENT BALL KNOWLEDGE', emoji: '⚽', message: 'You know your stuff. A few blind spots, but respect.' };
  if (pct >= 0.4) return { title: 'CASUAL ALERT', emoji: '😭', message: 'Let\'s not tell anyone you got this many wrong.' };
  if (pct >= 0.2) return { title: 'FRAUD WATCH', emoji: '🚨', message: 'You\'re out here looking like a fraud. Work on it.' };
  return { title: 'FOOTBALL TERRORIST', emoji: '💀', message: 'You do not know ball. At all. This is embarrassing.' };
}

export const quizRoasts: Record<number, string[]> = {
  0: [
    'A clean sweep of wrong. Iconic.',
    'You thought you knew ball. You knew nothing.',
    'The football gods are laughing at you.',
    'Five wrong. Zero dignity. Respect.',
  ],
  1: [
    'One out of five. That is a participation trophy level score.',
    'You got one right. Congratulations, you exist.',
    'A single correct answer. Your football journey continues.',
  ],
  2: [
    'Two out of five. Casual energy, honestly.',
    'You\'re hovering at the casual zone. Learn more.',
    'Half and half. Still not great, but not terrible.',
  ],
  3: [
    'Three out of five. Decent, but you know there is room.',
    'You know some ball. Respectable effort.',
    'Not bad. A few tough ones caught you out.',
  ],
  4: [
    'Four out of five. You know your football.',
    'One wrong. Almost perfect. Nice work.',
    'Certified ball knower territory. Well done.',
  ],
  5: [
    'Five out of five. You are the ball.',
    'Perfect score. Generational knowledge.',
    'You actually know ball. This is scary.',
  ],
};

export function getRandomRoast(score: number): string {
  const roasts = quizRoasts[score] || quizRoasts[0];
  return roasts[Math.floor(Math.random() * roasts.length)];
}

export function getPerformanceMessage(score: number, total: number): string {
  return getScoreClassification(score, total).message;
}