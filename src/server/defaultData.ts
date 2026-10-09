import {
  CLOUDINARY_GALLERY_IMAGES,
  CLOUDINARY_COURSE_IMAGES,
} from "../config/images";

export interface PhotoItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  isCover?: boolean;
  visible: boolean;
  order: number;
  publicId?: string;
  bytes?: number;
  format?: string;
}

export interface CourseItem {
  id: string;
  name: string;
  subtitle: string;
  duration: string;
  category: "certificate" | "professional";
  badge: string;
  logoUrl: string;
  localFallback?: string;
  highlight?: boolean;
  visible: boolean;
  order: number;
}

export interface FacilityItem {
  id: string;
  title: string;
  description: string;
  accentColor: string;
  visible: boolean;
  order: number;
}

export interface ContactInfo {
  instituteName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapsUrl: string;
  openingHours: string;
}

export interface WebsiteSettings {
  siteTitle: string;
  metaDescription: string;
  logoText: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  googleMapsListingUrl: string;
}

export interface CmsStoreData {
  photos: PhotoItem[];
  categories: string[];
  courses: CourseItem[];
  facilities: FacilityItem[];
  contact: ContactInfo;
  settings: WebsiteSettings;
  lastUpdated?: string;
}

export const DEFAULT_CATEGORIES: string[] = [
  "Computer Lab",
  "Classrooms",
  "Students Learning",
  "Training Activities",
  "Institute Events",
  "Infrastructure",
];

export const DEFAULT_PHOTOS: PhotoItem[] = CLOUDINARY_GALLERY_IMAGES.map((img, index) => ({
  id: img.id,
  title: img.title,
  subtitle: img.subtitle,
  image: img.image,
  category: img.category,
  isCover: img.isCover ?? index === 0,
  visible: true,
  order: index + 1,
}));

export const DEFAULT_COURSES: CourseItem[] = [
  {
    id: "mscit",
    name: "MS-CIT",
    subtitle: "Maharashtra State Certificate in Information Technology",
    duration: "3 Months",
    category: "certificate",
    badge: "MKCL Authorized",
    logoUrl: CLOUDINARY_COURSE_IMAGES.mscit,
    visible: true,
    order: 1,
  },
  {
    id: "typing",
    name: "Computer Typing (CCTP)",
    subtitle: "English & Marathi Typing Speed Certification",
    duration: "2 Months",
    category: "certificate",
    badge: "Govt. Recognized",
    logoUrl: CLOUDINARY_COURSE_IMAGES.typing,
    visible: true,
    order: 2,
  },
  {
    id: "tally",
    name: "Tally Prime",
    subtitle: "GST, E-Way Bill, TDS & Practical Accounting",
    duration: "2 Months",
    category: "certificate",
    badge: "Accounting with GST",
    logoUrl: CLOUDINARY_COURSE_IMAGES.tally,
    visible: true,
    order: 3,
  },
  {
    id: "excel",
    name: "Advanced Excel",
    subtitle: "VLOOKUP, XLOOKUP, Pivot Tables, Macros & MIS",
    duration: "2 Months",
    category: "certificate",
    badge: "Corporate MIS",
    logoUrl: CLOUDINARY_COURSE_IMAGES.excel,
    visible: true,
    order: 4,
  },
  {
    id: "graphics",
    name: "Graphic Designing",
    subtitle: "Photoshop, CorelDRAW, Illustrator & Canva",
    duration: "3 to 6 Months",
    category: "professional",
    badge: "Creative Industry",
    logoUrl: CLOUDINARY_COURSE_IMAGES.graphics,
    visible: true,
    order: 5,
  },
  {
    id: "video",
    name: "Video Editing",
    subtitle: "Premiere Pro, After Effects, Reels & YouTube",
    duration: "3 Months",
    category: "professional",
    badge: "Media & Creator",
    logoUrl: CLOUDINARY_COURSE_IMAGES.video,
    visible: true,
    order: 6,
  },
  {
    id: "analytics",
    name: "Data Analytics & Visualisation",
    subtitle: "Excel, Power BI, Tableau & Business Intelligence",
    duration: "3 to 6 Months",
    category: "professional",
    badge: "In-Demand Tech",
    logoUrl: CLOUDINARY_COURSE_IMAGES.analytics,
    visible: true,
    order: 7,
  },
  {
    id: "office",
    name: "Office Assistance",
    subtitle: "MS Office Suite, Email Drafting & Office Admin",
    duration: "2 Months",
    category: "certificate",
    badge: "Job Oriented",
    logoUrl: CLOUDINARY_COURSE_IMAGES.office,
    visible: true,
    order: 8,
  },
  {
    id: "softskills",
    name: "Soft Skills",
    subtitle: "Personality Development, English & Interviews",
    duration: "1 to 2 Months",
    category: "certificate",
    badge: "Career Confidence",
    logoUrl: CLOUDINARY_COURSE_IMAGES.softskills,
    visible: true,
    order: 9,
  },
  {
    id: "webdev",
    name: "Web Development",
    subtitle: "HTML5, CSS3, JavaScript, React & WordPress",
    duration: "4 to 6 Months",
    category: "professional",
    badge: "Full Stack Ready",
    logoUrl: CLOUDINARY_COURSE_IMAGES.webdev,
    visible: true,
    order: 10,
  },
  {
    id: "cyber",
    name: "Cyber Security",
    subtitle: "Network Defense, Ethical Hacking & Data Protection",
    duration: "3 to 6 Months",
    category: "professional",
    badge: "Cyber Defense",
    logoUrl: CLOUDINARY_COURSE_IMAGES.cyber,
    visible: true,
    order: 11,
  },
];

export const DEFAULT_FACILITIES: FacilityItem[] = [
  {
    id: "fac-1",
    title: "Modern Computer Lab",
    description: "High-spec workstations with latest software.",
    accentColor: "text-blue-600 bg-blue-50 border-blue-100",
    visible: true,
    order: 1,
  },
  {
    id: "fac-2",
    title: "High-Speed Internet",
    description: "Fast dedicated broadband for smooth practice.",
    accentColor: "text-cyan-600 bg-cyan-50 border-cyan-100",
    visible: true,
    order: 2,
  },
  {
    id: "fac-3",
    title: "Expert Trainers",
    description: "Certified faculty with deep mentoring experience.",
    accentColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
    visible: true,
    order: 3,
  },
  {
    id: "fac-4",
    title: "AC Classrooms",
    description: "Comfortable air-conditioned learning space.",
    accentColor: "text-sky-600 bg-sky-50 border-sky-100",
    visible: true,
    order: 4,
  },
  {
    id: "fac-5",
    title: "Practical Learning Approach",
    description: "100% hands-on project and real-world work.",
    accentColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
    visible: true,
    order: 5,
  },
  {
    id: "fac-6",
    title: "Updated Study Material",
    description: "Official syllabus, notes and practice test papers.",
    accentColor: "text-violet-600 bg-violet-50 border-violet-100",
    visible: true,
    order: 6,
  },
  {
    id: "fac-7",
    title: "Individual Attention",
    description: "Personalized mentoring tailored for every student.",
    accentColor: "text-blue-600 bg-blue-50 border-blue-100",
    visible: true,
    order: 7,
  },
  {
    id: "fac-8",
    title: "Doubt Clearing Support",
    description: "Dedicated 1-on-1 assistance and extra lab hours.",
    accentColor: "text-amber-600 bg-amber-50 border-amber-100",
    visible: true,
    order: 8,
  },
  {
    id: "fac-9",
    title: "Placement Assistance",
    description: "Resume guidance, interview prep and job alerts.",
    accentColor: "text-rose-600 bg-rose-50 border-rose-100",
    visible: true,
    order: 9,
  },
  {
    id: "fac-10",
    title: "Safe & Secure Premises",
    description: "CCTV monitored campus with welcoming atmosphere.",
    accentColor: "text-teal-600 bg-teal-50 border-teal-100",
    visible: true,
    order: 10,
  },
];

export const DEFAULT_CONTACT: ContactInfo = {
  instituteName: "Amol Infotech & Maharana Typing Institute, Risod",
  phone: "+91 94217 01759",
  whatsapp: "+91 94217 01759",
  email: "22210007@mkcl.org",
  address: "Near Shivaji Putala, Above Bank of Maharashtra, Risod, Dist. Washim, Maharashtra - 444506",
  mapsUrl: "https://www.google.com/maps/place/Amol+Infotech+%26+Maharana+Typing+Institute+Risod/@19.9756123,76.7922982,17z/",
  openingHours: "Mon - Sat: 08:00 AM - 08:00 PM | Sun: 09:00 AM - 01:00 PM",
};

export const DEFAULT_SETTINGS: WebsiteSettings = {
  siteTitle: "Amol Infotech & Maharana Typing Institute, Risod",
  metaDescription: "Government recognized computer training centre offering MS-CIT, Typing, Tally, and advanced digital skills in Risod.",
  logoText: "AMOL INFOTECH",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  youtubeUrl: "https://youtube.com",
  googleMapsListingUrl: "https://www.google.com/maps/place/Amol+Infotech+%26+Maharana+Typing+Institute+Risod/",
};
