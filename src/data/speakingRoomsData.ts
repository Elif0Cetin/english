import { PeerRoom } from "../types";

export const SPEAKING_ROOMS: PeerRoom[] = [
  {
    id: "room-cafe-chat",
    title: "☕ Coffee Shop Conversations & Weekend Plans",
    topic: "Daily Life & Weekend Plans",
    level: "B1",
    scenario: "You and your peer are hanging out at a vibrant coffee shop in Dublin, sharing your weekend plans, favorite local cafes, and music tastes.",
    activeParticipants: 4,
    maxParticipants: 6,
    partner: {
      name: "Sofia Martinez",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      country: "Spain",
      level: "B1",
      accent: "Warm European",
      bio: "Learning English to travel through Ireland and Scotland next month! Love photography and specialty latte art."
    },
    prompts: [
      "What do you usually do when you want to unwind on a Saturday afternoon?",
      "Have you found any quiet or cozy cafes in your city that you recommend?",
      "If you could travel anywhere next weekend for 48 hours, where would you go?"
    ],
    suggestedPhrases: [
      "I tend to spend my weekends...",
      "To be honest, what I really enjoy is...",
      "Have you ever visited...",
      "That sounds wonderful! In my experience..."
    ]
  },
  {
    id: "room-job-interview",
    title: "💼 Professional Interview & Career Goals",
    topic: "Work, Skills & Future Ambitions",
    level: "B1",
    scenario: "A simulated friendly mock interview practice session where you discuss your current role, key strengths, past projects, and career aspirations.",
    activeParticipants: 2,
    maxParticipants: 4,
    partner: {
      name: "Liam O'Connor",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      country: "Ireland",
      level: "B2",
      accent: "Irish Standard",
      bio: "Software developer and English conversation volunteer. Happy to help practice professional vocabulary and polite expressions."
    },
    prompts: [
      "Could you tell me a little bit about your current daily responsibilities or study focus?",
      "What is a recent challenge you solved at work or in a project?",
      "Where do you see your career heading in the next three to five years?"
    ],
    suggestedPhrases: [
      "I am primarily responsible for...",
      "One project I recently completed involved...",
      "My strongest skill is definitely...",
      "I'm eager to develop my expertise in..."
    ]
  },
  {
    id: "room-travel-tales",
    title: "✈️ Travel Stories & Cultural Differences",
    topic: "Travel, Culture & Food",
    level: "B1",
    scenario: "Exchanging unforgettable travel memories, culture shocks, and delicious regional dishes from your home country.",
    activeParticipants: 5,
    maxParticipants: 8,
    partner: {
      name: "Yuki Tanaka",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      country: "Japan",
      level: "B1",
      accent: "Tokyo English",
      bio: "Graphic designer who loves cooking international foods and hiking in national parks."
    },
    prompts: [
      "What was the most memorable trip you have ever taken, and why?",
      "Have you ever experienced a funny misunderstanding while travelling in another country?",
      "What is a traditional dish from your country that everyone must try?"
    ],
    suggestedPhrases: [
      "What struck me the most was...",
      "If you ever visit my hometown, you must try...",
      "I remember being really surprised when...",
      "The scenery was absolutely breathtaking."
    ]
  },
  {
    id: "room-debate-club",
    title: "🗣️ Friendly Debate: Remote Work vs Office Life",
    topic: "Modern Society & Technology",
    level: "B1",
    scenario: "A polite, constructive debate exchanging pros and cons of remote work, technology in education, and digital balance.",
    activeParticipants: 3,
    maxParticipants: 6,
    partner: {
      name: "Marco Rossi",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      country: "Italy",
      level: "B1",
      accent: "Italian English",
      bio: "Marketing specialist practicing English presentation and polite disagreement techniques."
    },
    prompts: [
      "In your opinion, what are the biggest benefits and drawbacks of working remotely?",
      "Do you think artificial intelligence will change the way languages are taught in the future?",
      "How do you maintain a healthy balance between screen time and real-world activities?"
    ],
    suggestedPhrases: [
      "I see your point, but on the other hand...",
      "From my perspective, the key advantage is...",
      "I'm not entirely convinced that...",
      "That is a valid argument, yet we should also consider..."
    ]
  }
];
