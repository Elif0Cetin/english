import { GrammarTopic } from "../types";
import { A1_LESSONS_DATA } from "./a1LessonsData";

export const LESSONS_DATA: GrammarTopic[] = [
  // ================= A1 LEVEL TOPICS (10 topics, 20 questions each) =================
  ...A1_LESSONS_DATA,

  // ================= A2 LEVEL =================
  {
    id: "a2-past-continuous",
    title: "Past Continuous vs Past Simple",
    level: "A2",
    category: "Grammar",
    description: "Describe interrupted actions and background scenes using 'when' and 'while'.",
    estimatedMinutes: 12,
    iconName: "Layers",
    isMandatoryForAdvance: true,
    overview: {
      explanation: "Use Past Continuous (was/were + verb-ing) for continuous background actions, and Past Simple for short actions that interrupted them.",
      rules: [
        "Past Continuous formula: subject + was/were + verb-ing.",
        "Use 'while' with the longer continuous action (e.g., 'While I was cooking...').",
        "Use 'when' before the short interrupting past action (e.g., '...when the phone rang')."
      ],
      examples: [
        { sentence: "I was reading a book when the lights suddenly went out.", note: "Interrupted action" },
        { sentence: "While we were walking home, it started to rain.", note: "'While' introduces the ongoing activity" }
      ],
      commonMistakes: [
        { wrong: "I was break my leg while I was skiing.", correct: "I broke my leg while I was skiing.", reason: "The sudden event is Past Simple (broke)." }
      ]
    },
    quiz: [
      {
        id: "a2-q1",
        type: "multiple-choice",
        question: "Fill in the blanks: 'While Lucas ___ dinner, his friend ___ at the door.'",
        options: [
          "was cooking / knocked",
          "cooked / was knocking",
          "was cooking / was knocking",
          "cooked / knocked"
        ],
        correctAnswer: "was cooking / knocked",
        explanation: "Cooking was the longer ongoing action in the past (was cooking), and knocking was the sudden interruption (knocked).",
        hint: "One is continuous; one is a momentary action."
      },
      {
        id: "a2-q2",
        type: "error-identification",
        question: "Identify the incorrect word in this sentence: 'We was driving on the highway when we saw the rainbow.'",
        options: ["was", "driving", "when", "saw"],
        correctAnswer: "was",
        explanation: "'We' takes the plural auxiliary 'were', not 'was'.",
        hint: "Check subject-verb agreement for 'we'."
      }
    ],
    pronunciationSentences: [
      {
        id: "a2-p1",
        text: "I was waiting for the bus when the heavy rain began.",
        phoneticHints: "/aɪ wəz ˈweɪtɪŋ fɔː ðə bʌs wɛn ðə ˈhɛvi reɪn bɪˈɡæn/",
        focusSound: "Weak form of 'was' /wəz/ and sentence stress",
        difficulty: "Medium"
      }
    ]
  },
  {
    id: "a2-comparatives-superlatives",
    title: "Comparatives & Superlatives",
    level: "A2",
    category: "Grammar",
    description: "Compare places, people, and experiences using -er/more and -est/most.",
    estimatedMinutes: 10,
    iconName: "TrendingUp",
    isMandatoryForAdvance: true,
    overview: {
      explanation: "Comparatives contrast two things. Superlatives contrast three or more things.",
      rules: [
        "Short adjectives (1 syllable): add -er / -est (fast -> faster -> fastest).",
        "Long adjectives (2+ syllables): use more / most (comfortable -> more comfortable -> most comfortable).",
        "Irregular forms: good -> better -> best, bad -> worse -> worst, far -> further -> furthest."
      ],
      examples: [
        { sentence: "Taking the train is much faster than driving during rush hour.", note: "Comparative with 'than'" },
        { sentence: "This is the most exciting city I have ever visited.", note: "Superlative with 'the most'" }
      ],
      commonMistakes: [
        { wrong: "Tokyo is more bigger than Madrid.", correct: "Tokyo is bigger than Madrid.", reason: "Do not use 'more' with short adjectives already ending in -er." }
      ]
    },
    quiz: [
      {
        id: "a2-comp-q1",
        type: "multiple-choice",
        question: "Which sentence correctly compares two hotels?",
        options: [
          "The Grand Hotel is more cheaper than the Palace.",
          "The Grand Hotel is cheaper than the Palace.",
          "The Grand Hotel is more cheap than the Palace.",
          "The Grand Hotel is the cheapest than the Palace."
        ],
        correctAnswer: "The Grand Hotel is cheaper than the Palace.",
        explanation: "'Cheap' is a one-syllable adjective, so its comparative is 'cheaper'.",
        hint: "One syllable adjective rule."
      }
    ],
    pronunciationSentences: [
      {
        id: "a2-comp-p1",
        text: "This restaurant is far better and more affordable than the other one.",
        phoneticHints: "/ðɪs ˈrɛstərɒnt ɪz fɑː ˈbɛtər ænd mɔːr əˈfɔːdəbəl ðæn ði ˈʌðər wʌn/",
        focusSound: "Linking 'r' and rhythm in comparative phrases",
        difficulty: "Medium"
      }
    ]
  },

  // ================= B1 LEVEL (CORE INTERMEDIATE) =================
  {
    id: "b1-present-perfect-simple",
    title: "Present Perfect: Experiences, 'Since', & 'For'",
    level: "B1",
    category: "Grammar",
    description: "Connect past actions to the present moment. Master life experiences, 'already', 'yet', 'ever', 'since', and 'for'.",
    estimatedMinutes: 15,
    iconName: "Sparkles",
    isMandatoryForAdvance: true,
    overview: {
      explanation: "The Present Perfect connects the past to the present. We use it when the exact time is not specified, or when an action started in the past and continues now.",
      rules: [
        "Form: Subject + have/has + past participle (V3).",
        "Use 'ever' in questions for life experience (e.g., 'Have you ever tried sushi?').",
        "Use 'for' + a duration of time (for 3 years, for two weeks).",
        "Use 'since' + a specific starting point in time (since 2020, since yesterday morning, since I was a child).",
        "Use 'already' in positive sentences and 'yet' in questions and negatives."
      ],
      examples: [
        { sentence: "I have lived in this neighborhood since 2021.", note: "Started in 2021, still living here today" },
        { sentence: "She has already finished three modules this morning.", note: "'already' shows completion earlier than expected" },
        { sentence: "Have you received the confirmation email yet?", note: "'yet' used at the end of questions" }
      ],
      commonMistakes: [
        { wrong: "I have lived in London since five years.", correct: "I have lived in London for five years.", reason: "'Five years' is a period of time, so use 'for', not 'since'." },
        { wrong: "I have seen that movie yesterday.", correct: "I saw that movie yesterday.", reason: "When a specific past time ('yesterday') is stated, use Past Simple." }
      ]
    },
    quiz: [
      {
        id: "b1-q1",
        type: "multiple-choice",
        question: "Select the sentence with the correct usage of 'since' or 'for':",
        options: [
          "Elena has worked as a graphic designer for she graduated.",
          "Elena has worked as a graphic designer since she graduated.",
          "Elena is working as a graphic designer since five years.",
          "Elena worked as a graphic designer since five months."
        ],
        correctAnswer: "Elena has worked as a graphic designer since she graduated.",
        explanation: "'She graduated' is a specific starting time point in the past, so we use 'since' with the Present Perfect.",
        hint: "A specific event in the past is a starting point, not a duration."
      },
      {
        id: "b1-q2",
        type: "fill-in-blank",
        question: "We haven't booked our flight tickets ___ (yet / already / since).",
        options: ["yet", "already", "since", "for"],
        correctAnswer: "yet",
        explanation: "'Yet' is used in negative sentences and questions to refer to something expected.",
        hint: "Which word is standard at the end of negative present perfect sentences?"
      },
      {
        id: "b1-q3",
        type: "sentence-order",
        question: "Form a natural B1 question about life experience:",
        correctAnswer: ["Have", "you", "ever", "travelled", "abroad", "alone", "?"],
        explanation: "Standard question order: Have + Subject (you) + Adverb (ever) + Past Participle (travelled) + Adverbial + ?",
        hint: "Start with the auxiliary 'Have'."
      }
    ],
    pronunciationSentences: [
      {
        id: "b1-p1",
        text: "I've lived in this vibrant city for nearly six years.",
        phoneticHints: "/aɪv lɪvd ɪn ðɪs ˈvaɪ.brənt ˈsɪt.i fɔː ˈnɪə.li sɪks jɪəz/",
        focusSound: "Contraction /aɪv/ and the short /ɪ/ in 'lived' and 'city'",
        difficulty: "Medium"
      },
      {
        id: "b1-p2",
        text: "Have you ever thought about studying abroad in Europe?",
        phoneticHints: "/hæv juː ˈɛv.ər θɔːt əˈbaʊt ˈstʌd.i.ɪŋ əˈbrɔːd ɪn ˈjʊə.rəp/",
        focusSound: "The unvoiced 'th' sound /θ/ in 'thought' and connected intonation",
        difficulty: "Hard"
      }
    ]
  },
  {
    id: "b1-first-second-conditionals",
    title: "Conditionals (First & Second)",
    level: "B1",
    category: "Grammar",
    description: "Distinguish realistic future possibilities (First Conditional) from hypothetical dream scenarios (Second Conditional).",
    estimatedMinutes: 14,
    iconName: "GitFork",
    isMandatoryForAdvance: true,
    overview: {
      explanation: "First conditional expresses real/likely future possibilities. Second conditional expresses imaginary, hypothetical, or improbable present/future situations.",
      rules: [
        "First Conditional: If + Present Simple, will/won't + base verb. (e.g., 'If it rains, we will stay home.')",
        "Second Conditional: If + Past Simple, would/wouldn't + base verb. (e.g., 'If I had more free time, I would learn Italian.')",
        "In Second Conditional, formal English often uses 'were' for all subjects ('If I were you...')."
      ],
      examples: [
        { sentence: "If you practice speaking every day, you will become fluent much faster.", note: "First conditional: Real possibility" },
        { sentence: "If I won the lottery, I would travel around the entire world.", note: "Second conditional: Imaginary scenario" },
        { sentence: "If I were in your position, I would accept the job offer.", note: "Advice structure using 'were'" }
      ],
      commonMistakes: [
        { wrong: "If it will rain tomorrow, I will cancel the picnic.", correct: "If it rains tomorrow, I will cancel the picnic.", reason: "Never use 'will' in the 'if'-clause of a First Conditional." },
        { wrong: "If I have wings, I would fly.", correct: "If I had wings, I would fly.", reason: "Second conditional requires the Past Simple in the 'if'-clause." }
      ]
    },
    quiz: [
      {
        id: "b1-cond-q1",
        type: "multiple-choice",
        question: "Choose the correct hypothetical sentence (Second Conditional):",
        options: [
          "If I have a million dollars, I will buy a sailboat.",
          "If I had a million dollars, I would buy a sailboat.",
          "If I would have a million dollars, I bought a sailboat.",
          "If I had a million dollars, I bought a sailboat."
        ],
        correctAnswer: "If I had a million dollars, I would buy a sailboat.",
        explanation: "Second conditional structure: If + Past Simple (had) + would + base verb (buy).",
        hint: "Imaginary situation requires 'Past Simple' + 'would'."
      },
      {
        id: "b1-cond-q2",
        type: "fill-in-blank",
        question: "If they ___ (leave) now, they will catch the express train.",
        options: ["leave", "will leave", "left", "would leave"],
        correctAnswer: "leave",
        explanation: "First conditional uses Present Simple in the 'if' clause: 'If they leave now...'.",
        hint: "Avoid using 'will' inside the 'if' clause."
      }
    ],
    pronunciationSentences: [
      {
        id: "b1-cond-p1",
        text: "If I were you, I'd take the opportunity without hesitating.",
        phoneticHints: "/ɪf aɪ wɜː juː | aɪd teɪk ði ˌɒp.əˈtjuː.nə.ti wɪˈðaʊt ˈhɛz.ɪ.teɪ.tɪŋ/",
        focusSound: "Contraction /aɪd/ (I would) and natural mid-sentence pause",
        difficulty: "Medium"
      }
    ]
  },
  {
    id: "b1-modal-verbs-deduction",
    title: "Modals of Ability, Obligation & Advice",
    level: "B1",
    category: "Grammar",
    description: "Express nuance, recommendations, permission, and necessity with must, have to, should, and can.",
    estimatedMinutes: 12,
    iconName: "ShieldCheck",
    isMandatoryForAdvance: true,
    overview: {
      explanation: "Modal verbs modify the main verb to convey degrees of obligation, necessity, advice, ability, or polite requests.",
      rules: [
        "'Must' and 'have to' express strong obligation or necessity.",
        "'Mustn't' indicates prohibition (forbidden), while 'don't have to' indicates lack of obligation (optional).",
        "'Should / ought to' expresses advice, recommendation, or opinion.",
        "'Could / would you mind' makes polite requests."
      ],
      examples: [
        { sentence: "You don't have to wear a formal suit to the office on Fridays.", note: "Lack of obligation: it is optional" },
        { sentence: "Passengers must not smoke inside the cabin.", note: "Prohibition: strictly forbidden" },
        { sentence: "You should get at least seven hours of sleep before the interview.", note: "Helpful advice" }
      ],
      commonMistakes: [
        { wrong: "You must to visit the National Museum.", correct: "You must visit the National Museum.", reason: "Modal verbs are followed directly by the base verb without 'to' (except have to / ought to)." },
        { wrong: "You don't have to cross when the light is red.", correct: "You mustn't cross when the light is red.", reason: "Red light crossing is prohibited (mustn't), not optional." }
      ]
    },
    quiz: [
      {
        id: "b1-modal-q1",
        type: "multiple-choice",
        question: "Museum entry is free for all students today. Therefore, students ___ pay.",
        options: ["mustn't", "don't have to", "shouldn't", "can't"],
        correctAnswer: "don't have to",
        explanation: "'Don't have to' shows absence of obligation (it is free, so paying is not necessary). 'Mustn't' would mean it's illegal to pay.",
        hint: "Paying is optional / unnecessary, not forbidden."
      }
    ],
    pronunciationSentences: [
      {
        id: "b1-modal-p1",
        text: "You should really consider taking some time off to relax.",
        phoneticHints: "/juː ʃʊd ˈrɪə.li kənˈsɪd.ər ˈteɪ.kɪŋ sʌm taɪm ɒf tuː rɪˈlæks/",
        focusSound: "Silent 'l' in 'should' /ʃʊd/ and natural sentence melody",
        difficulty: "Medium"
      }
    ]
  },
  {
    id: "b1-passive-voice",
    title: "Passive Voice in Daily Communication",
    level: "B1",
    category: "Grammar",
    description: "Shift focus to the action or object rather than the agent. Essential for news, reports, and B1 essays.",
    estimatedMinutes: 14,
    iconName: "Repeat",
    isMandatoryForAdvance: true,
    overview: {
      explanation: "We use the passive voice when the action is more important than who did it, or when the agent is unknown or obvious.",
      rules: [
        "Structure: Object + appropriate form of 'be' + Past Participle (V3).",
        "Present Simple Passive: am/is/are + V3 (e.g., 'English is spoken globally').",
        "Past Simple Passive: was/were + V3 (e.g., 'The bridge was built in 1998').",
        "Use 'by + agent' only when the person who performed the action is important."
      ],
      examples: [
        { sentence: "Millions of emails are sent every minute around the globe.", note: "Present passive" },
        { sentence: "The famous novel was written by Jane Austen.", note: "Past passive with agent" }
      ],
      commonMistakes: [
        { wrong: "The package delivered yesterday.", correct: "The package was delivered yesterday.", reason: "The package did not deliver itself; passive requires 'was + delivered'." }
      ]
    },
    quiz: [
      {
        id: "b1-pass-q1",
        type: "multiple-choice",
        question: "Transform into passive: 'Architects designed this energy-efficient building in 2022.'",
        options: [
          "This energy-efficient building was designed by architects in 2022.",
          "This energy-efficient building designed in 2022 by architects.",
          "This energy-efficient building is designed in 2022.",
          "This energy-efficient building was design in 2022."
        ],
        correctAnswer: "This energy-efficient building was designed by architects in 2022.",
        explanation: "Past simple passive takes 'was + past participle (designed) + by architects'.",
        hint: "Form: was/were + V3."
      }
    ],
    pronunciationSentences: [
      {
        id: "b1-pass-p1",
        text: "The new eco-friendly project was successfully launched last week.",
        phoneticHints: "/ðə njuː ˈiː.kəʊˌfrɛnd.li ˈprɒdʒ.ɛkt wəz səkˈsɛs.fəl.i lɔːntʃt lɑːst wiːk/",
        focusSound: "Stress in multi-syllable adverbs: /səkˈsɛs.fəl.i/",
        difficulty: "Hard"
      }
    ]
  },

  // ================= ADVANCED LEVEL (B2/C1 - LOCKED UNTIL A1, A2, B1 COMPLETE) =================
  {
    id: "adv-inversion-emphasis",
    title: "Grammatical Inversion & Dramatic Emphasis",
    level: "Advanced",
    category: "Grammar",
    description: "Add sophisticated rhetorical weight and elegance with negative adverbial inversions (Rarely, Seldom, Not only...).",
    estimatedMinutes: 18,
    iconName: "Zap",
    isMandatoryForAdvance: false,
    overview: {
      explanation: "Inversion is a high-level stylistic structure where the verb precedes the subject after negative or restrictive expressions at the sentence start.",
      rules: [
        "Formula: Negative adverbial + auxiliary verb + subject + main verb.",
        "Common triggers: 'Rarely', 'Seldom', 'Never before', 'Under no circumstances', 'Not only... but also...'.",
        "Example: 'Rarely have I witnessed such dedication.'"
      ],
      examples: [
        { sentence: "Seldom does one encounter such breathtaking architectural beauty.", note: "Inversion with Present Simple: does + one + encounter" },
        { sentence: "Not only did they exceed their goals, but they also set a new industry benchmark.", note: "Inversion in the first clause" }
      ],
      commonMistakes: [
        { wrong: "Rarely I have seen such a remarkable performance.", correct: "Rarely have I seen such a remarkable performance.", reason: "Inversion requires auxiliary before the subject after negative adverbials." }
      ]
    },
    quiz: [
      {
        id: "adv-q1",
        type: "multiple-choice",
        question: "Select the sentence with correct advanced inversion:",
        options: [
          "Not only she achieved top honors, but she also earned a full scholarship.",
          "Not only did she achieve top honors, but she also earned a full scholarship.",
          "Not only did she achieved top honors, but she also earned a full scholarship.",
          "Not only she did achieve top honors, but she also earned a full scholarship."
        ],
        correctAnswer: "Not only did she achieve top honors, but she also earned a full scholarship.",
        explanation: "'Not only' at the start triggers auxiliary inversion 'did she achieve' with base verb.",
        hint: "Inversion follows question word order: did + subject + base verb."
      }
    ],
    pronunciationSentences: [
      {
        id: "adv-p1",
        text: "Under no circumstances should sensitive personal data be shared without encryption.",
        phoneticHints: "/ˈʌn.dər nəʊ ˈsɜː.kəm.stæn.sɪz ʃʊd ˈsɛn.sɪ.tɪv ˈpɜː.sən.əl ˈdeɪ.tə biː ʃeəd wɪˈðaʊt ɪnˈkrɪp.ʃən/",
        focusSound: "Formal cadence, tonic stress on 'circumstances' and 'encryption'",
        difficulty: "Hard"
      }
    ]
  },
  {
    id: "adv-mixed-conditionals",
    title: "Mixed Conditionals & Subtle Nuances",
    level: "Advanced",
    category: "Grammar",
    description: "Connect past conditions to present outcomes or ongoing personality traits to past actions.",
    estimatedMinutes: 20,
    iconName: "Layers",
    isMandatoryForAdvance: false,
    overview: {
      explanation: "Mixed conditionals blend different timeframes (e.g. Past action having a Present consequence, or a general ongoing truth causing a Past outcome).",
      rules: [
        "Past Condition -> Present Result: If + Past Perfect, would + base verb. ('If I hadn't missed my train, I would be at the conference right now.')",
        "Present Condition -> Past Result: If + Past Simple, would have + past participle. ('If I were more adventurous, I would have joined the expedition.')"
      ],
      examples: [
        { sentence: "If she had taken the specialist course last year, she would have a higher salary today.", note: "Past decision -> Present status" },
        { sentence: "If I spoke fluent German, I would have applied for that Berlin position.", note: "General skill -> Past opportunity" }
      ],
      commonMistakes: [
        { wrong: "If I had slept better last night, I will be alert now.", correct: "If I had slept better last night, I would be alert now.", reason: "Hypothetical present result uses 'would + base verb'." }
      ]
    },
    quiz: [
      {
        id: "adv-q2",
        type: "multiple-choice",
        question: "Which mixed conditional sentence connects a past decision to a present consequence?",
        options: [
          "If he had studied medicine, he would be a certified surgeon today.",
          "If he studied medicine, he will be a certified surgeon.",
          "If he had studied medicine, he would have been a surgeon yesterday.",
          "If he was studying medicine, he is a surgeon."
        ],
        correctAnswer: "If he had studied medicine, he would be a certified surgeon today.",
        explanation: "If + Past Perfect (had studied) pairs with 'would be ... today' to reflect a present consequence of a past unfulfilled condition.",
        hint: "Notice the time marker 'today' for the result clause."
      }
    ],
    pronunciationSentences: [
      {
        id: "adv-p2",
        text: "Had they informed us earlier, we would certainly be in a much stronger negotiating position.",
        phoneticHints: "/hæd ðeɪ ɪnˈfɔːmd ʌs ˈɜː.li.ər | wiː wʊd ˈsɜː.tən.li biː ɪn ə mʌtʃ ˈstrɒŋ.ər nɪˈɡəʊ.ʃi.eɪ.tɪŋ pəˈzɪʃ.ən/",
        focusSound: "Inverted conditional clause intonation with smooth linking consonants",
        difficulty: "Hard"
      }
    ]
  }
];

export const CEFR_LEVEL_METRICS: Record<string, { label: string; tag: string; description: string; color: string; badge: string }> = {
  A1: {
    label: "A1 - Beginner",
    tag: "Elementary Basics",
    description: "Everyday expressions, basic introductions, present simple habits, and basic interactions.",
    color: "emerald",
    badge: "🌱 Seedling Starter"
  },
  A2: {
    label: "A2 - Elementary",
    tag: "Everyday Communicator",
    description: "Simple routine exchanges, past experiences, directions, shopping, and comparisons.",
    color: "cyan",
    badge: "🌿 Growing Speaker"
  },
  B1: {
    label: "B1 - Intermediate",
    tag: "Independent Learner",
    description: "Expressing opinions, travel situations, past experiences, plans, conditionals, and natural discussions.",
    color: "blue",
    badge: "⭐ Fluent Navigator"
  },
  Advanced: {
    label: "Advanced (B2/C1)",
    tag: "Mastery Level",
    description: "Nuanced expression, idiomatic agility, complex mixed conditionals, stylistic inversion, and formal discourse.",
    color: "purple",
    badge: "👑 Master Polyglot"
  }
};
