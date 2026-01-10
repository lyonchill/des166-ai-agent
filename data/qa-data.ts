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

// FAQ data has been removed - data was not clean
// System will now rely on course files (Markdown calendar) for answers
export const qaData: QAItem[] = [];
