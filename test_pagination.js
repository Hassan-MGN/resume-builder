import { paginateResume } from './src/utils/resumePagination.js';

// Load the resume state from local storage or mock it based on the user's data
const resume = {
  personal: {
    fullname: "Umer Farooque",
    title: "Full-Stack Web Developer"
  },
  summary: "Full-Stack Web Developer with over two years...",
  experience: [
    {
      position: "Full-Stack Web Developer",
      company: "Tafsol Technology Pvt. Ltd.",
      startDate: "January 2024",
      endDate: "Present",
      responsibilities: [
        "Develop and maintain production-ready websites using WordPress, Shopify, Laravel, React.js, and Next.js.",
        "Build custom WordPress themes and plugins based on client requirements...",
        "Design and develop custom Shopify storefronts...",
        "Develop full-stack web applications using Laravel...",
        "Create responsive and interactive user interfaces...",
        "Integrate payment gateways such as Stripe and PayPal...",
        "Optimize WordPress, Shopify, Laravel, and Next.js applications...",
        "Collaborate with clients to gather requirements...",
        "Manage multiple web development projects simultaneously...",
        "Utilize Git, GitHub, REST APIs, and modern development workflows..."
      ]
    }
  ],
  education: [
    {
      degree: "BS Information Technology",
      institution: "Sindh Agriculture University, Tandojam",
      startDate: "2019",
      endDate: "2023",
      description: "Relevant Coursework: Data Structures, OOP, Database Systems..."
    }
  ],
  skills: ["WordPress", "WooCommerce", "Shopify", "Wix", "HTML5", "CSS3", "JavaScript", "React.js"],
  coreSkills: ["WordPress (Custom Themes)", "React.js", "MySQL", "PHP"],
  keyAchievements: [
    "Delivered client projects across WordPress, Shopify, Laravel, React.js...",
    "Built and deployed scalable Laravel and React.js applications...",
    "Improved project delivery efficiency through reusable code structures...",
    "Developed modern web solutions leveraging WordPress..."
  ],
  certificates: [
    {
      name: "Agentic AI",
      issuer: "S.M.I.T",
      date: "December 2025"
    }
  ],
  languages: [
    "English — Professional Working Proficiency",
    "Urdu — Native"
  ],
  hobbies: ["Swimming", "Shooting", "Eating", "Programming"],
  additionalInformation: [
    {
      heading: "Additional Information",
      bullets: [
        "Strong problem-solving skills...",
        "Currently expanding expertise..."
      ]
    }
  ]
};

const layout = { spacing: 0 };
const pages = paginateResume({ resume, layout, template: "Corporate" });

pages.forEach((page, i) => {
  console.log(`\n--- PAGE ${i + 1} ---`);
  console.log("Sections:", page.sections);
  page.sections.forEach(sec => {
    const data = page.pageData[sec];
    if (Array.isArray(data)) {
      console.log(`  ${sec}: ${data.length} items`);
    } else {
      console.log(`  ${sec}: ${typeof data}`);
    }
  });
});
