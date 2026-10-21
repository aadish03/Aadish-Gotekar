/**
 * Single source of truth for all résumé copy rendered on the site.
 *
 * Gallery photos live in `public/gallery/` (see `gallery[]` below). Portrait
 * (~4:5) crops best in the helix; landscape photos still work with `object-fit`.
 */

export const identity = {
  year: 2026,
  name: "Aadish A. Gotekar",
  shortName: "Aadish",
  role: "Forward Deployed AI Engineer",
  summary:
    "Forward Deployed Engineer building and shipping AI/ML systems for industrial and enterprise clients — LLM agents, RAG, computer vision and predictive analytics — with research experience in LLM knowledge distillation at IIT Patna and wins at Smart India Hackathon 2024.",
  positioning: ["AI / ML engineering", "Deep learning & data science", "Production delivery"],
  current: {
    role: "Forward Deployed Engineer, Tirumala Industries",
    focus: "LLM agents · RAG · computer vision · predictive analytics",
  },
  location: "Mumbai, India",
  email: "aadishgotekar03@gmail.com",
  phone: "+91-9021076478",
  phoneHref: "tel:+919021076478",
  links: {
    linkedin: "https://linkedin.com/in/aadishgotekar",
    github: "https://github.com/aadish03",
  },
  education: [
    {
      degree: "B.E. Computer Engineering",
      school: "University of Mumbai",
      period: "Oct 2022 — Jul 2026",
      detail: "CGPA 8.85",
    },
  ],
};

export type Experience = {
  org: string;
  role: string;
  period: string;
  location: string;
  kind: "research" | "industry" | "volunteer";
  current?: boolean;
  bullets: string[];
};

export const experience: Experience[] = [
  {
    org: "Tirumala Industries",
    role: "Forward Deployed Engineer",
    period: "May 2026 — Present",
    location: "Full-time",
    kind: "industry",
    current: true,
    bullets: [
      "Developing and deploying AI-driven solutions for manufacturing and industrial operations: process automation, predictive analytics, computer vision and operational optimisation.",
      "Integrated software with industrial machinery, sensors and production infrastructure to enable real-time monitoring across 30+ machines and data-driven decisions on the floor.",
      "Deployed predictive maintenance models that cut unplanned downtime by ~20% and a computer-vision inspection pipeline running at 95%+ defect-detection accuracy.",
      "Work directly with operations and management teams to find inefficiencies and ship technology that lifts productivity and resource utilisation.",
    ],
  },
  {
    org: "Scorg International",
    role: "Forward Deployed Engineer Intern",
    period: "Oct 2025 — Apr 2026",
    location: "Pune",
    kind: "industry",
    bullets: [
      "Delivered AI/ML solutions across 6+ enterprise client engagements: LLM applications, AI agents, RAG systems, NLP pipelines, predictive models and intelligent automation workflows.",
      "Designed end-to-end AI solutions — data processing, model experimentation, evaluation, inference, API integration and deployment — using modern ML and generative-AI frameworks.",
      "Improved RAG retrieval relevance by ~35% through chunking, hybrid search and evaluation harnesses; automation workflows cut manual processing time by up to 50%.",
      "Collaborated directly with client engineering teams to identify AI use cases, prototype in days rather than weeks, and integrate production-ready systems into existing enterprise workflows.",
    ],
  },
  {
    org: "IIT Patna",
    role: "AI Research Intern",
    period: "Apr 2025 — Sep 2025",
    location: "Remote",
    kind: "research",
    bullets: [
      "Researched knowledge distillation methods in large language models to optimize model efficiency.",
      "Explored teacher-to-student transfer techniques that preserve performance while shrinking models.",
      "Implemented and evaluated multiple distillation approaches, cutting inference time and compute costs by up to 15%.",
      "Contributed to “PQTO: Priority-Based QoS-Aware Task Offloading in 5G-MEC via Lightweight Classification Models”, under review at Springer Journal of Supercomputing.",
      "Contributed to “Adaptive Task Offloading in UAV-Assisted MEC Using Federated Mutual Knowledge Distillation”, under review at IEEE Transactions on Green Communications and Networking.",
    ],
  },
  {
    org: "TMG",
    role: "Frontend Developer",
    period: "Jan 2023 — Apr 2023",
    location: "Remote · US-based startup",
    kind: "industry",
    bullets: [
      "Built responsive React.js applications with 100% cross-browser compatibility.",
      "Designed state management with Redux and Context API, improving performance by up to 40%.",
    ],
  },
  {
    org: "Rajam Foundation",
    role: "Technical Expert (Volunteer)",
    period: "2023 — Present",
    location: "Chandrapur, Maharashtra",
    kind: "volunteer",
    bullets: [
      "Provide ongoing IT support and digital guidance for a mission centred on community forest rights and sustainability.",
      "Built digital communication infrastructure and data management systems that improved outreach and operations.",
    ],
  },
];

export type Project = {
  index: string;
  name: string;
  tagline: string;
  award: string;
  metric: { value: string; label: string };
  stack: string[];
  bullets: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    index: "01",
    name: "Dak",
    tagline: "Philatelic distribution system for India Post",
    award: "Smart India Hackathon 2024 — Winner",
    metric: { value: "65%", label: "resource efficiency gain" },
    stack: ["Next.js", "Tailwind", "Django", "PostgreSQL", "TensorFlow", "Celery", "BERT"],
    bullets: [
      "Priority algorithms improved resource efficiency 65%; analytics dashboard accelerated decisions 40%.",
      "Opened stamp access to 100,000+ users nationwide while cutting administrative costs 45% via automated inventory forecasting.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/aadish03" }],
  },
  {
    index: "02",
    name: "LegAIly",
    tagline: "AI legal assistant for research, translation and drafting",
    award: "Code4AI — Winner",
    metric: { value: "70%", label: "faster case research" },
    stack: ["React", "FastAPI", "Node.js", "Firebase", "LangChain", "GenAI"],
    bullets: [
      "Accelerates document translation, case research and drafting, reducing lawyers’ workload by 60%.",
      "NLP-driven search and summarisation cut case research time by 70%.",
      "Validated with lawyers across District, High Court and Supreme Court levels for legal accuracy.",
    ],
    links: [{ label: "Live", href: "#" }],
  },
  {
    index: "03",
    name: "ODOP",
    tagline: "One District One Product — AI forecasting & verification",
    award: "Hack4Change@Charcha 2024 — Winner",
    metric: { value: "SARIMA", label: "monthly sales forecasting" },
    stack: ["React Native", "Python", "TensorFlow", "OpenCV", "Django", "Celery"],
    bullets: [
      "Seasonal ARIMA models forecast monthly sales to predict raw material requirements.",
      "Document verification pipeline using k-means clustering and Tesseract OCR.",
      "Smart navigation chatbot plus a decision-tree classifier for hate-speech moderation.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/aadish03" }],
  },
  {
    index: "04",
    name: "BrainSync",
    tagline: "AI-powered collaborative learning platform",
    award: "B.E. final year · Team lead",
    metric: { value: "IJNRD", label: "technical paper published" },
    stack: ["React", "FastAPI", "PostgreSQL", "LangChain", "Python", "LLM"],
    bullets: [
      "Final-year group project: integrated YouTube video summarization, quiz generation, handwriting-to-PDF conversion, and an LLM-powered research assistant in one learning platform.",
      "Built AI workflows for video summarization and quiz generation, cutting manual study-material preparation time by up to 40% versus a manual workflow in tests.",
      "Led a 4-member team on system architecture and AI/ML pipelines; technical paper published in the International Journal of Novel Research and Development (IJNRD).",
    ],
    links: [{ label: "GitHub", href: "https://github.com/aadish03" }],
  },
];

export type Achievement = {
  title: string;
  host: string;
  scale: string;
  scaleValue: number;
  scaleUnit: string;
  year: string;
};

export const achievements: Achievement[] = [
  {
    title: "Smart India Hackathon 2024",
    host: "Government of India",
    scale: "86,000+ teams",
    scaleValue: 86000,
    scaleUnit: "teams",
    year: "2024",
  },
  {
    title: "MoveAI Hackathon",
    host: "Aptos · International",
    scale: "2,000+ teams",
    scaleValue: 2000,
    scaleUnit: "teams",
    year: "2024",
  },
  {
    title: "Hack4Change@Charcha",
    host: "Google × Hack2Skill",
    scale: "National",
    scaleValue: 0,
    scaleUnit: "",
    year: "2024",
  },
  {
    title: "Code4AI",
    host: "College-level",
    scale: "150+ teams",
    scaleValue: 150,
    scaleUnit: "teams",
    year: "2024",
  },
  {
    title: "SyntechXathon",
    host: "College-level",
    scale: "100+ teams",
    scaleValue: 100,
    scaleUnit: "teams",
    year: "2023",
  },
];

export const leadership = {
  title: "Vice President, DMX",
  detail:
    "Technical club with 100+ active members — organises regular hackathons and project opportunities for students.",
};

export type GalleryItem = {
  src: string;
  alt: string;
  event: string;
  year: string;
  caption: string;
};

export const gallery: GalleryItem[] = [
  {
    src: "/gallery/sih-2024-ceremony.png",
    alt: "Smart India Hackathon 2024 winner ceremony at St. Joseph's Institute of Technology",
    event: "Smart India Hackathon",
    year: "2024",
    caption: "SIH 2024 — winner among 86,000+ teams (Govt. of India)",
  },
  {
    src: "/gallery/sih-2024-winner.jpg",
    alt: "Team Hackstreet Hustlers holding the Smart India Hackathon 2024 winner cheque",
    event: "Smart India Hackathon",
    year: "2024",
    caption: "Grand finale — ₹1,00,000 winner cheque, SIH Software Edition",
  },
  {
    src: "/gallery/code4ai.png",
    alt: "Code4AI hackathon winner presentation at Rajiv Gandhi Institute of Technology, Mumbai",
    event: "Code4AI",
    year: "2024",
    caption: "Winner — DMX Code4AI, for LegAIly",
  },
  {
    src: "/gallery/hack4change-charcha.png",
    alt: "Hack4Change at Charcha award ceremony co-hosted by Google",
    event: "Hack4Change @ Charcha",
    year: "2024",
    caption: "2nd runner-up — Google × Hack2Skill × Charcha",
  },
  {
    src: "/gallery/moveai-gamefi.png",
    alt: "Move AI Hackathon Game-Fi track first place by Aptos Foundation",
    event: "Move AI Hackathon",
    year: "2024",
    caption: "1st place — GameFi track ($13,000), Aptos GameVerse",
  },
  {
    src: "/gallery/syntechxathon.png",
    alt: "SyntechXathon hackathon team photo",
    event: "SyntechXathon",
    year: "2024",
    caption: "Winner — college-level hackathon",
  },
  {
    src: "/gallery/legaily-mentorship.png",
    alt: "Supreme Court advocate presenting LegAIly certificate of excellence and mentorship",
    event: "LegAIly",
    year: "2024",
    caption: "Certificate of excellence — mentorship from a Supreme Court lawyer",
  },
];

export type Publication = {
  title: string;
  venue: string;
  status: "Published" | "Under review" | "Work in progress";
};

export const publications: Publication[] = [
  {
    title: "BrainSync: AI-Powered Collaborative Learning Platform",
    venue: "International Journal of Novel Research and Development (IJNRD)",
    status: "Published",
  },
  {
    title:
      "PQTO: Priority-Based QoS-Aware Task Offloading in 5G-MEC via Lightweight Classification Models",
    venue: "Springer Open Journal of Supercomputing",
    status: "Under review",
  },
  {
    title: "Adaptive Task Offloading in UAV-Assisted MEC Using Federated Mutual Knowledge Distillation",
    venue: "IEEE Transactions on Green Communications and Networking",
    status: "Under review",
  },
  {
    title:
      "Security in Model Context Protocol and LLM-Based Agents: A Comprehensive Review of Attacks, Defenses, and Future Directions",
    venue: "Survey",
    status: "Work in progress",
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["Java", "JavaScript", "TypeScript", "Python", "C#"],
  },
  {
    group: "Web",
    items: [
      "React",
      "Next.js",
      "Node.js",
      "Spring Boot",
      "TailwindCSS",
      "GraphQL",
      "Redux Toolkit",
    ],
  },
  {
    group: "Data",
    items: ["PostgreSQL", "MySQL", "MongoDB", "DynamoDB", "Kafka"],
  },
  {
    group: "ML / DL",
    items: [
      "PyTorch",
      "TensorFlow",
      "Keras",
      "scikit-learn",
      "XGBoost",
      "Hugging Face",
      "OpenCV",
      "spaCy",
    ],
  },
  {
    group: "MLOps",
    items: [
      "Docker",
      "Kubernetes",
      "Kubeflow",
      "MLflow",
      "Airflow",
      "BentoML",
      "Weights & Biases",
      "GitHub Actions",
    ],
  },
  {
    group: "Cloud & Chain",
    items: ["AWS", "GCP", "Azure", "Firebase", "Ethereum", "Hardhat"],
  },
];
