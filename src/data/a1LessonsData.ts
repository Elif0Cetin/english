import { GrammarTopic } from "../types";

export const A1_LESSONS_DATA: GrammarTopic[] = [
  // ================= 1. PRESENT SIMPLE OF 'TO BE': AM / IS / ARE =================
  {
    id: "a1-present-be",
    title: "A1 Present simple forms of ‘to be’: am/is/are",
    level: "A1",
    category: "Grammar",
    description: "Master am, is, are, short forms (I'm, they're), negatives (isn't, aren't), and basic question structures.",
    estimatedMinutes: 10,
    iconName: "UserCheck",
    isMandatoryForAdvance: true,
    overview: {
      explanation: "The verb 'to be' is used to talk about names, ages, nationalities, professions, feelings, and locations.",
      rules: [
        "Use 'am' ('m) with 'I' (e.g. 'I am a student').",
        "Use 'is' ('s) with 'he, she, it' and singular nouns (e.g. 'She is happy', 'The dog is brown').",
        "Use 'are' ('re) with 'you, we, they' and plural nouns (e.g. 'We are ready', 'They are doctors').",
        "Negative forms: am not ('m not), is not (isn't), are not (aren't).",
        "Questions: Invert the verb and subject (e.g. 'Are you tired?', 'Is he at home?')."
      ],
      examples: [
        { sentence: "I am twenty-two years old and I am from Italy.", note: "Using 'am' for age and origin" },
        { sentence: "Sophia isn't in the office today; she is at home.", note: "Negative and positive with 'is'" },
        { sentence: "Are they ready for the English exam?", note: "Question form with 'Are'" }
      ],
      commonMistakes: [
        { wrong: "I have 20 years old.", correct: "I am 20 years old.", reason: "In English, we use 'to be' for age, not 'have'." },
        { wrong: "They is my friends.", correct: "They are my friends.", reason: "'They' is plural and requires 'are'." }
      ]
    },
    pronunciationSentences: [
      {
        id: "a1-be-p1",
        text: "I'm a student and she's an architect.",
        phoneticHints: "/aɪm ə ˈstjuːdənt ænd ʃiːz ən ˈɑːrkɪtɛkt/",
        focusSound: "Contractions /aɪm/ and /ʃiːz/",
        difficulty: "Easy"
      },
      {
        id: "a1-be-p2",
        text: "Are you from Madrid or Barcelona?",
        phoneticHints: "/ɑːr juː frəm məˈdrɪd ɔːr ˌbɑːrsəˈloʊnə/",
        focusSound: "Rising-falling question intonation",
        difficulty: "Easy"
      }
    ],
    quiz: [
      {
        id: "a1-be-q1",
        type: "multiple-choice",
        question: "Select the correct verb for this sentence: 'I ___ from Toronto, Canada.'",
        options: ["am", "is", "are", "be"],
        correctAnswer: "am",
        explanation: "The subject pronoun 'I' always pairs with 'am' in the present simple.",
        hint: "Which form of 'to be' is used with 'I'?"
      },
      {
        id: "a1-be-q2",
        type: "multiple-choice",
        question: "Which sentence is correct?",
        options: [
          "She are a talented graphic designer.",
          "She is a talented graphic designer.",
          "She am a talented graphic designer.",
          "She be a talented graphic designer."
        ],
        correctAnswer: "She is a talented graphic designer.",
        explanation: "'She' is third-person singular and uses 'is'.",
        hint: "Third-person singular pronouns take 'is'."
      },
      {
        id: "a1-be-q3",
        type: "multiple-choice",
        question: "They ___ late for the meeting today.",
        options: ["aren't", "isn't", "am not", "not are"],
        correctAnswer: "aren't",
        explanation: "'They' takes 'are not' or its contraction 'aren't'.",
        hint: "'They' is plural."
      },
      {
        id: "a1-be-q4",
        type: "multiple-choice",
        question: "___ your brother at home right now?",
        options: ["Is", "Are", "Am", "Do"],
        correctAnswer: "Is",
        explanation: "'Your brother' is singular (he), so the question starts with 'Is'.",
        hint: "Replace 'your brother' with 'he'."
      },
      {
        id: "a1-be-q5",
        type: "fill-in-blank",
        question: "My parents ___ (be) on vacation in Greece this week.",
        options: ["are", "is", "am", "be"],
        correctAnswer: "are",
        explanation: "'My parents' is plural (they), which takes 'are'.",
        hint: "Think about 'they'."
      },
      {
        id: "a1-be-q6",
        type: "sentence-order",
        question: "Arrange into a correct positive sentence:",
        correctAnswer: ["We", "are", "very", "happy", "to", "see", "you", "."],
        explanation: "Subject (We) + verb (are) + adjective phrase (very happy) + infinitive (to see you).",
        hint: "Start with 'We'."
      },
      {
        id: "a1-be-q7",
        type: "multiple-choice",
        question: "Choose the correct short answer to: 'Are you tired?'",
        options: ["Yes, I am.", "Yes, I'm.", "Yes, I do.", "Yes, I are."],
        correctAnswer: "Yes, I am.",
        explanation: "In positive short answers, we do not contract: say 'Yes, I am', not 'Yes, I'm'.",
        hint: "Never use contractions at the end of positive short answers."
      },
      {
        id: "a1-be-q8",
        type: "multiple-choice",
        question: "The weather ___ very warm and sunny today.",
        options: ["is", "are", "am", "were"],
        correctAnswer: "is",
        explanation: "'The weather' is an uncountable singular noun (it), so it takes 'is'.",
        hint: "Treat 'weather' as 'it'."
      },
      {
        id: "a1-be-q9",
        type: "multiple-choice",
        question: "How old ___ you?",
        options: ["are", "is", "am", "have"],
        correctAnswer: "are",
        explanation: "'You' always takes 'are'. In English, age uses the verb 'to be'.",
        hint: "The pronoun is 'you'."
      },
      {
        id: "a1-be-q10",
        type: "fill-in-blank",
        question: "I ___ (not be) hungry, but I am very thirsty.",
        options: ["am not", "isn't", "aren't", "don't be"],
        correctAnswer: "am not",
        explanation: "The negative form for 'I' is 'am not'.",
        hint: "I + am not."
      },
      {
        id: "a1-be-q11",
        type: "sentence-order",
        question: "Arrange into a correct question:",
        correctAnswer: ["Where", "is", "the", "nearest", "train", "station", "?"],
        explanation: "Question word (Where) + verb (is) + subject (the nearest train station) + ?",
        hint: "Begin with 'Where'."
      },
      {
        id: "a1-be-q12",
        type: "multiple-choice",
        question: "Select the sentence with the correct contraction:",
        options: [
          "It's a beautiful afternoon.",
          "Its a beautiful afternoon.",
          "It are a beautiful afternoon.",
          "It am a beautiful afternoon."
        ],
        correctAnswer: "It's a beautiful afternoon.",
        explanation: "'It's' is the short form of 'It is'.",
        hint: "Look for the apostrophe in 'It is'."
      },
      {
        id: "a1-be-q13",
        type: "multiple-choice",
        question: "Lucas and Maria ___ students at the university.",
        options: ["are", "is", "am", "be"],
        correctAnswer: "are",
        explanation: "'Lucas and Maria' is a plural subject (two people = they), so use 'are'.",
        hint: "Two people = they."
      },
      {
        id: "a1-be-q14",
        type: "multiple-choice",
        question: "Choose the correct negative sentence:",
        options: [
          "This coffee isn't hot.",
          "This coffee aren't hot.",
          "This coffee am not hot.",
          "This coffee not is hot."
        ],
        correctAnswer: "This coffee isn't hot.",
        explanation: "'This coffee' is singular (it), so the negative is 'isn't' (is not).",
        hint: "'Coffee' is singular."
      },
      {
        id: "a1-be-q15",
        type: "fill-in-blank",
        question: "___ you and your sister twins?",
        options: ["Are", "Is", "Am", "Do"],
        correctAnswer: "Are",
        explanation: "'You and your sister' refers to 'you (plural)' or 'we', requiring 'Are'.",
        hint: "Plural subject."
      },
      {
        id: "a1-be-q16",
        type: "multiple-choice",
        question: "What ___ your phone number?",
        options: ["is", "are", "am", "be"],
        correctAnswer: "is",
        explanation: "'Your phone number' is singular (it), which takes 'is'.",
        hint: "A phone number is singular."
      },
      {
        id: "a1-be-q17",
        type: "sentence-order",
        question: "Arrange into a negative statement:",
        correctAnswer: ["These", "shoes", "aren't", "very", "comfortable", "."],
        explanation: "Subject (These shoes) + verb (aren't) + adjective phrase (very comfortable).",
        hint: "Start with 'These'."
      },
      {
        id: "a1-be-q18",
        type: "multiple-choice",
        question: "Choose the correct reply to: 'Is Emma at school?'",
        options: [
          "No, she isn't.",
          "No, she aren't.",
          "No, she not.",
          "No, she doesn't."
        ],
        correctAnswer: "No, she isn't.",
        explanation: "'Emma' is 'she', and the negative short answer with 'to be' is 'No, she isn't.'",
        hint: "She + isn't."
      },
      {
        id: "a1-be-q19",
        type: "multiple-choice",
        question: "I ___ really excited about our upcoming holiday.",
        options: ["'m", "'s", "'re", "be"],
        correctAnswer: "'m",
        explanation: "Contraction for 'I am' is 'I'm' ('m).",
        hint: "Short form of 'am'."
      },
      {
        id: "a1-be-q20",
        type: "multiple-choice",
        question: "Which of the following is INCORRECT?",
        options: [
          "You are very kind.",
          "I am twenty years old.",
          "He are my English teacher.",
          "They aren't at home."
        ],
        correctAnswer: "He are my English teacher.",
        explanation: "'He' must take 'is' (He is my English teacher), not 'are'.",
        hint: "Find the subject-verb mismatch."
      }
    ]
  },

  // ================= 2. PRESENT SIMPLE: I DO, I DON'T, DO I? =================
  {
    id: "a1-present-simple",
    title: "A1 Present simple: I do, I don’t, Do I?",
    level: "A1",
    category: "Grammar",
    description: "Learn habitual actions, third person singular (-s/-es), negatives (don't/doesn't), and question forms.",
    estimatedMinutes: 10,
    iconName: "Clock",
    isMandatoryForAdvance: true,
    overview: {
      explanation: "Use the Present Simple tense to describe habits, daily routines, facts, and things that are generally true.",
      rules: [
        "Positive: Base verb for I, you, we, they (e.g. 'I work'). Add -s or -es for he, she, it (e.g. 'He works', 'She watches').",
        "Negative: Use 'do not / don't' for I, you, we, they; use 'does not / doesn't' for he, she, it + base verb.",
        "Questions: Use 'Do + I/you/we/they + base verb?' or 'Does + he/she/it + base verb?'",
        "Time words: always, usually, often, sometimes, never, every day."
      ],
      examples: [
        { sentence: "Sarah drinks green tea every morning.", note: "Third person adds -s" },
        { sentence: "We don't live in a big city.", note: "Negative with 'don't'" },
        { sentence: "Does your father speak French?", note: "Question with 'Does'" }
      ],
      commonMistakes: [
        { wrong: "She doesn't likes fish.", correct: "She doesn't like fish.", reason: "After 'doesn't', the main verb must be in its base form." },
        { wrong: "He go to school by bus.", correct: "He goes to school by bus.", reason: "He/she/it requires '-es' for verbs ending in -o." }
      ]
    },
    pronunciationSentences: [
      {
        id: "a1-ps-p1",
        text: "He works in a hospital and teaches on weekends.",
        phoneticHints: "/hiː wɜːrks ɪn ə ˈhɒspɪtəl ænd ˈtiːtʃɪz ɒn ˈwiːkˌɛndz/",
        focusSound: "Third person verb endings /s/ and /ɪz/",
        difficulty: "Easy"
      },
      {
        id: "a1-ps-p2",
        text: "Do you play football after class?",
        phoneticHints: "/duː juː pleɪ ˈfʊtbɔːl ˈæftər klæs/",
        focusSound: "Fast linking 'Do you' -> /djuː/",
        difficulty: "Easy"
      }
    ],
    quiz: [
      {
        id: "a1-ps-q1",
        type: "multiple-choice",
        question: "Emily ___ breakfast with her family every day.",
        options: ["eats", "eat", "eating", "is eat"],
        correctAnswer: "eats",
        explanation: "Emily is third-person singular (she), so the verb takes '-s' -> 'eats'.",
        hint: "Third-person singular adds -s."
      },
      {
        id: "a1-ps-q2",
        type: "multiple-choice",
        question: "I ___ drink coffee in the evening because it keeps me awake.",
        options: ["don't", "doesn't", "am not", "no"],
        correctAnswer: "don't",
        explanation: "For 'I', the negative auxiliary in Present Simple is 'don't'.",
        hint: "Use 'don't' for 'I'."
      },
      {
        id: "a1-ps-q3",
        type: "multiple-choice",
        question: "___ you live near the university campus?",
        options: ["Do", "Does", "Are", "Is"],
        correctAnswer: "Do",
        explanation: "Present simple questions with 'you' use the auxiliary 'Do'.",
        hint: "Auxiliary verb for 'you'."
      },
      {
        id: "a1-ps-q4",
        type: "multiple-choice",
        question: "My brother ___ (watch) documentaries on Saturday nights.",
        options: ["watches", "watchs", "watch", "is watch"],
        correctAnswer: "watches",
        explanation: "Verbs ending in '-ch' take '-es' in the third person: 'watches'.",
        hint: "Verbs ending in -ch add -es."
      },
      {
        id: "a1-ps-q5",
        type: "multiple-choice",
        question: "Where ___ your sister work?",
        options: ["does", "do", "is", "are"],
        correctAnswer: "does",
        explanation: "'Your sister' is singular (she), so the question requires 'does'.",
        hint: "Your sister = she."
      },
      {
        id: "a1-ps-q6",
        type: "fill-in-blank",
        question: "Mark ___ (not play) video games on weekdays.",
        options: ["doesn't play", "don't play", "doesn't plays", "isn't play"],
        correctAnswer: "doesn't play",
        explanation: "Mark (he) uses 'doesn't + base verb (play)'.",
        hint: "doesn't + base form."
      },
      {
        id: "a1-ps-q7",
        type: "sentence-order",
        question: "Arrange into a grammatically correct question:",
        correctAnswer: ["What", "time", "do", "you", "wake", "up", "?"],
        explanation: "Question phrase (What time) + auxiliary (do) + subject (you) + verb (wake up) + ?",
        hint: "Start with 'What time'."
      },
      {
        id: "a1-ps-q8",
        type: "multiple-choice",
        question: "He always ___ his teeth after every meal.",
        options: ["brushes", "brush", "brushing", "brushs"],
        correctAnswer: "brushes",
        explanation: "Verbs ending in '-sh' take '-es' in third person singular -> 'brushes'.",
        hint: "Verbs ending in -sh add -es."
      },
      {
        id: "a1-ps-q9",
        type: "multiple-choice",
        question: "Choose the correct sentence:",
        options: [
          "She doesn't have any brothers.",
          "She doesn't has any brothers.",
          "She don't have any brothers.",
          "She not has any brothers."
        ],
        correctAnswer: "She doesn't have any brothers.",
        explanation: "After 'doesn't', we use the base form 'have', never 'has'.",
        hint: "Use base verb after doesn't."
      },
      {
        id: "a1-ps-q10",
        type: "multiple-choice",
        question: "They ___ to the cinema very often.",
        options: ["don't go", "doesn't go", "aren't go", "not go"],
        correctAnswer: "don't go",
        explanation: "'They' takes 'don't + base verb'.",
        hint: "They + don't + verb."
      },
      {
        id: "a1-ps-q11",
        type: "fill-in-blank",
        question: "A bank manager ___ (earn) a good salary.",
        options: ["earns", "earn", "is earning", "earnes"],
        correctAnswer: "earns",
        explanation: "'A bank manager' is singular (he/she), so we add '-s' to the verb -> 'earns'.",
        hint: "Add -s for singular subject."
      },
      {
        id: "a1-ps-q12",
        type: "sentence-order",
        question: "Arrange into a correct positive sentence:",
        correctAnswer: ["My", "father", "reads", "the", "newspaper", "every", "morning", "."],
        explanation: "Subject (My father) + verb (reads) + object (the newspaper) + time expression (every morning).",
        hint: "Start with 'My father'."
      },
      {
        id: "a1-ps-q13",
        type: "multiple-choice",
        question: "Does your dog bark at night?",
        options: [
          "No, it doesn't.",
          "No, it don't.",
          "No, it isn't.",
          "No, it not barks."
        ],
        correctAnswer: "No, it doesn't.",
        explanation: "For questions starting with 'Does', short negative answers use 'No, subject + doesn't.'",
        hint: "Match the auxiliary 'Does'."
      },
      {
        id: "a1-ps-q14",
        type: "multiple-choice",
        question: "She ___ (study) English for two hours every day.",
        options: ["studies", "studys", "study", "is study"],
        correctAnswer: "studies",
        explanation: "Consonant + 'y' changes to '-ies' in the third person: 'studies'.",
        hint: "Change 'y' to 'ies'."
      },
      {
        id: "a1-ps-q15",
        type: "multiple-choice",
        question: "We ___ in a small apartment downtown.",
        options: ["live", "lives", "living", "are live"],
        correctAnswer: "live",
        explanation: "'We' takes the base form of the verb: 'live'.",
        hint: "No -s for 'we'."
      },
      {
        id: "a1-ps-q16",
        type: "fill-in-blank",
        question: "___ (Do/Does) your grandparents live in another country?",
        options: ["Do", "Does", "Are", "Is"],
        correctAnswer: "Do",
        explanation: "'Your grandparents' is plural (they), requiring the auxiliary 'Do'.",
        hint: "Plural subject (they)."
      },
      {
        id: "a1-ps-q17",
        type: "sentence-order",
        question: "Arrange into a negative sentence:",
        correctAnswer: ["I", "do", "not", "like", "spicy", "food", "."],
        explanation: "Subject (I) + auxiliary (do not) + verb (like) + object (spicy food).",
        hint: "Start with 'I'."
      },
      {
        id: "a1-ps-q18",
        type: "multiple-choice",
        question: "The train to London ___ at 9:30 AM sharp.",
        options: ["leaves", "leave", "is leave", "leaving"],
        correctAnswer: "leaves",
        explanation: "Timetabled events and singular nouns take the third-person '-s' -> 'leaves'.",
        hint: "The train = it."
      },
      {
        id: "a1-ps-q19",
        type: "multiple-choice",
        question: "Do you understand this grammar lesson?",
        options: [
          "Yes, I do.",
          "Yes, I understand it do.",
          "Yes, I am.",
          "Yes, I does."
        ],
        correctAnswer: "Yes, I do.",
        explanation: "Short affirmative answer to a 'Do you...?' question is 'Yes, I do.'",
        hint: "Match the 'Do' auxiliary."
      },
      {
        id: "a1-ps-q20",
        type: "multiple-choice",
        question: "Which of the following is correct?",
        options: [
          "He flies to Paris once a month.",
          "He flys to Paris once a month.",
          "He fly to Paris once a month.",
          "He is fly to Paris once a month."
        ],
        correctAnswer: "He flies to Paris once a month.",
        explanation: "The verb 'fly' ends in consonant + y, which becomes '-ies': 'flies'.",
        hint: "fly -> flies."
      }
    ]
  },

  // ================= 3. PRESENT CONTINUOUS =================
  {
    id: "a1-present-continuous",
    title: "A1 Present continuous: I’m doing, I’m not doing, Are you doing?",
    level: "A1",
    category: "Grammar",
    description: "Describe actions happening right now, am/is/are + verb-ing, negatives, and question structures.",
    estimatedMinutes: 10,
    iconName: "Activity",
    isMandatoryForAdvance: true,
    overview: {
      explanation: "Use the Present Continuous for activities happening right now at the moment of speaking or around now.",
      rules: [
        "Structure: Subject + am / is / are + verb-ing (e.g. 'I am eating', 'She is reading').",
        "Spelling rules: write -> writing (drop -e), run -> running (double consonant), play -> playing.",
        "Negatives: Subject + am not / isn't / aren't + verb-ing.",
        "Questions: Am / Is / Are + subject + verb-ing? (e.g. 'Are you listening?').",
        "Time markers: now, right now, at the moment, currently, look!, listen!."
      ],
      examples: [
        { sentence: "Please be quiet; the baby is sleeping.", note: "Action happening at this exact moment" },
        { sentence: "We aren't watching television right now.", note: "Negative present continuous" },
        { sentence: "What are you doing this evening?", note: "Question with 'what'" }
      ],
      commonMistakes: [
        { wrong: "I listening to music.", correct: "I am listening to music.", reason: "Never forget the helping verb 'am/is/are' before the -ing verb." },
        { wrong: "She is runing.", correct: "She is running.", reason: "One-syllable verbs ending in consonant-vowel-consonant double the last letter." }
      ]
    },
    pronunciationSentences: [
      {
        id: "a1-pc-p1",
        text: "Look! It is raining heavily outside.",
        phoneticHints: "/lʊk ɪt ɪz ˈreɪnɪŋ ˈhɛvɪli ˌaʊtˈsaɪd/",
        focusSound: "Smooth -ing ending /ɪŋ/",
        difficulty: "Easy"
      },
      {
        id: "a1-pc-p2",
        text: "What are you cooking for dinner?",
        phoneticHints: "/wɒt ɑːr juː ˈkʊkɪŋ fɔːr ˈdɪnər/",
        focusSound: "Wh- question intonation",
        difficulty: "Easy"
      }
    ],
    quiz: [
      {
        id: "a1-pc-q1",
        type: "multiple-choice",
        question: "Look out the window! It ___ right now.",
        options: ["is snowing", "snows", "snowing", "is snow"],
        correctAnswer: "is snowing",
        explanation: "For an action happening at this exact moment, use 'is + verb-ing' -> 'is snowing'.",
        hint: "'Look!' signals present continuous."
      },
      {
        id: "a1-pc-q2",
        type: "multiple-choice",
        question: "Please speak quietly. I ___ on an important project.",
        options: ["am working", "work", "is working", "are working"],
        correctAnswer: "am working",
        explanation: "'I' takes 'am + verb-ing' -> 'am working'.",
        hint: "I + am + -ing."
      },
      {
        id: "a1-pc-q3",
        type: "multiple-choice",
        question: "What ___ you doing right now?",
        options: ["are", "is", "do", "have"],
        correctAnswer: "are",
        explanation: "Questions with 'you' in present continuous use 'are': 'What are you doing?'.",
        hint: "Helping verb for 'you' in continuous tense."
      },
      {
        id: "a1-pc-q4",
        type: "fill-in-blank",
        question: "They ___ (not study) for the test; they are playing cards.",
        options: ["aren't studying", "isn't studying", "don't studying", "not studying"],
        correctAnswer: "aren't studying",
        explanation: "'They' takes 'aren't + studying'.",
        hint: "Negative for 'they'."
      },
      {
        id: "a1-pc-q5",
        type: "sentence-order",
        question: "Arrange into a correct question:",
        correctAnswer: ["Is", "your", "brother", "sleeping", "upstairs", "?"],
        explanation: "Helping verb (Is) + subject (your brother) + verb-ing (sleeping) + place (upstairs) + ?",
        hint: "Start with 'Is'."
      },
      {
        id: "a1-pc-q6",
        type: "multiple-choice",
        question: "Which verb has the CORRECT spelling in the -ing form?",
        options: ["running", "runing", "runneing", "ronning"],
        correctAnswer: "running",
        explanation: "'Run' ends in consonant-vowel-consonant (r-u-n), so we double the 'n': 'running'.",
        hint: "Double the 'n'."
      },
      {
        id: "a1-pc-q7",
        type: "multiple-choice",
        question: "Which verb has the CORRECT spelling in the -ing form?",
        options: ["writing", "writeing", "writting", "writteing"],
        correctAnswer: "writing",
        explanation: "Verbs ending in silent 'e' drop the 'e' before adding '-ing': 'writing'.",
        hint: "Drop the final -e."
      },
      {
        id: "a1-pc-q8",
        type: "multiple-choice",
        question: "Listen! Somebody ___ at the front door.",
        options: ["is knocking", "knocks", "are knocking", "knocking"],
        correctAnswer: "is knocking",
        explanation: "'Somebody' is treated as singular (he/she) -> 'is knocking'.",
        hint: "'Listen!' signals an action happening right now."
      },
      {
        id: "a1-pc-q9",
        type: "multiple-choice",
        question: "We ___ dinner at a restaurant this evening.",
        options: ["are having", "have", "is having", "having"],
        correctAnswer: "are having",
        explanation: "'We' takes 'are + having'.",
        hint: "We + are + verb-ing."
      },
      {
        id: "a1-pc-q10",
        type: "fill-in-blank",
        question: "Why ___ (she / cry)? Did something happen?",
        options: ["is she crying", "she is crying", "does she cry", "is she cry"],
        correctAnswer: "is she crying",
        explanation: "In questions, invert the helping verb and subject: 'Why is she crying?'.",
        hint: "Question order: Wh- + is + subject + -ing."
      },
      {
        id: "a1-pc-q11",
        type: "sentence-order",
        question: "Arrange into a negative sentence:",
        correctAnswer: ["I", "am", "not", "wearing", "my", "coat", "."],
        explanation: "Subject (I) + helping verb (am not) + verb-ing (wearing) + object (my coat).",
        hint: "Start with 'I'."
      },
      {
        id: "a1-pc-q12",
        type: "multiple-choice",
        question: "The children ___ in the garden at the moment.",
        options: ["are playing", "is playing", "plays", "play"],
        correctAnswer: "are playing",
        explanation: "'The children' is plural (they), so use 'are playing'.",
        hint: "'Children' is plural."
      },
      {
        id: "a1-pc-q13",
        type: "multiple-choice",
        question: "Are you enjoying your holiday in Italy?",
        options: [
          "Yes, I am.",
          "Yes, I'm.",
          "Yes, I do.",
          "Yes, I are."
        ],
        correctAnswer: "Yes, I am.",
        explanation: "Short answer to 'Are you...?' is 'Yes, I am.'",
        hint: "Do not contract positive short answers."
      },
      {
        id: "a1-pc-q14",
        type: "multiple-choice",
        question: "Select the sentence with a spelling mistake in the -ing verb:",
        options: [
          "He is makeing a cup of coffee.",
          "She is dancing in the room.",
          "They are swimming in the lake.",
          "I am putting on my shoes."
        ],
        correctAnswer: "He is makeing a cup of coffee.",
        explanation: "'Make' ends in -e, so it drops the -e to become 'making', not 'makeing'.",
        hint: "Look at the verb 'make'."
      },
      {
        id: "a1-pc-q15",
        type: "fill-in-blank",
        question: "My father ___ (drive) us to the airport right now.",
        options: ["is driving", "are driving", "drives", "is driveing"],
        correctAnswer: "is driving",
        explanation: "'My father' is singular (he) -> 'is driving'.",
        hint: "He + is + driving."
      },
      {
        id: "a1-pc-q16",
        type: "multiple-choice",
        question: "What book ___ you ___ at the moment?",
        options: ["are / reading", "do / read", "is / reading", "have / read"],
        correctAnswer: "are / reading",
        explanation: "Present continuous question with 'you': 'are you reading'.",
        hint: "Use 'are' with 'you'."
      },
      {
        id: "a1-pc-q17",
        type: "sentence-order",
        question: "Arrange into a correct positive sentence:",
        correctAnswer: ["She", "is", "talking", "on", "the", "phone", "."],
        explanation: "Subject (She) + is + verb-ing (talking) + prepositional phrase (on the phone).",
        hint: "Start with 'She'."
      },
      {
        id: "a1-pc-q18",
        type: "multiple-choice",
        question: "Look at the sky! The sun ___ brightly.",
        options: ["is shining", "shines", "is shineing", "are shining"],
        correctAnswer: "is shining",
        explanation: "'The sun' is singular (it), and 'shine' drops the 'e' -> 'is shining'.",
        hint: "Drop the 'e' in 'shine'."
      },
      {
        id: "a1-pc-q19",
        type: "multiple-choice",
        question: "Is your mother cooking dinner right now?",
        options: [
          "No, she isn't.",
          "No, she don't.",
          "No, she not.",
          "No, she doesn't."
        ],
        correctAnswer: "No, she isn't.",
        explanation: "Negative short answer to 'Is she...?' is 'No, she isn't.'",
        hint: "Match the 'Is' helping verb."
      },
      {
        id: "a1-pc-q20",
        type: "multiple-choice",
        question: "They ___ for the bus in the rain.",
        options: ["are waiting", "is waiting", "waits", "waiting"],
        correctAnswer: "are waiting",
        explanation: "'They' is plural and takes 'are waiting'.",
        hint: "They + are + verb-ing."
      }
    ]
  },

  // ================= 4. PRESENT SIMPLE OR PRESENT CONTINUOUS? =================
  {
    id: "a1-present-simple-vs-continuous",
    title: "A1 Present simple or present continuous?",
    level: "A1",
    category: "Grammar",
    description: "Contrast routines vs actions happening now, stative verbs (know, like, want), and time signal words.",
    estimatedMinutes: 12,
    iconName: "GitCompare",
    isMandatoryForAdvance: true,
    overview: {
      explanation: "Compare when to use Present Simple (routines, facts) versus Present Continuous (now, temporary actions).",
      rules: [
        "Present Simple: Habits, permanent truths, routines (signals: every day, always, usually, often).",
        "Present Continuous: Things happening right now or temporarily (signals: now, at the moment, today, look!).",
        "Stative Verbs: Verbs of feeling, thinking, and possession are NOT usually used in the continuous form (e.g. like, love, hate, know, understand, want, need, believe). Say 'I know', NOT 'I am knowing'."
      ],
      examples: [
        { sentence: "I usually walk to work, but today I am taking the bus.", note: "Routine (walk) vs temporary today (taking)" },
        { sentence: "Do you understand the exercise?", note: "Stative verb 'understand' stays in simple form" },
        { sentence: "He is speaking Spanish right now, but he normally speaks English.", note: "Action now vs usual habit" }
      ],
      commonMistakes: [
        { wrong: "I am wanting a glass of water.", correct: "I want a glass of water.", reason: "'Want' is a stative verb and cannot be used in continuous -ing form." },
        { wrong: "She drinks coffee right now.", correct: "She is drinking coffee right now.", reason: "'Right now' indicates an ongoing action, requiring present continuous." }
      ]
    },
    pronunciationSentences: [
      {
        id: "a1-psc-p1",
        text: "He usually wears a suit, but today he's wearing jeans.",
        phoneticHints: "/hiː ˈjuːʒʊəli wɛərz ə suːt bʌt təˈdeɪ hiːz ˈwɛərɪŋ dʒiːnz/",
        focusSound: "Contrasting rhythm and tense markers",
        difficulty: "Easy"
      },
      {
        id: "a1-psc-p2",
        text: "Do you know the answer to this question?",
        phoneticHints: "/duː juː noʊ ði ˈænsər tuː ðɪs ˈkwɛstʃən/",
        focusSound: "Stative verb clarity /noʊ/",
        difficulty: "Easy"
      }
    ],
    quiz: [
      {
        id: "a1-psc-q1",
        type: "multiple-choice",
        question: "I ___ to school every day by bicycle.",
        options: ["go", "am going", "goes", "is going"],
        correctAnswer: "go",
        explanation: "'Every day' indicates a regular routine, so we use Present Simple: 'I go'.",
        hint: "'Every day' = routine."
      },
      {
        id: "a1-psc-q2",
        type: "multiple-choice",
        question: "Be quiet! The teacher ___ the rules.",
        options: ["is explaining", "explains", "explain", "are explaining"],
        correctAnswer: "is explaining",
        explanation: "'Be quiet!' signals an action happening right now -> 'is explaining'.",
        hint: "Action happening at this moment."
      },
      {
        id: "a1-psc-q3",
        type: "multiple-choice",
        question: "I ___ the answer to your question right now.",
        options: ["know", "am knowing", "knows", "am know"],
        correctAnswer: "know",
        explanation: "'Know' is a state/mental verb and is never used in continuous -ing form.",
        hint: "'Know' is a stative verb."
      },
      {
        id: "a1-psc-q4",
        type: "multiple-choice",
        question: "Tom usually ___ tennis on Sundays, but today he ___ golf.",
        options: [
          "plays / is playing",
          "is playing / plays",
          "plays / plays",
          "is playing / is playing"
        ],
        correctAnswer: "plays / is playing",
        explanation: "'Usually' takes present simple (plays); 'today' takes present continuous (is playing).",
        hint: "Routine vs today's exception."
      },
      {
        id: "a1-psc-q5",
        type: "fill-in-blank",
        question: "She ___ (want) an ice cream cone right now.",
        options: ["wants", "is wanting", "want", "are wanting"],
        correctAnswer: "wants",
        explanation: "'Want' is a stative verb; use present simple 'wants'.",
        hint: "Stative verb: no -ing."
      },
      {
        id: "a1-psc-q6",
        type: "multiple-choice",
        question: "Where is Liam? He ___ his homework in his room.",
        options: ["is doing", "does", "do", "doing"],
        correctAnswer: "is doing",
        explanation: "Where is he right now? He is doing his homework right now.",
        hint: "Action in progress right now."
      },
      {
        id: "a1-psc-q7",
        type: "sentence-order",
        question: "Arrange into a correct sentence:",
        correctAnswer: ["Water", "boils", "at", "100", "degrees", "Celsius", "."],
        explanation: "Scientific facts and universal truths always use Present Simple.",
        hint: "Universal scientific fact."
      },
      {
        id: "a1-psc-q8",
        type: "multiple-choice",
        question: "___ you ___ what this word means?",
        options: [
          "Do / understand",
          "Are / understanding",
          "Do / understands",
          "Is / understand"
        ],
        correctAnswer: "Do / understand",
        explanation: "'Understand' is a stative verb, so we ask 'Do you understand?'.",
        hint: "'Understand' does not take -ing."
      },
      {
        id: "a1-psc-q9",
        type: "multiple-choice",
        question: "Look! That man ___ to open your car door!",
        options: ["is trying", "tries", "try", "is try"],
        correctAnswer: "is trying",
        explanation: "'Look!' indicates an event happening right at this moment -> 'is trying'.",
        hint: "Happening right now."
      },
      {
        id: "a1-psc-q10",
        type: "multiple-choice",
        question: "Cats ___ milk and fish.",
        options: ["like", "are liking", "likes", "is liking"],
        correctAnswer: "like",
        explanation: "'Like' is a stative verb expressing preference, so use simple plural 'like'.",
        hint: "'Like' is a stative verb."
      },
      {
        id: "a1-psc-q11",
        type: "fill-in-blank",
        question: "Why ___ (you / look) at me like that? Is something wrong?",
        options: ["are you looking", "do you look", "you are looking", "are you look"],
        correctAnswer: "are you looking",
        explanation: "Looking right now -> 'are you looking'.",
        hint: "Happening at this moment."
      },
      {
        id: "a1-psc-q12",
        type: "sentence-order",
        question: "Arrange into a correct sentence:",
        correctAnswer: ["My", "sister", "never", "drinks", "soda", "."],
        explanation: "Subject (My sister) + frequency adverb (never) + verb (drinks) + object (soda).",
        hint: "Start with 'My sister'."
      },
      {
        id: "a1-psc-q13",
        type: "multiple-choice",
        question: "What language ___ they ___ right now?",
        options: ["are / speaking", "do / speak", "is / speaking", "are / speak"],
        correctAnswer: "are / speaking",
        explanation: "'Right now' requires Present Continuous with plural 'they' -> 'are they speaking'.",
        hint: "'Right now' = continuous."
      },
      {
        id: "a1-psc-q14",
        type: "multiple-choice",
        question: "I ___ this heavy bag. Could you help me?",
        options: ["hate", "am hating", "hates", "am hate"],
        correctAnswer: "hate",
        explanation: "'Hate' is an emotion/stative verb and takes Present Simple: 'I hate'.",
        hint: "Stative emotion verb."
      },
      {
        id: "a1-psc-q15",
        type: "multiple-choice",
        question: "Jack ___ in London, but this month he ___ in Madrid on a project.",
        options: [
          "lives / is working",
          "is living / works",
          "lives / works",
          "is living / is working"
        ],
        correctAnswer: "lives / is working",
        explanation: "Permanent residence uses Present Simple ('lives'); temporary assignment uses Continuous ('is working').",
        hint: "Permanent vs temporary."
      },
      {
        id: "a1-psc-q16",
        type: "fill-in-blank",
        question: "I ___ (need) your advice regarding this problem.",
        options: ["need", "am needing", "needs", "am need"],
        correctAnswer: "need",
        explanation: "'Need' is a stative verb, so we use 'need'.",
        hint: "Stative verb."
      },
      {
        id: "a1-psc-q17",
        type: "sentence-order",
        question: "Arrange into a correct negative sentence:",
        correctAnswer: ["He", "does", "not", "remember", "my", "name", "."],
        explanation: "'Remember' is a stative mental verb; negative present simple is 'does not remember'.",
        hint: "Start with 'He'."
      },
      {
        id: "a1-psc-q18",
        type: "multiple-choice",
        question: "How often ___ you ___ your grandparents?",
        options: ["do / visit", "are / visiting", "does / visit", "are / visit"],
        correctAnswer: "do / visit",
        explanation: "'How often' asks about frequency and routines, which uses Present Simple: 'do you visit'.",
        hint: "'How often' = frequency routine."
      },
      {
        id: "a1-psc-q19",
        type: "multiple-choice",
        question: "Which of the following sentences is INCORRECT?",
        options: [
          "I am believing in hard work.",
          "I believe in hard work.",
          "She is listening to music.",
          "They eat dinner at 7 PM."
        ],
        correctAnswer: "I am believing in hard work.",
        explanation: "'Believe' is a stative verb and cannot be used in continuous tense.",
        hint: "'Believe' is stative."
      },
      {
        id: "a1-psc-q20",
        type: "multiple-choice",
        question: "Listen! The birds ___ in the trees.",
        options: ["are singing", "sing", "sings", "is singing"],
        correctAnswer: "are singing",
        explanation: "'Listen!' signals an event currently happening, and 'birds' is plural -> 'are singing'.",
        hint: "Plural subject + happening now."
      }
    ]
  },

  // ================= 5. HAVE GOT =================
  {
    id: "a1-have-got",
    title: "A1 Have got",
    level: "A1",
    category: "Grammar",
    description: "Express possession, physical features, and relationships with have got / has got, negatives, and questions.",
    estimatedMinutes: 10,
    iconName: "Briefcase",
    isMandatoryForAdvance: true,
    overview: {
      explanation: "'Have got' and 'has got' are used, especially in British and international English, to talk about possession, physical appearance, illnesses, and relationships.",
      rules: [
        "Positive: I/you/we/they have got ('ve got); He/she/it has got ('s got).",
        "Negative: I/you/we/they haven't got; He/she/it hasn't got.",
        "Questions: Have you got...? / Has he got...?",
        "Short answers: Yes, I have. / No, I haven't. (Do NOT include 'got' in short answers)."
      ],
      examples: [
        { sentence: "I have got a new laptop for my studies.", note: "Positive possession with 'have got'" },
        { sentence: "She hasn't got any sisters; she has got two brothers.", note: "Negative and positive with 'has got'" },
        { sentence: "Have you got a pen I can borrow?", note: "Question form" }
      ],
      commonMistakes: [
        { wrong: "Has you got a car?", correct: "Have you got a car?", reason: "'You' takes 'have', not 'has'." },
        { wrong: "Yes, I have got.", correct: "Yes, I have.", reason: "In short answers, we do not repeat 'got'." }
      ]
    },
    pronunciationSentences: [
      {
        id: "a1-hg-p1",
        text: "I've got two tickets for the concert tonight.",
        phoneticHints: "/aɪv ɡɒt tuː ˈtɪkɪts fɔːr ðə ˈkɒnsərt təˈnaɪt/",
        focusSound: "Contraction /aɪv ɡɒt/",
        difficulty: "Easy"
      },
      {
        id: "a1-hg-p2",
        text: "Has she got blue eyes or green eyes?",
        phoneticHints: "/hæz ʃiː ɡɒt bluː aɪz ɔːr ɡriːn aɪz/",
        focusSound: "Question rhythm with 'Has she got'",
        difficulty: "Easy"
      }
    ],
    quiz: [
      {
        id: "a1-hg-q1",
        type: "multiple-choice",
        question: "I ___ a red sports car.",
        options: ["have got", "has got", "having got", "got have"],
        correctAnswer: "have got",
        explanation: "'I' takes 'have got' ('ve got) to express possession.",
        hint: "I + have got."
      },
      {
        id: "a1-hg-q2",
        type: "multiple-choice",
        question: "Oliver ___ three older sisters.",
        options: ["has got", "have got", "is got", "are got"],
        correctAnswer: "has got",
        explanation: "Oliver is singular (he), which takes 'has got' ('s got).",
        hint: "Oliver = he."
      },
      {
        id: "a1-hg-q3",
        type: "multiple-choice",
        question: "We ___ any milk left in the fridge.",
        options: ["haven't got", "hasn't got", "don't got", "aren't got"],
        correctAnswer: "haven't got",
        explanation: "Negative for 'we' is 'haven't got'.",
        hint: "We + haven't got."
      },
      {
        id: "a1-hg-q4",
        type: "multiple-choice",
        question: "___ you got a spare charger?",
        options: ["Have", "Has", "Do", "Are"],
        correctAnswer: "Have",
        explanation: "Questions with 'you' and 'got' start with 'Have'.",
        hint: "Have + you + got."
      },
      {
        id: "a1-hg-q5",
        type: "fill-in-blank",
        question: "She ___ (not / have got) a driving licence yet.",
        options: ["hasn't got", "haven't got", "doesn't got", "isn't got"],
        correctAnswer: "hasn't got",
        explanation: "'She' takes 'hasn't got'.",
        hint: "She + hasn't got."
      },
      {
        id: "a1-hg-q6",
        type: "sentence-order",
        question: "Arrange into a correct question:",
        correctAnswer: ["Has", "he", "got", "a", "pet", "dog", "?"],
        explanation: "Auxiliary (Has) + subject (he) + got + object (a pet dog) + ?",
        hint: "Start with 'Has'."
      },
      {
        id: "a1-hg-q7",
        type: "multiple-choice",
        question: "Have you got a headache?",
        options: [
          "Yes, I have.",
          "Yes, I have got.",
          "Yes, I do have got.",
          "Yes, I got."
        ],
        correctAnswer: "Yes, I have.",
        explanation: "In short answers, never include 'got': say 'Yes, I have.'",
        hint: "Do not include 'got' in short answers."
      },
      {
        id: "a1-hg-q8",
        type: "multiple-choice",
        question: "They ___ a lovely house with a large swimming pool.",
        options: ["'ve got", "'s got", "'re got", "'m got"],
        correctAnswer: "'ve got",
        explanation: "'They've got' is the contraction of 'They have got'.",
        hint: "They + 've got."
      },
      {
        id: "a1-hg-q9",
        type: "multiple-choice",
        question: "My cat ___ beautiful green eyes.",
        options: ["has got", "have got", "is having got", "got has"],
        correctAnswer: "has got",
        explanation: "'My cat' is singular (it), so it takes 'has got'.",
        hint: "Singular animal = has got."
      },
      {
        id: "a1-hg-q10",
        type: "fill-in-blank",
        question: "___ (Has/Have) your parents got a holiday house?",
        options: ["Have", "Has", "Do", "Are"],
        correctAnswer: "Have",
        explanation: "'Your parents' is plural (they), requiring 'Have'.",
        hint: "Plural subject."
      },
      {
        id: "a1-hg-q11",
        type: "sentence-order",
        question: "Arrange into a positive statement:",
        correctAnswer: ["I", "have", "got", "a", "lot", "of", "homework", "."],
        explanation: "Subject (I) + have got + object (a lot of homework).",
        hint: "Start with 'I'."
      },
      {
        id: "a1-hg-q12",
        type: "multiple-choice",
        question: "Choose the correct negative sentence:",
        options: [
          "He hasn't got enough money for the ticket.",
          "He haven't got enough money for the ticket.",
          "He not has got enough money for the ticket.",
          "He doesn't has got enough money for the ticket."
        ],
        correctAnswer: "He hasn't got enough money for the ticket.",
        explanation: "'He' takes 'hasn't got'.",
        hint: "He + hasn't got."
      },
      {
        id: "a1-hg-q13",
        type: "multiple-choice",
        question: "Has Sarah got blonde hair?",
        options: [
          "No, she hasn't.",
          "No, she haven't.",
          "No, she doesn't got.",
          "No, she not."
        ],
        correctAnswer: "No, she hasn't.",
        explanation: "Negative short answer with 'Has' is 'No, she hasn't.'",
        hint: "Match 'Has'."
      },
      {
        id: "a1-hg-q14",
        type: "multiple-choice",
        question: "What kind of car ___ they got?",
        options: ["have", "has", "do", "are"],
        correctAnswer: "have",
        explanation: "'They' takes 'have': 'What kind of car have they got?'.",
        hint: "Auxiliary for 'they'."
      },
      {
        id: "a1-hg-q15",
        type: "fill-in-blank",
        question: "I ___ (not / have got) time to talk right now.",
        options: ["haven't got", "hasn't got", "not have got", "don't got"],
        correctAnswer: "haven't got",
        explanation: "Negative for 'I' is 'haven't got'.",
        hint: "I + haven't got."
      },
      {
        id: "a1-hg-q16",
        type: "sentence-order",
        question: "Arrange into a correct negative sentence:",
        correctAnswer: ["We", "haven't", "got", "any", "plans", "for", "tonight", "."],
        explanation: "Subject (We) + haven't got + object (any plans for tonight).",
        hint: "Start with 'We'."
      },
      {
        id: "a1-hg-q17",
        type: "multiple-choice",
        question: "Which of the following is equivalent to 'She has a cold'?",
        options: [
          "She's got a cold.",
          "She're got a cold.",
          "She've got a cold.",
          "She having a cold."
        ],
        correctAnswer: "She's got a cold.",
        explanation: "'She's got' = 'She has got', commonly used for illnesses.",
        hint: "Contraction for 'She has got'."
      },
      {
        id: "a1-hg-q18",
        type: "multiple-choice",
        question: "How many cousins ___ you got?",
        options: ["have", "has", "are", "do"],
        correctAnswer: "have",
        explanation: "Question with 'you' and 'got' uses 'have'.",
        hint: "Have + you + got."
      },
      {
        id: "a1-hg-q19",
        type: "multiple-choice",
        question: "The hotel room ___ got a balcony overlooking the sea.",
        options: ["has", "have", "is", "was"],
        correctAnswer: "has",
        explanation: "'The hotel room' is singular (it), so use 'has got'.",
        hint: "The room = it -> has."
      },
      {
        id: "a1-hg-q20",
        type: "multiple-choice",
        question: "Which sentence is INCORRECT?",
        options: [
          "You has got a great smile.",
          "You have got a great smile.",
          "He hasn't got any money.",
          "Have they got the tickets?"
        ],
        correctAnswer: "You has got a great smile.",
        explanation: "'You' must take 'have got', never 'has got'.",
        hint: "Find the mismatch with 'You'."
      }
    ]
  },

  // ================= 6. WAS / WERE: PAST SIMPLE OF 'BE' =================
  {
    id: "a1-past-was-were",
    title: "A1 Was/were: Past simple of ‘be’",
    level: "A1",
    category: "Grammar",
    description: "Use was and were for past states, locations, feelings, ages, negatives (wasn't, weren't), and questions.",
    estimatedMinutes: 10,
    iconName: "History",
    isMandatoryForAdvance: true,
    overview: {
      explanation: "'Was' and 'were' are the past simple forms of the verb 'to be'.",
      rules: [
        "Use 'was' with I, he, she, it and singular subjects (e.g. 'I was tired', 'The movie was exciting').",
        "Use 'were' with you, we, they and plural subjects (e.g. 'We were in Italy', 'They were late').",
        "Negatives: was not (wasn't), were not (weren't).",
        "Questions: Invert verb and subject (e.g. 'Were you at home yesterday?', 'Where was she?').",
        "Time markers: yesterday, last night, last week, in 2020, two days ago."
      ],
      examples: [
        { sentence: "I was at the library yesterday afternoon.", note: "Past location with 'was'" },
        { sentence: "They weren't happy with the exam results.", note: "Negative plural with 'weren't'" },
        { sentence: "Was the weather good during your holiday?", note: "Past question with 'Was'" }
      ],
      commonMistakes: [
        { wrong: "We was at the beach yesterday.", correct: "We were at the beach yesterday.", reason: "'We' is plural and takes 'were'." },
        { wrong: "I weren't at home.", correct: "I wasn't at home.", reason: "'I' takes 'wasn't'." }
      ]
    },
    pronunciationSentences: [
      {
        id: "a1-ww-p1",
        text: "I was at home last night, but my friends were out.",
        phoneticHints: "/aɪ wəz ət hoʊm læst naɪt bʌt maɪ frɛndz wɜːr aʊt/",
        focusSound: "Weak forms of /wəz/ and /wər/",
        difficulty: "Easy"
      },
      {
        id: "a1-ww-p2",
        text: "Were you surprised by the news yesterday?",
        phoneticHints: "/wər juː sərˈpraɪzd baɪ ðə njuːz ˈjɛstərdeɪ/",
        focusSound: "Question intonation with 'Were you'",
        difficulty: "Easy"
      }
    ],
    quiz: [
      {
        id: "a1-ww-q1",
        type: "multiple-choice",
        question: "Yesterday, I ___ very tired after work.",
        options: ["was", "were", "am", "is"],
        correctAnswer: "was",
        explanation: "'I' takes 'was' in the past simple.",
        hint: "I + was."
      },
      {
        id: "a1-ww-q2",
        type: "multiple-choice",
        question: "Where ___ you last night at 9 PM?",
        options: ["were", "was", "are", "did"],
        correctAnswer: "were",
        explanation: "'You' always takes 'were' in the past simple.",
        hint: "You + were."
      },
      {
        id: "a1-ww-q3",
        type: "multiple-choice",
        question: "The concert ___ amazing! Everyone loved it.",
        options: ["was", "were", "is", "are"],
        correctAnswer: "was",
        explanation: "'The concert' is singular (it), so use 'was'.",
        hint: "Singular event = was."
      },
      {
        id: "a1-ww-q4",
        type: "fill-in-blank",
        question: "They ___ (not be) at the party on Saturday.",
        options: ["weren't", "wasn't", "aren't", "didn't be"],
        correctAnswer: "weren't",
        explanation: "'They' takes 'weren't' (were not).",
        hint: "They + weren't."
      },
      {
        id: "a1-ww-q5",
        type: "multiple-choice",
        question: "___ your father born in Spain or Italy?",
        options: ["Was", "Were", "Did", "Is"],
        correctAnswer: "Was",
        explanation: "'Your father' is singular (he) -> 'Was your father born...?'",
        hint: "Your father = he."
      },
      {
        id: "a1-ww-q6",
        type: "sentence-order",
        question: "Arrange into a correct past sentence:",
        correctAnswer: ["We", "were", "very", "busy", "all", "day", "yesterday", "."],
        explanation: "Subject (We) + were + adjective phrase (very busy) + time phrase (all day yesterday).",
        hint: "Start with 'We'."
      },
      {
        id: "a1-ww-q7",
        type: "multiple-choice",
        question: "Was the exam difficult?",
        options: [
          "No, it wasn't.",
          "No, it weren't.",
          "No, it didn't.",
          "No, it not was."
        ],
        correctAnswer: "No, it wasn't.",
        explanation: "'It' takes 'wasn't' in negative short answers.",
        hint: "Match 'Was'."
      },
      {
        id: "a1-ww-q8",
        type: "multiple-choice",
        question: "The streets ___ completely empty at midnight.",
        options: ["were", "was", "is", "are"],
        correctAnswer: "were",
        explanation: "'The streets' is plural (they), requiring 'were'.",
        hint: "Plural subject."
      },
      {
        id: "a1-ww-q9",
        type: "multiple-choice",
        question: "I ___ (not be) hungry, so I didn't eat dinner.",
        options: ["wasn't", "weren't", "didn't", "not was"],
        correctAnswer: "wasn't",
        explanation: "'I' takes 'wasn't' (was not).",
        hint: "I + wasn't."
      },
      {
        id: "a1-ww-q10",
        type: "fill-in-blank",
        question: "Why ___ you late for class this morning?",
        options: ["were", "was", "did", "are"],
        correctAnswer: "were",
        explanation: "Question with 'you' takes 'were': 'Why were you late?'.",
        hint: "Were + you."
      },
      {
        id: "a1-ww-q11",
        type: "sentence-order",
        question: "Arrange into a question:",
        correctAnswer: ["Where", "were", "you", "born", "?"],
        explanation: "Question word (Where) + were + subject (you) + born + ?",
        hint: "Start with 'Where'."
      },
      {
        id: "a1-ww-q12",
        type: "multiple-choice",
        question: "Shakespeare ___ a famous English playwright.",
        options: ["was", "were", "is", "did"],
        correctAnswer: "was",
        explanation: "Shakespeare is a singular historical figure (he) -> 'was'.",
        hint: "Singular person = was."
      },
      {
        id: "a1-ww-q13",
        type: "multiple-choice",
        question: "Were your friends with you at the cinema?",
        options: [
          "Yes, they were.",
          "Yes, they was.",
          "Yes, they did.",
          "Yes, they were with."
        ],
        correctAnswer: "Yes, they were.",
        explanation: "Short affirmative answer with 'they' is 'Yes, they were.'",
        hint: "Match 'Were'."
      },
      {
        id: "a1-ww-q14",
        type: "multiple-choice",
        question: "The weather ___ very cold during our trip to Norway.",
        options: ["was", "were", "is", "did be"],
        correctAnswer: "was",
        explanation: "'The weather' is uncountable singular (it) -> 'was'.",
        hint: "Weather = it."
      },
      {
        id: "a1-ww-q15",
        type: "fill-in-blank",
        question: "My keys ___ (be) on the kitchen table five minutes ago.",
        options: ["were", "was", "are", "have been"],
        correctAnswer: "were",
        explanation: "'My keys' is plural (they), requiring 'were'.",
        hint: "Keys = plural."
      },
      {
        id: "a1-ww-q16",
        type: "sentence-order",
        question: "Arrange into a negative sentence:",
        correctAnswer: ["The", "hotel", "wasn't", "very", "clean", "."],
        explanation: "Subject (The hotel) + wasn't + adjective phrase (very clean).",
        hint: "Start with 'The hotel'."
      },
      {
        id: "a1-ww-q17",
        type: "multiple-choice",
        question: "___ you and Anna at the gym yesterday?",
        options: ["Were", "Was", "Did", "Are"],
        correctAnswer: "Were",
        explanation: "'You and Anna' is plural (you two / they) -> 'Were'.",
        hint: "Plural subject."
      },
      {
        id: "a1-ww-q18",
        type: "multiple-choice",
        question: "When I ___ a child, we had two dogs.",
        options: ["was", "were", "am", "did be"],
        correctAnswer: "was",
        explanation: "'When I was a child' is standard past form for 'I'.",
        hint: "I + was."
      },
      {
        id: "a1-ww-q19",
        type: "multiple-choice",
        question: "The shop ___ open yesterday because it was a public holiday.",
        options: ["wasn't", "weren't", "isn't", "didn't"],
        correctAnswer: "wasn't",
        explanation: "'The shop' is singular (it) -> 'wasn't'.",
        hint: "The shop = it."
      },
      {
        id: "a1-ww-q20",
        type: "multiple-choice",
        question: "Which sentence is INCORRECT?",
        options: [
          "They was at the museum.",
          "They were at the museum.",
          "She was at work.",
          "I was at home."
        ],
        correctAnswer: "They was at the museum.",
        explanation: "'They' must take 'were', not 'was'.",
        hint: "Identify the plural mismatch."
      }
    ]
  },

  // ================= 7. PAST SIMPLE: REGULAR / IRREGULAR VERBS =================
  {
    id: "a1-past-simple-verbs",
    title: "A1 Past simple: Regular/irregular verbs",
    level: "A1",
    category: "Grammar",
    description: "Learn past simple forms of regular verbs (-ed) and high-frequency irregular verbs (went, saw, bought, had).",
    estimatedMinutes: 12,
    iconName: "FileText",
    isMandatoryForAdvance: true,
    overview: {
      explanation: "Use Past Simple to describe completed actions that happened at a specific time in the past.",
      rules: [
        "Regular verbs: Add -ed (walk -> walked), -d if ending in 'e' (live -> lived), -ied if ending in consonant+y (study -> studied). Double the consonant for short CVC verbs (stop -> stopped).",
        "Irregular verbs: Must be memorized as they change form (go -> went, see -> saw, buy -> bought, have -> had, come -> came, eat -> ate, write -> wrote, make -> made)."
      ],
      examples: [
        { sentence: "I visited my grandparents last weekend.", note: "Regular verb ending in -ed" },
        { sentence: "He bought a new laptop yesterday.", note: "Irregular verb (buy -> bought)" },
        { sentence: "They went to Paris two years ago.", note: "Irregular verb (go -> went)" }
      ],
      commonMistakes: [
        { wrong: "I goed to the supermarket.", correct: "I went to the supermarket.", reason: "'Go' is irregular; the past simple is 'went'." },
        { wrong: "She buyed a dress.", correct: "She bought a dress.", reason: "'Buy' is irregular; the past simple is 'bought'." }
      ]
    },
    pronunciationSentences: [
      {
        id: "a1-pr-p1",
        text: "She walked to the park and called her friend.",
        phoneticHints: "/ʃiː wɔːkt tuː ðə pɑːrk ænd kɔːld hər frɛnd/",
        focusSound: "-ed pronunciation /t/ in 'walked' and /d/ in 'called'",
        difficulty: "Easy"
      },
      {
        id: "a1-pr-p2",
        text: "We ate dinner and saw a great movie.",
        phoneticHints: "/wiː eɪt ˈdɪnər ænd sɔː ə ɡreɪt ˈmuːvi/",
        focusSound: "Irregular past vowels /eɪt/ and /sɔː/",
        difficulty: "Easy"
      }
    ],
    quiz: [
      {
        id: "a1-pr-q1",
        type: "multiple-choice",
        question: "Last night, I ___ (watch) an interesting movie on Netflix.",
        options: ["watched", "watch", "watcht", "watching"],
        correctAnswer: "watched",
        explanation: "Regular verb 'watch' takes '-ed' -> 'watched'.",
        hint: "Add -ed."
      },
      {
        id: "a1-pr-q2",
        type: "multiple-choice",
        question: "Yesterday, Maria ___ (go) to the supermarket to buy groceries.",
        options: ["went", "goed", "gone", "goes"],
        correctAnswer: "went",
        explanation: "'Go' is an irregular verb with past simple 'went'.",
        hint: "Past of 'go' is irregular."
      },
      {
        id: "a1-pr-q3",
        type: "multiple-choice",
        question: "We ___ (have) a delicious Italian dinner yesterday evening.",
        options: ["had", "haved", "has", "having"],
        correctAnswer: "had",
        explanation: "The past simple of 'have' is 'had'.",
        hint: "Past of have."
      },
      {
        id: "a1-pr-q4",
        type: "multiple-choice",
        question: "He ___ (buy) a new smartphone last weekend.",
        options: ["bought", "buyed", "boughted", "buys"],
        correctAnswer: "bought",
        explanation: "The past simple of 'buy' is 'bought'.",
        hint: "buy -> bought."
      },
      {
        id: "a1-pr-q5",
        type: "fill-in-blank",
        question: "She ___ (study) hard for the English test last night.",
        options: ["studied", "studyed", "studyd", "studies"],
        correctAnswer: "studied",
        explanation: "Consonant + 'y' changes to '-ied' in the past simple -> 'studied'.",
        hint: "study -> studied."
      },
      {
        id: "a1-pr-q6",
        type: "sentence-order",
        question: "Arrange into a correct past sentence:",
        correctAnswer: ["They", "arrived", "at", "the", "airport", "on", "time", "."],
        explanation: "Subject (They) + verb (arrived) + place (at the airport) + time (on time).",
        hint: "Start with 'They'."
      },
      {
        id: "a1-pr-q7",
        type: "multiple-choice",
        question: "I ___ (see) my old school friend at the mall yesterday.",
        options: ["saw", "seed", "seen", "sawed"],
        correctAnswer: "saw",
        explanation: "The past simple of 'see' is 'saw'.",
        hint: "see -> saw."
      },
      {
        id: "a1-pr-q8",
        type: "multiple-choice",
        question: "The bus ___ (stop) suddenly in the middle of the street.",
        options: ["stopped", "stoped", "stopping", "stops"],
        correctAnswer: "stopped",
        explanation: "One-syllable consonant-vowel-consonant verbs double the final consonant -> 'stopped'.",
        hint: "Double the 'p'."
      },
      {
        id: "a1-pr-q9",
        type: "multiple-choice",
        question: "We ___ (eat) pizza and drank lemonade at the party.",
        options: ["ate", "eated", "eaten", "eats"],
        correctAnswer: "ate",
        explanation: "The past simple of 'eat' is 'ate'.",
        hint: "eat -> ate."
      },
      {
        id: "a1-pr-q10",
        type: "fill-in-blank",
        question: "He ___ (write) an email to his teacher yesterday.",
        options: ["wrote", "writed", "written", "writes"],
        correctAnswer: "wrote",
        explanation: "The past simple of 'write' is 'wrote'.",
        hint: "write -> wrote."
      },
      {
        id: "a1-pr-q11",
        type: "sentence-order",
        question: "Arrange into a correct past sentence:",
        correctAnswer: ["I", "lost", "my", "keys", "two", "days", "ago", "."],
        explanation: "Subject (I) + verb (lost) + object (my keys) + time phrase (two days ago).",
        hint: "Start with 'I'."
      },
      {
        id: "a1-pr-q12",
        type: "multiple-choice",
        question: "Sarah ___ (live) in Madrid for three years before moving to London.",
        options: ["lived", "liveed", "livd", "lives"],
        correctAnswer: "lived",
        explanation: "Verbs ending in 'e' simply add '-d' -> 'lived'.",
        hint: "Add -d."
      },
      {
        id: "a1-pr-q13",
        type: "multiple-choice",
        question: "What is the past simple form of 'take'?",
        options: ["took", "taked", "taken", "takes"],
        correctAnswer: "took",
        explanation: "The past simple of 'take' is 'took'.",
        hint: "take -> took."
      },
      {
        id: "a1-pr-q14",
        type: "multiple-choice",
        question: "They ___ (leave) the party very early last night.",
        options: ["left", "leaved", "leave", "leaving"],
        correctAnswer: "left",
        explanation: "The past simple of 'leave' is 'left'.",
        hint: "leave -> left."
      },
      {
        id: "a1-pr-q15",
        type: "fill-in-blank",
        question: "My mother ___ (make) a delicious chocolate cake for my birthday.",
        options: ["made", "maked", "make", "making"],
        correctAnswer: "made",
        explanation: "The past simple of 'make' is 'made'.",
        hint: "make -> made."
      },
      {
        id: "a1-pr-q16",
        type: "multiple-choice",
        question: "He ___ (come) to my house and we played video games.",
        options: ["came", "comed", "come", "coming"],
        correctAnswer: "came",
        explanation: "The past simple of 'come' is 'came'.",
        hint: "come -> came."
      },
      {
        id: "a1-pr-q17",
        type: "sentence-order",
        question: "Arrange into a correct past sentence:",
        correctAnswer: ["She", "paid", "for", "the", "coffee", "with", "cash", "."],
        explanation: "Subject (She) + past verb (paid) + prepositional phrase (for the coffee with cash).",
        hint: "Start with 'She'."
      },
      {
        id: "a1-pr-q18",
        type: "multiple-choice",
        question: "What is the past simple form of 'drink'?",
        options: ["drank", "drinked", "drunk", "drinks"],
        correctAnswer: "drank",
        explanation: "The past simple of 'drink' is 'drank'.",
        hint: "drink -> drank."
      },
      {
        id: "a1-pr-q19",
        type: "multiple-choice",
        question: "We ___ (meet) our new neighbours yesterday morning.",
        options: ["met", "meeted", "meet", "meeting"],
        correctAnswer: "met",
        explanation: "The past simple of 'meet' is 'met'.",
        hint: "meet -> met."
      },
      {
        id: "a1-pr-q20",
        type: "multiple-choice",
        question: "Which of the following contains an INCORRECT past verb?",
        options: [
          "He spended all his savings.",
          "He spent all his savings.",
          "She bought a new jacket.",
          "They went to the beach."
        ],
        correctAnswer: "He spended all his savings.",
        explanation: "'Spend' is irregular; its past simple form is 'spent', not 'spended'.",
        hint: "spend -> spent."
      }
    ]
  },

  // ================= 8. PAST SIMPLE: NEGATIVES AND QUESTIONS =================
  {
    id: "a1-past-simple-neg-questions",
    title: "A1 Past simple: Negatives and questions",
    level: "A1",
    category: "Grammar",
    description: "Master didn't + base verb, question form (Did you...?), question words (Where did you go?), and short answers.",
    estimatedMinutes: 10,
    iconName: "HelpCircle",
    isMandatoryForAdvance: true,
    overview: {
      explanation: "In Past Simple negatives and questions, we use the auxiliary 'did / didn't' with the base form of the main verb.",
      rules: [
        "Negative: Subject + did not (didn't) + BASE VERB (e.g. 'I didn't go', NOT 'I didn't went').",
        "Yes/No Questions: Did + subject + BASE VERB? (e.g. 'Did you see the movie?').",
        "Wh- Questions: Question word + did + subject + BASE VERB? (e.g. 'Where did you stay?').",
        "Short answers: Yes, I did. / No, I didn't."
      ],
      examples: [
        { sentence: "I didn't receive your email yesterday.", note: "Negative with 'didn't + base verb'" },
        { sentence: "Did you enjoy your trip to Italy?", note: "Question with 'Did + base verb'" },
        { sentence: "Where did they buy those shoes?", note: "Wh- question with 'did'" }
      ],
      commonMistakes: [
        { wrong: "I didn't saw him.", correct: "I didn't see him.", reason: "After 'didn't', the main verb must be in its base form ('see')." },
        { wrong: "Did you went to school?", correct: "Did you go to school?", reason: "After 'Did', use the base verb 'go'." }
      ]
    },
    pronunciationSentences: [
      {
        id: "a1-pnq-p1",
        text: "I didn't know about the meeting yesterday.",
        phoneticHints: "/aɪ ˈdɪdənt noʊ əˈbaʊt ðə ˈmiːtɪŋ ˈjɛstərdeɪ/",
        focusSound: "Contraction /dɪdənt/ and base verb",
        difficulty: "Easy"
      },
      {
        id: "a1-pnq-p2",
        text: "Did you have a good time at the party?",
        phoneticHints: "/dɪd juː hæv ə ɡʊd taɪm ət ðə ˈpɑːrti/",
        focusSound: "Linking 'Did you' -> /dɪdʒuː/",
        difficulty: "Easy"
      }
    ],
    quiz: [
      {
        id: "a1-pnq-q1",
        type: "multiple-choice",
        question: "I ___ (not go) to the gym yesterday because I was feeling unwell.",
        options: ["didn't go", "didn't went", "not went", "didn't gone"],
        correctAnswer: "didn't go",
        explanation: "After 'didn't', always use the base form of the verb: 'didn't go'.",
        hint: "didn't + base form."
      },
      {
        id: "a1-pnq-q2",
        type: "multiple-choice",
        question: "___ you finish the homework on time?",
        options: ["Did", "Do", "Were", "Have"],
        correctAnswer: "Did",
        explanation: "Past simple questions use the helping verb 'Did'.",
        hint: "Auxiliary for past questions."
      },
      {
        id: "a1-pnq-q3",
        type: "multiple-choice",
        question: "Where ___ you buy that lovely winter coat?",
        options: ["did", "do", "were", "have"],
        correctAnswer: "did",
        explanation: "Past wh- question structure: Where + did + subject + base verb.",
        hint: "Question auxiliary in past simple."
      },
      {
        id: "a1-pnq-q4",
        type: "fill-in-blank",
        question: "She ___ (not see) the traffic light turn red.",
        options: ["didn't see", "didn't saw", "not saw", "doesn't saw"],
        correctAnswer: "didn't see",
        explanation: "Use 'didn't + see' (base form).",
        hint: "didn't + base verb."
      },
      {
        id: "a1-pnq-q5",
        type: "sentence-order",
        question: "Arrange into a correct past question:",
        correctAnswer: ["What", "did", "you", "eat", "for", "breakfast", "?"],
        explanation: "Question word (What) + did + subject (you) + base verb (eat) + prepositional phrase (for breakfast) + ?",
        hint: "Start with 'What'."
      },
      {
        id: "a1-pnq-q6",
        type: "multiple-choice",
        question: "Did you enjoy the concert last night?",
        options: [
          "Yes, I did.",
          "Yes, I enjoyed.",
          "Yes, I do.",
          "Yes, I was."
        ],
        correctAnswer: "Yes, I did.",
        explanation: "Short answer to 'Did you...?' is 'Yes, I did.'",
        hint: "Match 'Did'."
      },
      {
        id: "a1-pnq-q7",
        type: "multiple-choice",
        question: "We ___ (not have) enough time to visit the museum.",
        options: ["didn't have", "didn't had", "not had", "hadn't"],
        correctAnswer: "didn't have",
        explanation: "Negative past simple of 'have' is 'didn't have'.",
        hint: "didn't + have."
      },
      {
        id: "a1-pnq-q8",
        type: "multiple-choice",
        question: "What time ___ the train arrive this morning?",
        options: ["did", "do", "does", "was"],
        correctAnswer: "did",
        explanation: "'This morning' indicates a past event, requiring 'did'.",
        hint: "Past time marker."
      },
      {
        id: "a1-pnq-q9",
        type: "fill-in-blank",
        question: "Why ___ (you / call) me so late last night?",
        options: ["did you call", "did you called", "you called", "were you call"],
        correctAnswer: "did you call",
        explanation: "Question word + did + subject + base verb: 'did you call'.",
        hint: "did + you + base verb."
      },
      {
        id: "a1-pnq-q10",
        type: "sentence-order",
        question: "Arrange into a negative past sentence:",
        correctAnswer: ["He", "didn't", "tell", "me", "the", "truth", "."],
        explanation: "Subject (He) + didn't + base verb (tell) + object (me the truth).",
        hint: "Start with 'He'."
      },
      {
        id: "a1-pnq-q11",
        type: "multiple-choice",
        question: "Did they win the football match yesterday?",
        options: [
          "No, they didn't.",
          "No, they don't.",
          "No, they weren't.",
          "No, they not won."
        ],
        correctAnswer: "No, they didn't.",
        explanation: "Negative short answer to 'Did they...?' is 'No, they didn't.'",
        hint: "Match 'Did'."
      },
      {
        id: "a1-pnq-q12",
        type: "multiple-choice",
        question: "Choose the correct sentence:",
        options: [
          "She didn't sleep well last night.",
          "She didn't slept well last night.",
          "She not slept well last night.",
          "She didn't sleeped well last night."
        ],
        correctAnswer: "She didn't sleep well last night.",
        explanation: "After 'didn't', the verb remains in base form: 'sleep'.",
        hint: "didn't + sleep."
      },
      {
        id: "a1-pnq-q13",
        type: "multiple-choice",
        question: "How ___ you get to the airport yesterday?",
        options: ["did", "do", "are", "were"],
        correctAnswer: "did",
        explanation: "Past question uses 'did': 'How did you get...?'",
        hint: "Past auxiliary."
      },
      {
        id: "a1-pnq-q14",
        type: "fill-in-blank",
        question: "I ___ (not understand) the teacher's explanation.",
        options: ["didn't understand", "didn't understood", "not understood", "don't understood"],
        correctAnswer: "didn't understand",
        explanation: "'didn't + understand' (base form).",
        hint: "didn't + base verb."
      },
      {
        id: "a1-pnq-q15",
        type: "sentence-order",
        question: "Arrange into a correct past question:",
        correctAnswer: ["Did", "you", "lock", "the", "front", "door", "?"],
        explanation: "Auxiliary (Did) + subject (you) + base verb (lock) + object (the front door) + ?",
        hint: "Start with 'Did'."
      },
      {
        id: "a1-pnq-q16",
        type: "multiple-choice",
        question: "Who ___ you meet at the conference yesterday?",
        options: ["did", "do", "were", "have"],
        correctAnswer: "did",
        explanation: "Who + did + you + meet (base form).",
        hint: "Who did you..."
      },
      {
        id: "a1-pnq-q17",
        type: "multiple-choice",
        question: "They ___ (not buy) the house because it was too expensive.",
        options: ["didn't buy", "didn't bought", "not bought", "haven't bought"],
        correctAnswer: "didn't buy",
        explanation: "Negative past simple is 'didn't buy'.",
        hint: "didn't + buy."
      },
      {
        id: "a1-pnq-q18",
        type: "multiple-choice",
        question: "Did your parents live in Canada?",
        options: [
          "Yes, they did.",
          "Yes, they lived.",
          "Yes, they do.",
          "Yes, they were."
        ],
        correctAnswer: "Yes, they did.",
        explanation: "Short answer with 'Did' is 'Yes, they did.'",
        hint: "Match 'Did'."
      },
      {
        id: "a1-pnq-q19",
        type: "sentence-order",
        question: "Arrange into a negative sentence:",
        correctAnswer: ["We", "didn't", "spend", "much", "money", "."],
        explanation: "Subject (We) + didn't + base verb (spend) + object (much money).",
        hint: "Start with 'We'."
      },
      {
        id: "a1-pnq-q20",
        type: "multiple-choice",
        question: "Which of the following contains a grammatical error?",
        options: [
          "Did you went to the store?",
          "Did you go to the store?",
          "I didn't hear the alarm.",
          "Where did she find her phone?"
        ],
        correctAnswer: "Did you went to the store?",
        explanation: "'Did you went' is incorrect; after 'Did', the verb must be base form 'go'.",
        hint: "Check the verb after 'Did'."
      }
    ]
  },

  // ================= 9. 'WILL' AND 'SHALL': FUTURE =================
  {
    id: "a1-future-will-shall",
    title: "A1 ‘Will’ and ‘shall’: Future",
    level: "A1",
    category: "Grammar",
    description: "Use will / won't for instant decisions, offers, promises, predictions, and shall for suggestions.",
    estimatedMinutes: 10,
    iconName: "Zap",
    isMandatoryForAdvance: true,
    overview: {
      explanation: "Use 'will' for spontaneous decisions made at the moment of speaking, predictions, promises, and offers. Use 'shall' for offers and suggestions with 'I' and 'we'.",
      rules: [
        "Positive: Subject + will ('ll) + BASE VERB (e.g. 'I'll help you', 'It will rain tomorrow').",
        "Negative: Subject + will not (won't) + BASE VERB (e.g. 'I won't forget').",
        "Questions: Will + subject + BASE VERB? (e.g. 'Will you come with us?').",
        "Shall: Used in questions with 'I' and 'we' for suggestions/offers (e.g. 'Shall I open the window?', 'Shall we dance?')."
      ],
      examples: [
        { sentence: "The phone is ringing. I'll answer it!", note: "Instant decision made right now" },
        { sentence: "Don't worry; I won't tell anyone your secret.", note: "Promise with 'won't'" },
        { sentence: "Shall we go for a walk in the park?", note: "Suggestion with 'Shall we'" }
      ],
      commonMistakes: [
        { wrong: "I will to help you.", correct: "I will help you.", reason: "After modal 'will', use the bare infinitive (no 'to')." },
        { wrong: "Shall he come with us?", correct: "Will he come with us?", reason: "'Shall' is only used with 'I' and 'we' in standard modern English." }
      ]
    },
    pronunciationSentences: [
      {
        id: "a1-ws-p1",
        text: "I'll call you as soon as I arrive.",
        phoneticHints: "/aɪl kɔːl juː æz suːn æz aɪ əˈraɪv/",
        focusSound: "Contraction /aɪl/ and linking",
        difficulty: "Easy"
      },
      {
        id: "a1-ws-p2",
        text: "Shall we stop for a cup of coffee?",
        phoneticHints: "/ʃæl wiː stɒp fɔːr ə kʌp əv ˈkɒfi/",
        focusSound: "Gentle suggestion tone /ʃæl wiː/",
        difficulty: "Easy"
      }
    ],
    quiz: [
      {
        id: "a1-ws-q1",
        type: "multiple-choice",
        question: "It's cold in here. I ___ close the window.",
        options: ["'ll", "'m", "'ve", "do"],
        correctAnswer: "'ll",
        explanation: "For an instant decision made at the moment of speaking, use 'will' / ''ll'.",
        hint: "Spontaneous decision = will."
      },
      {
        id: "a1-ws-q2",
        type: "multiple-choice",
        question: "Don't worry, Mum. I ___ forget to feed the cat.",
        options: ["won't", "willn't", "don't", "not will"],
        correctAnswer: "won't",
        explanation: "The negative contraction of 'will not' is 'won't'.",
        hint: "Contraction of will not."
      },
      {
        id: "a1-ws-q3",
        type: "multiple-choice",
        question: "___ we order a pizza for dinner tonight?",
        options: ["Shall", "Will", "Are", "Do"],
        correctAnswer: "Shall",
        explanation: "Use 'Shall we...?' to make a suggestion or offer.",
        hint: "Suggestion with 'we'."
      },
      {
        id: "a1-ws-q4",
        type: "fill-in-blank",
        question: "I promise I ___ (help) you with your luggage.",
        options: ["will help", "will to help", "am help", "help"],
        correctAnswer: "will help",
        explanation: "Promises use 'will + base verb' (no 'to').",
        hint: "will + base verb."
      },
      {
        id: "a1-ws-q5",
        type: "sentence-order",
        question: "Arrange into an offer:",
        correctAnswer: ["Shall", "I", "carry", "that", "heavy", "bag", "for", "you", "?"],
        explanation: "Offer formula: Shall I + base verb (carry) + object + prepositional phrase + ?",
        hint: "Start with 'Shall I'."
      },
      {
        id: "a1-ws-q6",
        type: "multiple-choice",
        question: "I think the weather ___ be sunny tomorrow.",
        options: ["will", "is", "shall", "does"],
        correctAnswer: "will",
        explanation: "Predictions with 'I think' typically use 'will'.",
        hint: "Prediction = will."
      },
      {
        id: "a1-ws-q7",
        type: "multiple-choice",
        question: "Will you come to my birthday party on Saturday?",
        options: [
          "Yes, I will.",
          "Yes, I'll.",
          "Yes, I do.",
          "Yes, I will come to."
        ],
        correctAnswer: "Yes, I will.",
        explanation: "Short affirmative answer is 'Yes, I will.' (Never contract in positive short answers).",
        hint: "Do not contract positive short answers."
      },
      {
        id: "a1-ws-q8",
        type: "multiple-choice",
        question: "___ I open the door for you?",
        options: ["Shall", "Will", "Do", "Are"],
        correctAnswer: "Shall",
        explanation: "Use 'Shall I...?' to offer assistance politely.",
        hint: "Polite offer."
      },
      {
        id: "a1-ws-q9",
        type: "fill-in-blank",
        question: "They ___ (not / attend) the meeting tomorrow because they are travelling.",
        options: ["won't attend", "willn't attend", "don't attend", "not will attend"],
        correctAnswer: "won't attend",
        explanation: "'will not' contracted is 'won't attend'.",
        hint: "will not -> won't."
      },
      {
        id: "a1-ws-q10",
        type: "sentence-order",
        question: "Arrange into a promise:",
        correctAnswer: ["I", "will", "always", "support", "you", "."],
        explanation: "Subject (I) + will + adverb (always) + base verb (support) + object (you).",
        hint: "Start with 'I'."
      },
      {
        id: "a1-ws-q11",
        type: "multiple-choice",
        question: "I haven't got any cash on me. — Don't worry, I ___ pay for lunch.",
        options: ["'ll", "'m", "'ve", "do"],
        correctAnswer: "'ll",
        explanation: "Instant decision made in response to new information -> 'I'll pay'.",
        hint: "Instant decision."
      },
      {
        id: "a1-ws-q12",
        type: "multiple-choice",
        question: "Which sentence is INCORRECT?",
        options: [
          "I will to see you tomorrow.",
          "I will see you tomorrow.",
          "I'll see you tomorrow.",
          "I won't be late."
        ],
        correctAnswer: "I will to see you tomorrow.",
        explanation: "Never use 'to' after modal verbs like 'will'.",
        hint: "No 'to' after will."
      },
      {
        id: "a1-ws-q13",
        type: "multiple-choice",
        question: "Where ___ we meet for the movie tonight?",
        options: ["shall", "are", "do", "have"],
        correctAnswer: "shall",
        explanation: "'Where shall we meet?' is the standard way to ask for a suggestion.",
        hint: "Suggestion with 'we'."
      },
      {
        id: "a1-ws-q14",
        type: "fill-in-blank",
        question: "I'm sure you ___ (pass) your driving test easily.",
        options: ["will pass", "pass", "are passing", "shall to pass"],
        correctAnswer: "will pass",
        explanation: "Predictions of certainty ('I'm sure') take 'will + base verb'.",
        hint: "will + pass."
      },
      {
        id: "a1-ws-q15",
        type: "sentence-order",
        question: "Arrange into a future question:",
        correctAnswer: ["Will", "they", "arrive", "before", "dinner", "?"],
        explanation: "Will + subject (they) + base verb (arrive) + time phrase (before dinner) + ?",
        hint: "Start with 'Will'."
      },
      {
        id: "a1-ws-q16",
        type: "multiple-choice",
        question: "Will it rain this afternoon?",
        options: [
          "No, it won't.",
          "No, it willn't.",
          "No, it doesn't.",
          "No, it isn't."
        ],
        correctAnswer: "No, it won't.",
        explanation: "Negative short answer to 'Will it...?' is 'No, it won't.'",
        hint: "Match 'Will'."
      },
      {
        id: "a1-ws-q17",
        type: "multiple-choice",
        question: "That box looks heavy! I ___ carry it for you.",
        options: ["will", "am", "do", "shall to"],
        correctAnswer: "will",
        explanation: "Offer made at the moment of speaking -> 'I will carry it'.",
        hint: "Offer = will."
      },
      {
        id: "a1-ws-q18",
        type: "multiple-choice",
        question: "___ we start the presentation now, or wait for everyone?",
        options: ["Shall", "Will", "Are", "Do"],
        correctAnswer: "Shall",
        explanation: "Making a suggestion to the group with 'we' -> 'Shall we start...?'",
        hint: "Shall we..."
      },
      {
        id: "a1-ws-q19",
        type: "sentence-order",
        question: "Arrange into a negative prediction:",
        correctAnswer: ["The", "exam", "won't", "be", "very", "difficult", "."],
        explanation: "Subject (The exam) + won't + base verb (be) + adjective phrase (very difficult).",
        hint: "Start with 'The exam'."
      },
      {
        id: "a1-ws-q20",
        type: "multiple-choice",
        question: "Which of the following sentences expresses an instant decision?",
        options: [
          "I'll have the grilled salmon, please.",
          "I am going to study law next year.",
          "I was eating when you called.",
          "I play tennis every Tuesday."
        ],
        correctAnswer: "I'll have the grilled salmon, please.",
        explanation: "Ordering food in a restaurant with 'I'll have...' is a classic instant decision.",
        hint: "Ordering food = instant decision with will."
      }
    ]
  },

  // ================= 10. BE GOING TO: PLANS AND PREDICTIONS =================
  {
    id: "a1-future-be-going-to",
    title: "A1 Be going to: Plans and predictions",
    level: "A1",
    category: "Grammar",
    description: "Express prior intentions, future plans, and predictions based on visible present evidence.",
    estimatedMinutes: 10,
    iconName: "Compass",
    isMandatoryForAdvance: true,
    overview: {
      explanation: "Use 'be going to' when you have already decided or planned to do something in the future, or when you can see present evidence that something is about to happen.",
      rules: [
        "Structure: Subject + am / is / are + going to + BASE VERB (e.g. 'I am going to travel to Japan').",
        "Predictions based on present evidence: 'Look at those black clouds! It is going to rain.'",
        "Negatives: Subject + am not / isn't / aren't + going to + BASE VERB.",
        "Questions: Am / Is / Are + subject + going to + BASE VERB? (e.g. 'Are you going to buy that car?')."
      ],
      examples: [
        { sentence: "I am going to study medicine at university next year.", note: "Pre-planned intention" },
        { sentence: "Watch out! You are going to drop that glass!", note: "Prediction based on immediate visual evidence" },
        { sentence: "Are they going to visit us this weekend?", note: "Question about future plans" }
      ],
      commonMistakes: [
        { wrong: "I am going to buying a new car.", correct: "I am going to buy a new car.", reason: "After 'going to', use the base verb (buy), not another -ing verb." },
        { wrong: "She going to visit her aunt.", correct: "She is going to visit her aunt.", reason: "Never omit the verb 'to be' (am/is/are) before 'going to'." }
      ]
    },
    pronunciationSentences: [
      {
        id: "a1-bgt-p1",
        text: "I'm going to learn how to drive this summer.",
        phoneticHints: "/aɪm ˈɡoʊɪŋ tuː lɜːrn haʊ tuː draɪv ðɪs ˈsʌmər/",
        focusSound: "Natural rhythm of 'going to' /ɡoʊɪŋ tuː/ or /ɡənə/",
        difficulty: "Easy"
      },
      {
        id: "a1-bgt-p2",
        text: "Look at those dark clouds; it's going to rain.",
        phoneticHints: "/lʊk ət ðoʊz dɑːrk klaʊdz ɪts ˈɡoʊɪŋ tuː reɪn/",
        focusSound: "Evidence prediction intonation",
        difficulty: "Easy"
      }
    ],
    quiz: [
      {
        id: "a1-bgt-q1",
        type: "multiple-choice",
        question: "Look at those dark grey clouds! It ___ rain.",
        options: ["is going to", "is going", "will to", "goes to"],
        correctAnswer: "is going to",
        explanation: "Predictions based on visible present evidence use 'is going to'.",
        hint: "Visual evidence = be going to."
      },
      {
        id: "a1-bgt-q2",
        type: "multiple-choice",
        question: "I ___ buy a new smartphone next week; I've already saved the money.",
        options: ["am going to", "going to", "am go to", "will to"],
        correctAnswer: "am going to",
        explanation: "A prior plan or intention uses 'am going to + base verb'.",
        hint: "I + am going to."
      },
      {
        id: "a1-bgt-q3",
        type: "multiple-choice",
        question: "___ you going to watch the football match tonight?",
        options: ["Are", "Is", "Do", "Will"],
        correctAnswer: "Are",
        explanation: "Questions with 'you' and 'going to' start with 'Are'.",
        hint: "Are + you + going to."
      },
      {
        id: "a1-bgt-q4",
        type: "fill-in-blank",
        question: "She ___ (not / travel) abroad this summer due to work.",
        options: ["isn't going to travel", "aren't going to travel", "not going to travel", "doesn't going to travel"],
        correctAnswer: "isn't going to travel",
        explanation: "'She' takes 'isn't going to + base verb (travel)'.",
        hint: "She + isn't going to."
      },
      {
        id: "a1-bgt-q5",
        type: "sentence-order",
        question: "Arrange into a plan statement:",
        correctAnswer: ["We", "are", "going", "to", "visit", "Rome", "next", "month", "."],
        explanation: "Subject (We) + are going to + base verb (visit) + place (Rome) + time (next month).",
        hint: "Start with 'We'."
      },
      {
        id: "a1-bgt-q6",
        type: "multiple-choice",
        question: "Careful! You ___ spill your hot tea!",
        options: ["are going to", "will to", "going to", "are go to"],
        correctAnswer: "are going to",
        explanation: "Immediate visual danger/evidence uses 'are going to'.",
        hint: "Immediate evidence."
      },
      {
        id: "a1-bgt-q7",
        type: "multiple-choice",
        question: "What ___ you going to do after you graduate?",
        options: ["are", "is", "do", "have"],
        correctAnswer: "are",
        explanation: "Wh- question with 'you': 'What are you going to do...?'.",
        hint: "Helping verb for 'you'."
      },
      {
        id: "a1-bgt-q8",
        type: "multiple-choice",
        question: "Is Lucas going to start his new job on Monday?",
        options: [
          "Yes, he is.",
          "Yes, he's.",
          "Yes, he does.",
          "Yes, he going."
        ],
        correctAnswer: "Yes, he is.",
        explanation: "Short affirmative answer to 'Is he...?' is 'Yes, he is.'",
        hint: "Do not contract in positive short answers."
      },
      {
        id: "a1-bgt-q9",
        type: "fill-in-blank",
        question: "They ___ (renovate) their kitchen next month.",
        options: ["are going to renovate", "is going to renovate", "going to renovate", "will to renovate"],
        correctAnswer: "are going to renovate",
        explanation: "'They' takes 'are going to + base verb'.",
        hint: "They + are going to."
      },
      {
        id: "a1-bgt-q10",
        type: "sentence-order",
        question: "Arrange into a question about future plans:",
        correctAnswer: ["Where", "are", "you", "going", "to", "stay", "in", "Paris", "?"],
        explanation: "Question word (Where) + are + subject (you) + going to + base verb (stay) + place (in Paris) + ?",
        hint: "Start with 'Where'."
      },
      {
        id: "a1-bgt-q11",
        type: "multiple-choice",
        question: "I ___ going to eat anything because I am not hungry.",
        options: ["'m not", "isn't", "aren't", "don't"],
        correctAnswer: "'m not",
        explanation: "'I'm not going to' is the negative for 'I'.",
        hint: "I + 'm not."
      },
      {
        id: "a1-bgt-q12",
        type: "multiple-choice",
        question: "Choose the correct sentence:",
        options: [
          "She is going to bake a chocolate cake.",
          "She is going to baking a chocolate cake.",
          "She going to bake a chocolate cake.",
          "She is go to bake a chocolate cake."
        ],
        correctAnswer: "She is going to bake a chocolate cake.",
        explanation: "Formula: 'is going to + base verb (bake)'.",
        hint: "is going to + base verb."
      },
      {
        id: "a1-bgt-q13",
        type: "multiple-choice",
        question: "Look at the runner in the lead! He ___ win the race!",
        options: ["is going to", "is go to", "going to", "will to"],
        correctAnswer: "is going to",
        explanation: "Prediction based on clear visible evidence in the present -> 'is going to win'.",
        hint: "Visible evidence."
      },
      {
        id: "a1-bgt-q14",
        type: "fill-in-blank",
        question: "We ___ (not / buy) that car; it is too expensive.",
        options: ["aren't going to buy", "isn't going to buy", "not going to buy", "don't going to buy"],
        correctAnswer: "aren't going to buy",
        explanation: "'We' takes 'aren't going to buy'.",
        hint: "We + aren't going to."
      },
      {
        id: "a1-bgt-q15",
        type: "sentence-order",
        question: "Arrange into a negative statement:",
        correctAnswer: ["He", "isn't", "going", "to", "attend", "the", "meeting", "."],
        explanation: "Subject (He) + isn't going to + base verb (attend) + object (the meeting).",
        hint: "Start with 'He'."
      },
      {
        id: "a1-bgt-q16",
        type: "multiple-choice",
        question: "Are your parents going to visit you this weekend?",
        options: [
          "No, they aren't.",
          "No, they don't.",
          "No, they not.",
          "No, they isn't."
        ],
        correctAnswer: "No, they aren't.",
        explanation: "Short negative answer to 'Are they...?' is 'No, they aren't.'",
        hint: "Match 'Are they'."
      },
      {
        id: "a1-bgt-q17",
        type: "multiple-choice",
        question: "He feels very dizzy. I think he ___ faint.",
        options: ["is going to", "going to", "will to", "is go to"],
        correctAnswer: "is going to",
        explanation: "Present symptom/evidence (feels dizzy) indicates an imminent event -> 'is going to faint'.",
        hint: "Evidence prediction."
      },
      {
        id: "a1-bgt-q18",
        type: "multiple-choice",
        question: "When ___ the film going to start?",
        options: ["is", "are", "does", "will"],
        correctAnswer: "is",
        explanation: "'The film' is singular (it), so use 'is': 'When is the film going to start?'.",
        hint: "The film = it."
      },
      {
        id: "a1-bgt-q19",
        type: "sentence-order",
        question: "Arrange into a question:",
        correctAnswer: ["Is", "she", "going", "to", "call", "you", "back", "?"],
        explanation: "Is + subject (she) + going to + base verb (call) + object + adverb (back) + ?",
        hint: "Start with 'Is'."
      },
      {
        id: "a1-bgt-q20",
        type: "multiple-choice",
        question: "Which of the following sentences expresses an intention planned before speaking?",
        options: [
          "I am going to spend my vacation in Greece next July.",
          "I'll have a glass of water, please.",
          "The phone is ringing; I'll get it.",
          "I was watching TV when he arrived."
        ],
        correctAnswer: "I am going to spend my vacation in Greece next July.",
        explanation: "'I am going to spend...' represents a planned vacation decided prior to the conversation.",
        hint: "Pre-planned intention."
      }
    ]
  }
];
