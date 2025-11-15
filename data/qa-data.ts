export type QAItem = {
  id: number;
  category: string;
  question: string;
  answer: string;
  links?: string[];
  date?: string;
  keywords?: string[];
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

export const categories: Category[] = [
  {
    id: "application",
    name: "Application & Admission",
    icon: "📝",
    description: "Questions about applying to the design major",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    icon: "🎨",
    description: "Portfolio requirements and tips",
  },
  {
    id: "major",
    name: "Major Selection",
    icon: "🎓",
    description: "Choosing between VCD, IxD, and ID",
  },
  {
    id: "grade",
    name: "Grades & Requirements",
    icon: "📊",
    description: "GPA requirements and grading policies",
  },
  {
    id: "advising",
    name: "Academic Advising",
    icon: "💬",
    description: "Academic planning and advising resources",
  },
  {
    id: "project",
    name: "Projects & Assignments",
    icon: "✏️",
    description: "Course projects and deliverables",
  },
];

// Sample QA data extracted from the PDF - you can expand this
export const qaData: QAItem[] = [
  {
    id: 1,
    category: "application",
    question: "When will dates and times for the info sessions be released?",
    answer:
      "This and other admission information is available on the official website.",
    links: ["https://art.washington.edu/design/bachelor-design-admissions"],
    keywords: ["info session", "dates", "admission"],
  },
  {
    id: 2,
    category: "portfolio",
    question: "Are there any tips on how to organize project pages?",
    answer:
      "Follow the template provided. Use scale changes to have a 'hero' image and additional, smaller supporting imagery.",
    keywords: ["portfolio", "organization", "layout"],
  },
  {
    id: 3,
    category: "portfolio",
    question: "What are the most important things to showcase?",
    answer:
      "Process and output are most important. If you make revisions, explain what you did and why. Choose projects related to the major you'd like to apply for. Provide context for professors to understand what you're showing.",
    keywords: ["portfolio", "showcase", "process"],
  },
  {
    id: 4,
    category: "portfolio",
    question:
      "Should we focus on improving our past work, or should we focus more on additional designs/concepts?",
    answer:
      "Improving your 166 work is a great way to show continual learning. In design, there is a philosophy that a project is never done and can always be improved. You are required to have 5-10 work samples for the portfolio application. Often, students will invent projects to showcase their skills and interests.",
    links: ["https://art.washington.edu/design/bachelor-design-application"],
    keywords: ["portfolio", "improvement", "work samples"],
  },
  {
    id: 5,
    category: "major",
    question:
      "If someone were considering a career in creative direction, would IxD or VCD be more beneficial?",
    answer:
      "Any design major can lead to a creative direction role. Choose based on what you want to learn and your interests.",
    keywords: ["major choice", "creative direction", "IxD", "VCD"],
  },
  {
    id: 6,
    category: "major",
    question:
      "If I'm interested in VCD, do I have to be good at drawing? I have other skills like photography and graphics, but not so much drawing/sketching.",
    answer:
      "You have to be comfortable enough with drawing to communicate your intent through sketching, but you don't have to be amazing at it. See the 'napkin sketch' concept.",
    links: ["https://nedwin.medium.com/the-1-5m-napkin-abd2702927d0"],
    keywords: ["VCD", "drawing", "sketching", "skills"],
  },
  {
    id: 7,
    category: "grade",
    question: "How much will the final curve affect our grade?",
    answer:
      "These questions have been forwarded to Prof. Cheng. Look out for an email with specific information about the final curve.",
    keywords: ["grade", "curve", "final"],
  },
  {
    id: 8,
    category: "advising",
    question: "How do I get in contact with an academic advisor?",
    answer: "Visit the academic advising website to schedule an appointment.",
    links: ["https://art.washington.edu/advising"],
    keywords: ["advisor", "advising", "contact"],
  },
  {
    id: 9,
    category: "major",
    question: "Can these majors lead to positions beyond R&D?",
    answer:
      "Yes, a design degree is very versatile. Graduates can pursue roles like creative director, product owner, and many other positions.",
    keywords: ["career", "jobs", "opportunities"],
  },
  {
    id: 10,
    category: "application",
    question: "How many people from application to the major get in?",
    answer:
      "See statistics in Prof. Cheng's slides which provide acceptance rates and other admission data.",
    keywords: ["admission", "statistics", "acceptance rate"],
  },
  {
    id: 11,
    category: "portfolio",
    question:
      "What should I do if I don't have enough projects for a portfolio?",
    answer:
      "You are required to have 5-10 work samples. Students often invent projects to showcase their skills and interests. For example, if interested in Industrial Design, create sketches of furniture or objects. If interested in VCD, make a poster using skills from Project 1.",
    links: ["https://art.washington.edu/design/bachelor-design-application"],
    keywords: ["portfolio", "projects", "work samples"],
  },
  {
    id: 12,
    category: "major",
    question:
      "How do I understand how VCD classes will operate? What's the format?",
    answer:
      "VCD classes will follow the same pattern as DES166, including lectures and critique sessions.",
    keywords: ["VCD", "classes", "format"],
  },
  {
    id: 13,
    category: "advising",
    question:
      "I know IxD belongs to 'STEM' subjects with 3 years of OPT, does ID or VCD have 3 years OPT or only 1 year?",
    answer:
      "Consulting with an academic adviser can provide more detailed and specific information about OPT eligibility for different majors.",
    links: ["https://art.washington.edu/advising"],
    keywords: ["OPT", "international", "STEM", "visa"],
  },
  {
    id: 14,
    category: "project",
    question: "For our final submission, can we make a mockup for our idea?",
    answer:
      "You can, but it is not required. You are required to communicate the idea enough to convince someone that it should be mocked up and made.",
    keywords: ["project", "final", "mockup"],
  },
  {
    id: 15,
    category: "application",
    question: "How much time do you get to choose a major if you get a 3.7?",
    answer: "You have until June 30 to decide.",
    links: ["https://art.washington.edu/design/bachelor-design-application"],
    keywords: ["deadline", "3.7", "major choice"],
  },
];
