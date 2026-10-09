/**
 * Central Cloudinary Images Configuration
 * 
 * Paste your Cloudinary Secure URLs directly into the respective objects/arrays below.
 * All public website sections (Inside Amol Infotech gallery, courses, facilities,
 * authorisations, director photo, hero background) and the Director CMS dynamically
 * read from this central configuration file.
 */

export interface CloudinaryGalleryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category:
    | "Computer Lab"
    | "Classrooms"
    | "Students Learning"
    | "Training Activities"
    | "Institute Events"
    | "Infrastructure";
  isCover?: boolean;
}

/**
 * 1. Inside Amol Infotech Gallery Images
 * Categorized under:
 * - Computer Lab
 * - Classrooms
 * - Students Learning
 * - Training Activities
 * - Institute Events
 * - Infrastructure
 */
export const CLOUDINARY_GALLERY_IMAGES: CloudinaryGalleryItem[] = [
  {
    id: "gallery-1",
    title: "MS-CIT Computer Training Lab",
    subtitle: "High-spec workstations with modern monitors & high-speed Internet",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    category: "Computer Lab",
    isCover: true,
  },
  {
    id: "gallery-2",
    title: "Interactive Practical Learning",
    subtitle: "Students mastering typing speed drills and practical software",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    category: "Students Learning",
    isCover: false,
  },
  {
    id: "gallery-3",
    title: "Batch Training & Theory Classroom",
    subtitle: "Air-conditioned classrooms with interactive digital displays",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    category: "Classrooms",
    isCover: false,
  },
  {
    id: "gallery-4",
    title: "Hands-on Practical Training Session",
    subtitle: "Personal attention and 1-on-1 mentoring for every student",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    category: "Training Activities",
    isCover: false,
  },
  {
    id: "gallery-5",
    title: "Certificate Distribution Ceremony",
    subtitle: "Proud students receiving their government-recognised certificates",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    category: "Institute Events",
    isCover: false,
  },
  {
    id: "gallery-6",
    title: "Campus Reception & Counselling Desk",
    subtitle: "Student admission counselling desk and reception area",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    category: "Infrastructure",
    isCover: false,
  },
];

/**
 * 2. Course Cards Image URLs
 */
export const CLOUDINARY_COURSE_IMAGES: Record<string, string> = {
  mscit:
    "https://blogger.googleusercontent.com/img/a/AVvXsEiv_hwCyTScUIhfgYuRlP2qvRPMUBbQiwvWrSXcEgxZ5uuBUkVJiaLWJjSpp4LKCD-W7rG_rQoKG_PWqXEi4bRa_JT840F267tuH8xVPqY7NQRmS-8AR9i2ltNEuK1ydFqTEuDYPijcoq6a6EBy9SdMZrVmr6cTHcTrr-V0jysNpRJXH5Xo4_uY9q691Vk",
  typing:
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSjD-OuOatjc5BqBAGi9qxjbgBjpNZNJKG-EC_CaQ1aeGX6J7LgfwTiCVIVSfXY92XcsXlAjRTO0rz33mWCDhkdJWYPWJMIYtDHI4aEpsfB0s_hfWGgjDWJStYb6wAOqD5eSb9SwZ8Rsu4jMV2LQl4iqk4ShKyQ84xDZdhnenSmWPqBoUlltXMY_juqU8/s320/Computer%20Typing.png",
  tally:
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0nU9t197ZbKOdY-aTiLqOArP8jcX3I80xH-HB6f8PWYfOTDDbZREG0pLtVj4IhHaa_HaPY3jr-I8uHYnpnSSv2rnE3AFXQhq05maWwOUrUEoTsWXOcu1C-I4Oea9jVkWO4kC8pT6z_DVjrIhyphenhyphenwfuzX_MeIJozlfByQQfC4bRS-sa9ZbdGoayDiOatTv0/s320/21d92f5f-5605-40c7-84f2-6827f923be5b.png",
  excel:
    "https://blogger.googleusercontent.com/img/a/AVvXsEirgaesdVKqztAI4brjEPatifE0cwI0GB5P3yINvBLr2Z_dt6vC0oW2TKZaakEc_40AFi7YswiI-luqAg_-uahfburfIzVBePqUaVbsQ-fc8L7k1nvSmBzAe1SSBhAMw0XIL3zC1Blmepd-lNTMo9PZVZg5wd4LNTPgzMc_-tCqAmDUWoof2xIro6j7wK8=s1600",
  graphics:
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh9lgPuF0JtqFKrT4rlknTx9svadl9cc9cxApyc9oTnmu3erMVYV1TmgZYOWQGgw1MKLkyqQtHSFWzEZeECSgpno2KMHzD6bvb5vcS9PpK9UrSJegJ_F_bSnIegiTMiq_pj_RSQH4qx9lKI_RjEQz3HQsET80xxXrbw4g79XwLevEKJagKJY0GI8HF3vwg/s320/Graphics%20Design.png",
  video:
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEijbZSJ6k6dzjjEc9VZYn1JrWF1QZdb9klVlGP-2I9KtA9jQm3mlYIIej6zaf_S9lweIw2kGk_slogw4gxgjKgKinuWptFW60NwRzRyWcMr2j5qUTF2BR29elOqOgOsEhqLsgfRUhrISIoJI0NmE_hzTR2aFL5oVDxArgz5kHaQt3JdxfaF_3CEwcK6g5o/s320/Video%20Editing.png",
  analytics:
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiHCpEKFx-bKTb2_rp1fo7VtN7PBznq_OiUgRCcUhqiBEC-1ShvQy5AkP6qWAjs3mRWalbVFYp_4DloXC1Nm9O40xy34axEn23yVt7n85X8abc3fFwBMbP3RYpuI-eos2LJaIaaFlb0leY-PakgZVgx47T2frZPGWCBdAXfV6FHvm_nWpcQ65KLtRDmNKU/s320/Data%20Analytics.png",
  office:
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgie7wqm31MxGPkkqdUgwnu7x2U0hg0l6vDFsugDfxIqS9B-r_C7VwfzCb82dDjPWU-0LQH_TFP8PHxVDAMn_DUFjSc_Qd2qwqeD23y6erDZ_vB1q76RuE777dyYyw-mSmdfmpX-l6Wc62Vio913e6DaWzoZpR3DGScx0ePc01Ny4MRQx8kt9cjVmeIqEI/s320/Office%20Assistance.png",
  softskills:
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCsySIU4ik3s48ZJMUUUzms4d83lwQZGAvQZF9HY78zyKpRU_MFQwxmPILHJwF6afHM9P5b1NYY362ib1uL0yilB3kywjeVpmDaiwnRHPcwdB4E5Ta5YJlWJsBXcppJf8iLdqdYWu7lIH8i1of0HudakBmL3dK_-iI5AhK6Q8r_elvRsuvyd3-2ghZXLc/s320/Soft%20Skills.png",
  webdev:
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_b-Y-buBWEO688WUutkeiRKhKbrW6Ypo3XqAe5wAt8LJI8-NTamDuzEBUNblUzZQ_NC1NjV0lz7gborrEpX31g5xSghNG_YOdMjx1Gjj2G29oOtE51N5Zx5_mgYQug-PhjIRQk-RaVKcYh98nWuG9sYtpMZwEtR6TUvRx9qDHPuMerIIkw7LbRH0rFmk/s320/Web.png",
  cyber:
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1n7Mb7Vd7ED_9ZPRRnv6ynQ9zzKwUJVG-sJ5s5V8-MURIBZ22TUBY_EXIeSmzXABs18Q0LvTC8Kz1aY4e4xCFkIXe1kvwVV_RAG9MtqiWh4FsRd-HeBzA1-c-2Fi0hOC4ZEvtBhbuXO_jUXHsUPtgKzWK-ucsbhF3McXMNTS6n2Z7d6qJnSvf3uhLfmM/s320/Cyber%20security.png",
};

/**
 * 3. Institute Branding, Director & Official Certifications
 */
export const CLOUDINARY_BRANDING = {
  // Official Institute Logo (Unchanged)
  instituteLogo:
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgxi4v2VP-ux_tgpP_qrFA_iNc5QuhqK8xR-MK0_o4Qqwpy-UY5K3MFEOZcfYzQsouGUdKSn1YU5C8mRORw-xLl1asyWbi7FQSwuQGupZ_Y6S7sosNVxD7pfofLWdAjTvEB5h11fLV4wpoAqRkOaY-PB6aoxo_RvJiaSITCKRD9BtDVLQDSlFRoZE0q5og/s320/Amol%20Infotech%20Logo.png",

  // Director Mr. Ravindra Solanke
  directorPhoto:
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhG2iTTlNQSMb1rdZv6AnyeWiUz37YXkucdO9FZyhCeZyvLkLNIppqD17yq3orWiAunlY4FDwp1l80tl_V7n8ZjCUY-XepdAi1cGVCWkpN9OSjoNSBEzZ-sp-WgO71OLkfICTlTrnEwEagjvaPYkThVApQcMYpKwI-7OH2GgVUOUitE-JYvJCoUCM3Ys38/s320/Solanke%20sir.png",

  // Hero Background Banner
  heroBanner:
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7hXh8jX92xK5_Jj6F-j4Z3i8A2bQ9-1c9v1s-7v8b3k7f9d8a4s2d1f0g9h8j7k6l5m4n3b2v1c0x9z8a7s6d5f4g3h2j1k0l/s1600/Hero.png",

  // Authorisation Logos
  mkclLogo:
    "https://play-lh.googleusercontent.com/tddR-j3x5hTuxF4FIFa7pSOknz6aFPT6rbzIYGNfkIxjmAqT2woWLW4jTazs8z_NFZOnNqKJJOeoyOTvLrLFIMU=w240-h480-rw",
  msbteLogo:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQisnwmKfaRMxmEEHBeVlTbz1Og1ItCY3mu7lWhzsp2XH7cn1a4q-vRhlfx&s=10",
  msceLogo:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqYjJN9c7pmrZy0pvsd7F1Zpq04J2oL-EU59BvqF5dqLi_k2d5ghUsvKc&s=10",
};
