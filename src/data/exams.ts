export type ExamId =
  | 'SAT'
  | 'IELTS'
  | 'TOEFL'
  | 'JEE'
  | 'NEET'
  | 'GRE'
  | 'CUET'
  | 'ACT';

export interface ExamInfo {
  id: ExamId;
  name: string;
  short: string;
  full: string;
  region: string;
  accent: 'pink' | 'cyan' | 'lime' | 'purple';
  tagline: string;
  eligibility: string[];
  pattern: { section: string; details: string }[];
  official: { label: string; url: string }[];
  resources: { label: string; url: string; kind: 'official' | 'video' | 'article' }[];
}

const U = (label: string, url: string) => ({ label, url });

export const EXAMS: ExamInfo[] = [
  {
    id: 'SAT',
    name: 'SAT',
    short: 'SAT',
    full: 'Scholastic Assessment Test',
    region: 'USA / Global',
    accent: 'pink',
    tagline: 'College Board’s fully digital, multi-stage adaptive test for undergraduate admissions.',
    eligibility: [
      'Used for undergraduate college admissions; open to international students worldwide',
      'Taken through the Bluebook app on a personal device or a test-center computer',
      'Scores remain valid for 5 years; wrong answers have no penalty',
      'India registration fee: about $130.98 (approximately ₹12,625)',
      'Test centers are available across 160+ centers in 40+ Indian cities',
    ],
    pattern: [
      { section: 'Reading & Writing', details: '64 min total in two 32-min modules; 54 multiple-choice questions using short passages.' },
      { section: 'Math', details: '70 min total in two 35-min modules; 44 questions including multiple-choice and student-produced responses.' },
      { section: 'Calculator', details: 'Calculator allowed throughout Math, including the built-in Desmos calculator.' },
      { section: 'Total format', details: 'About 2h 14min, plus a 10-min break; fully digital and multi-stage adaptive.' },
      { section: 'Scoring', details: '400–1600 total: Reading and Writing 200–800, Math 200–800.' },
      { section: '2026 dates', details: 'November 7, 2026 — registration closed; late registration ended October 27. December 5, 2026 — registration deadline November 20; late deadline November 24.' },
    ],
    official: [
      U('College Board (Official)', 'https://satsuite.collegeboard.org/sat'),
      U('Bluebook Digital App', 'https://satsuite.collegeboard.org/sat/digital-sat/taking-the-test/bluebook'),
      U('Khan Academy Official Prep', 'https://www.khanacademy.org/sat'),
    ],
    resources: [
      { ...U('Khan Academy SAT (free)', 'https://www.khanacademy.org/sat'), kind: 'official' },
      { ...U('CrackSAT practice tests', 'https://cracksat.net'), kind: 'article' },
      { ...U('Scalar Physics SAT Math', 'https://www.youtube.com/results?search_query=sat+math+review'), kind: 'video' },
    ],
  },
  {
    id: 'IELTS',
    name: 'IELTS',
    short: 'IELTS',
    full: 'International English Language Testing System',
    region: 'UK / Australia / Global',
    accent: 'cyan',
    tagline: 'English proficiency for study, work and migration.',
    eligibility: [
      'Open to anyone aged 16+ (younger with consent)',
      'No educational prerequisites',
      'Two versions: Academic (study) and General Training (work/migration)',
    ],
    pattern: [
      { section: 'Listening', details: '40 min, 4 sections, 40 questions — recordings played once.' },
      { section: 'Reading', details: '60 min, 3 passages, 40 questions (Academic) or 3 sections (GT).' },
      { section: 'Writing', details: '60 min — Task 1 (150w) + Task 2 (250w essay).' },
      { section: 'Speaking', details: '11–14 min face-to-face interview, 3 parts.' },
      { section: 'Score', details: '0–9 band; most unis require 6.0–7.5.' },
    ],
    official: [
      U('British Council IELTS', 'https://www.britishcouncil.in/exam/ielts'),
      U('IDP IELTS', 'https://www.ieltsidpindia.com'),
      U('Cambridge English', 'https://www.cambridgeenglish.org/exams-and-tests/ielts/'),
    ],
    resources: [
      { ...U('IELTS Liz free lessons', 'https://ieltsliz.com'), kind: 'article' },
      { ...U('British Council prep', 'https://takeielts.britishcouncil.org/prepare'), kind: 'official' },
      { ...U('IELTS Listening practice', 'https://www.youtube.com/results?search_query=ielts+listening+practice'), kind: 'video' },
    ],
  },
  {
    id: 'TOEFL',
    name: 'TOEFL',
    short: 'TOEFL',
    full: 'Test of English as a Foreign Language',
    region: 'USA / Global',
    accent: 'lime',
    tagline: 'English proficiency favored by US universities.',
    eligibility: [
      'No age or education requirement',
      'Mostly taken for admission to English-speaking universities',
      'Offered as TOEFL iBT (home/test center) and Essentials',
    ],
    pattern: [
      { section: 'Reading', details: '35 min, 20 questions — 2 academic passages.' },
      { section: 'Listening', details: '36 min, 28 questions — lectures and conversations.' },
      { section: 'Speaking', details: '16 min, 4 tasks recorded via mic.' },
      { section: 'Writing', details: '29 min — 1 integrated task + 1 academic discussion.' },
      { section: 'Score', details: '0–120; common target 90–105.' },
    ],
    official: [
      U('ETS Official TOEFL', 'https://www.ets.org/toefl'),
      U('TOEFL iBT test prep', 'https://www.ets.org/toefl/test-takers/ibt/prepare.html'),
      U('Official practice tests', 'https://www.ets.org/toefl/test-takers/ibt/prepare/practice-tests.html'),
    ],
    resources: [
      { ...U('Magoosh TOEFL blog', 'https://magoosh.com/toefl'), kind: 'article' },
      { ...U('ETS free prep', 'https://www.ets.org/toefl/test-takers/ibt/prepare.html'), kind: 'official' },
      { ...U('TOEFL Speaking samples', 'https://www.youtube.com/results?search_query=toefl+speaking+samples'), kind: 'video' },
    ],
  },
  {
    id: 'JEE',
    name: 'JEE',
    short: 'JEE',
    full: 'Joint Entrance Examination (Main + Advanced)',
    region: 'India',
    accent: 'purple',
    tagline: 'Engineering entrance for India’s top IITs and NITs.',
    eligibility: [
      'Class 12 / equivalent with Physics, Chemistry, Maths',
      'No upper age limit (3 attempts for JEE Advanced)',
      'Minimum 75% in Class 12 (65% for SC/ST) for top colleges',
    ],
    pattern: [
      { section: 'JEE Main', details: '2 papers — Paper 1 for B.E./B.Tech (75 questions, 300 marks, 3h), Paper 2 for B.Arch.' },
      { section: 'Subjects', details: 'Physics, Chemistry, Mathematics — MCQs + numerical.' },
      { section: 'JEE Advanced', details: 'Two 3h papers, MCQ + numerical, for IIT admission.' },
    ],
    official: [
      U('NTA JEE Main portal', 'https://jeemain.nta.ac.in'),
      U('JEE Advanced (IIT)', 'https://jeeadv.ac.in'),
      U('NTA (National Testing Agency)', 'https://www.nta.ac.in'),
    ],
    resources: [
      { ...U('Unacademy JEE', 'https://unacademy.com/goal/jee-mains-and-advanced'), kind: 'article' },
      { ...U('NPTEL engineering lectures', 'https://nptel.ac.in'), kind: 'official' },
      { ...U('Physics Wallah JEE', 'https://www.youtube.com/@PhysicsWallah'), kind: 'video' },
    ],
  },
  {
    id: 'NEET',
    name: 'NEET',
    short: 'NEET',
    full: 'National Eligibility cum Entrance Test (UG)',
    region: 'India',
    accent: 'pink',
    tagline: 'Medical entrance for MBBS / BDS in India.',
    eligibility: [
      'Class 12 with Physics, Chemistry, Biology/Biotechnology, English',
      'Minimum 50% in PCB (40% for reserved categories)',
      'Minimum age 17 years; no max attempt limit currently',
    ],
    pattern: [
      { section: 'Format', details: '200 MCQs, attempt 180 — 3h 20min, 720 marks.' },
      { section: 'Physics', details: '45 questions, conceptual + numerical.' },
      { section: 'Chemistry', details: '45 questions, organic/inorganic/physical.' },
      { section: 'Biology', details: '90 questions (Botany + Zoology), highest weight.' },
      { section: 'Marking', details: '+4 correct, −1 wrong, 0 unattempted.' },
    ],
    official: [
      U('NEET NTA portal', 'https://neet.nta.nic.in'),
      U('NTA Medical exams', 'https://www.nta.ac.in/medicalexam'),
      U('NMC India (medical council)', 'https://www.nmc.org.in'),
    ],
    resources: [
      { ...U('Unacademy NEET', 'https://unacademy.com/goal/neet-ug'), kind: 'article' },
      { ...U('NCERT Biology (free)', 'https://ncert.nic.in/textbook.php'), kind: 'official' },
      { ...U('NEET Biology crash course', 'https://www.youtube.com/results?search_query=neet+biology+ncert'), kind: 'video' },
    ],
  },
  {
    id: 'GRE',
    name: 'GRE',
    short: 'GRE',
    full: 'Graduate Record Examinations',
    region: 'USA / Global',
    accent: 'cyan',
    tagline: 'ETS graduate admissions test for master’s, doctoral, business and law programs worldwide.',
    eligibility: [
      'Accepted or required by graduate programs worldwide; no specific degree prerequisite',
      'Scores are valid for 5 years; ID document required (passport for international test takers)',
      'Cost: about $249 worldwide or ₹22,550 in India; includes 4 free official score reports',
      'Retake every 21 days, up to 5 times in a rolling 12-month period; ScoreSelect lets you choose scores to report',
    ],
    pattern: [
      { section: 'Total format', details: 'Five sections over 1h 58min; the computer-adaptive test is shorter than the pre-2023 format.' },
      { section: 'Analytical Writing', details: 'One 30-min “Analyze an Issue” task, scored 0–6. The “Analyze an Argument” task was removed in 2023.' },
      { section: 'Verbal Reasoning', details: 'Two sections, 27 questions total across 41 min — Reading Comprehension, Text Completion and Sentence Equivalence.' },
      { section: 'Quantitative Reasoning', details: 'Two sections, 27 questions total across 47 min — arithmetic, algebra, geometry and data analysis.' },
      { section: 'Adaptive scoring', details: 'Verbal and Quantitative are section-level adaptive: performance in section one sets the difficulty and score ceiling of section two.' },
      { section: 'Scoring', details: 'Verbal and Quantitative: 130–170 each; combined score: 260–340. Analytical Writing: 0–6.' },
    ],
    official: [
      U('ETS Official GRE', 'https://www.ets.org/gre'),
      U('GRE test prep (ETS)', 'https://www.ets.org/gre/test-takers/general-test/prepare.html'),
      U('PowerPrep practice tests', 'https://www.ets.org/gre/test-takers/general-test/prepare/powerprep.html'),
    ],
    resources: [
      { ...U('Magoosh GRE blog', 'https://magoosh.com/gre'), kind: 'article' },
      { ...U('Gregmat+ prep', 'https://www.gregmat.com'), kind: 'article' },
      { ...U('GRE Math review', 'https://www.youtube.com/results?search_query=gre+math+review'), kind: 'video' },
    ],
  },
  {
    id: 'CUET',
    name: 'CUET',
    short: 'CUET',
    full: 'Common University Entrance Test (UG)',
    region: 'India',
    accent: 'lime',
    tagline: 'Unified entrance for 250+ central & state universities.',
    eligibility: [
      'Class 12 / equivalent pass from a recognized board',
      'Subject combination must match the target course',
      'No age limit; attempt limit set by NTA policy',
    ],
    pattern: [
      { section: 'Section I', details: 'Language test (13 languages) — 40 questions in 45 min.' },
      { section: 'Section II', details: 'Domain subjects (27 options, pick up to 6) — 40 Q each in 45 min.' },
      { section: 'Section III', details: 'General Test — 60 Q in 60 min (GK, reasoning, math).' },
      { section: 'Scoring', details: 'MCQs, +5 correct, no negative marking; total varies.' },
    ],
    official: [
      U('CUET NTA portal', 'https://cuet.samarth.ac.in'),
      U('NTA (organizer)', 'https://www.nta.ac.in'),
      U('CUET UG information bulletin', 'https://cuet.samarth.ac.in/index.php/site/information-bulletin'),
    ],
    resources: [
      { ...U('Adda247 CUET prep', 'https://adda247.com/cuet'), kind: 'article' },
      { ...U('NCERT textbooks', 'https://ncert.nic.in'), kind: 'official' },
      { ...U('CUET General Test playlist', 'https://www.youtube.com/results?search_query=cuet+general+test'), kind: 'video' },
    ],
  },
  {
    id: 'ACT',
    name: 'ACT',
    short: 'ACT',
    full: 'American College Testing',
    region: 'USA / Global',
    accent: 'purple',
    tagline: 'US college admissions test with an optional science section.',
    eligibility: [
      'Typically grades 9–12; no strict age limit',
      'Open to international students',
      'Offered ~7 times a year (paper and online in many centers)',
    ],
    pattern: [
      { section: 'English', details: '45 min, 75 questions — grammar, usage, rhetoric.' },
      { section: 'Math', details: '60 min, 60 questions — pre-algebra through trigonometry.' },
      { section: 'Reading', details: '35 min, 40 questions — 4 passages.' },
      { section: 'Science', details: 'Optional from 2025; 35 min, 40 questions (interpretation/analysis).' },
      { section: 'Writing', details: 'Optional 40-min essay. Composite score 1–36.' },
    ],
    official: [
      U('ACT Official site', 'https://www.act.org'),
      U('ACT test prep', 'https://www.act.org/content/act/en/products-and-services/the-act/test-preparation.html'),
      U('Official practice test', 'https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/free-act-test-prep.html'),
    ],
    resources: [
      { ...U('CrackACT practice', 'https://www.crackact.com'), kind: 'article' },
      { ...U('Kaplan ACT prep', 'https://www.kaptest.com/act'), kind: 'article' },
      { ...U('ACT English tips', 'https://www.youtube.com/results?search_query=act+english+tips'), kind: 'video' },
    ],
  },
];

export const EXAM_MAP: Record<ExamId, ExamInfo> = EXAMS.reduce(
  (acc, e) => ({ ...acc, [e.id]: e }),
  {} as Record<ExamId, ExamInfo>,
);
