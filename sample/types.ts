export type Attachment = {
  title: string;
  file?: string;
  url?: string;
  type?: "pdf" | "zip" | "image" | "code" | "link" | string;
};

export type Lesson = {
  id: string;
  title: string;
  type?: "video" | "text" | "exercise";
  description?: string;
  video?: string; // YouTube ID, optional
  duration?: number;
  minWatchPercentage?: number; // Default 90%
  content?: string; // Markdown or HTML content, optional
  minScorePercentage?: number; // Default 80%
  exercise?: {
    type: "quiz" | "code";
    questions?: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    }[];
    initialCode?: string;
    solution?: string;
  };
  checklist?: string[]; // List of task strings
  attachments?: Attachment[]; // Downloadable media/files
};

export type Module = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  submissionUrl?: string;
  submissionDescription?: string;
  submissionAttachments?: Attachment[];
  lessons: Lesson[];
};
