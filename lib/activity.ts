// Historical activities supplied by Michael on October 8, 2026.
// Dates, publication URLs, and award issuers have not been inferred.
export type ActivityEntry = {
  id: string;
  title: string;
  organization: string;
  summary: string;
  metrics: readonly { value: string; label: string }[];
  details: readonly string[];
  detailLabel: string;
  technologies?: readonly string[];
  paperTitle?: string;
};

export type ActivityChapter = {
  id: string;
  label: string;
  title: string;
  introduction: string;
  entries: readonly ActivityEntry[];
};

export const activityChapters: readonly ActivityChapter[] = [
  {
    id: "research",
    label: "Engineering research",
    title: "Engineering for independence.",
    introduction: "Earlier studies in assistive robotics, voice interfaces, and embedded systems.",
    entries: [
      {
        id: "assistive-robotic-dog",
        title: "Assistive Robotic Dog",
        organization: "Research with Professor Amodez Hern",
        paperTitle: "Walking Robot for Impaired People (Muscle Weakness)",
        summary: "Researched a multipurpose robotic dog intended to help visually impaired and older adults reach preset destinations while avoiding obstacles and traffic.",
        metrics: [
          { value: "16 / 537", label: "papers accepted at the workshop" },
          { value: "25", label: "research citations" },
        ],
        detailLabel: "Design & presentation honors",
        details: [
          "Designed voice command recognition and wake-up alarm features alongside navigation and obstacle avoidance.",
          "The paper was selected among 16 accepted submissions from 537 at the engineering workshop of the Cirrus & AI African Consortium.",
          "Selected as one of five oral presenters for a workshop attended by 1,500+ people.",
          "Earned first place in the presentation competition and the workshop honor named “Nobel Award.”",
        ],
        technologies: ["Robotics", "Voice commands", "Obstacle avoidance"],
      },
      {
        id: "voice-controlled-vehicle",
        title: "Voice-Controlled Assistive Vehicle",
        organization: "Presented at Google AI Ghana · West Africa",
        paperTitle: "Speech Recognition Robot with Ultrasonic Obstacle Avoidance System to Support Disabled People",
        summary: "Researched a robotic vehicle combining speech recognition, ultrasonic obstacle avoidance, and a human–computer interface to support people with disabilities.",
        metrics: [
          { value: "1st / 200", label: "submissions in my category" },
          { value: "$5,000", label: "grand prize" },
        ],
        detailLabel: "Control system & recognition",
        details: [
          "Designed spoken-command control for a person seated in the vehicle.",
          "Included remote operation from a base station using oral commands or a graphical interface when the user could not operate the vehicle directly.",
          "Presented the findings at Google AI Ghana, earning first place among 200 category submissions and the $5,000 grand prize.",
        ],
        technologies: ["Speech recognition", "Ultrasonic sensing", "HCI", "GUI"],
      },
      {
        id: "fingerprint-attendance",
        title: "Fingerprint-Based Attendance System",
        organization: "Research with Professor Aden Tim",
        paperTitle: "Design and Implementation of Fingerprint-Based Attendance System",
        summary: "Developed a handheld fingerprint attendance device using an ATmega1284 microcontroller, embedded programming, Python 3, and MySQL.",
        metrics: [
          { value: "150,000", label: "paper views on Top AI Writer" },
          { value: "ATmega1284", label: "microcontroller" },
        ],
        detailLabel: "Hardware & publication",
        details: [
          "Worked with Professor Aden Tim on hardware architectures, autonomous systems, and control algorithms.",
          "Combined microcontroller hardware and embedded programming with Python 3 and MySQL for attendance data management.",
          "The published research paper received 150,000 views on Top AI Writer.",
        ],
        technologies: ["ATmega1284", "Python 3", "MySQL", "Embedded programming"],
      },
    ],
  },
  {
    id: "internship",
    label: "Industry experience",
    title: "Learning through practical work.",
    introduction: "Hands-on experience across software, computer systems, and technical support.",
    entries: [
      {
        id: "oya-ghana",
        title: "Computer / Software Engineering Intern",
        organization: "Oya Ghana · Accra, Ghana",
        summary: "Completed an engineering internship with practical experience in software design, development, and testing, alongside computer systems and hardware applications.",
        metrics: [{ value: "10 weeks", label: "engineering internship" }],
        detailLabel: "Internship contributions",
        details: [
          "Contributed to designing, developing, and testing computer systems and hardware applications.",
          "Supported installation of Windows, software, and programs.",
          "Gained exposure to software development lifecycle tools and digital marketing.",
        ],
      },
    ],
  },
  {
    id: "training",
    label: "Technical training",
    title: "A foundation built with practice.",
    introduction: "A fully funded coding scholarship after graduating from Opoku Ware School.",
    entries: [
      {
        id: "springboard-scholar",
        title: "Springboard Coding Bootcamp Scholar",
        organization: "Springboard · Opoku Ware School scholarship",
        summary: "Selected as one of three students from 3,000 for a fully funded $17,000 scholarship. Completed 800 hours of coding training over nine months after high school.",
        metrics: [
          { value: "3 / 3,000", label: "students selected" },
          { value: "$17,000", label: "full scholarship" },
          { value: "800 hours", label: "coding training" },
          { value: "9 months", label: "program duration" },
        ],
        detailLabel: "What I studied",
        details: [
          "Studied JavaScript, Python, and web development through hands-on coding.",
          "Worked with APIs, databases, data structures, and algorithms.",
          "Learned to collaborate with generative AI through an AI learning unit focused on coding workflows.",
        ],
        technologies: ["JavaScript", "Python", "Web development", "APIs", "Databases", "Algorithms"],
      },
    ],
  },
  {
    id: "leadership",
    label: "Robotics leadership",
    title: "Building with a team.",
    introduction: "School leadership, technical research, and competition experience at Opoku Ware School.",
    entries: [
      {
        id: "owass-robotics",
        title: "President, Head Researcher & Spokesperson",
        organization: "Opoku Ware School Robotics Tech Club · Ghana",
        summary: "Led the club’s technical work and represented the team in local, regional, national, and world robotics competitions. Built, designed, and programmed AI robots using digital fabrication tools.",
        metrics: [
          { value: "8 / 9", label: "robotics competitions won" },
          { value: "5,000", label: "teams at the world championship" },
        ],
        detailLabel: "Leadership & competition experience",
        details: [
          "Led the completion of club assignments and used 3D printers and laser equipment for manufacturing.",
          "Participated in local competitions involving 500+ students, regional competitions with 58 schools, and national competitions with 150 schools.",
          "Represented the only Ghanaian school at the world championship, competing against and defeating schools from Pakistan, India, China, Europe, and the United States.",
          "Led the team to wins in eight of nine robotics competitions.",
          "Led algorithm development for brushless dual-electrical ports (BLDD) using MATLAB and Simulink.",
        ],
        technologies: ["AI robotics", "3D printing", "Laser fabrication", "MATLAB", "Simulink"],
      },
    ],
  },
  {
    id: "service",
    label: "Community service",
    title: "Showing up beyond engineering.",
    introduction: "Service, fundraising, and youth outreach across Ghana, Nigeria, and South Africa.",
    entries: [
      {
        id: "duke-of-edinburgh",
        title: "Duke of Edinburgh’s International Award",
        organization: "Bronze, Silver & Gold award holder",
        summary: "Completed the three progressive award levels and approximately 700 hours of community service. Helped raise $15,000 for shelter construction and food support.",
        metrics: [
          { value: "≈700", label: "community service hours" },
          { value: "$15,000", label: "raised through collective fundraising" },
          { value: "22", label: "youth outreach events" },
        ],
        detailLabel: "Awards & community contributions",
        details: [
          "Earned medals at the Bronze, Silver, and Gold levels and received an annual Millennium Award.",
          "Participated in the UK-founded international award program, described in my activity record as reaching 300,000 participants across 144 countries.",
          "Helped raise $15,000 through fundraising and NGO support, contributing to a homeless shelter in Danase, Kumasi, Ghana, and food donations for free meal kitchens.",
          "Participated in 22 youth outreach events in Ghana, Nigeria, and South Africa, distributing snacks, gift cards, and parish pamphlets at nursing homes, junior school campuses, and homeless shelters.",
        ],
      },
    ],
  },
];
