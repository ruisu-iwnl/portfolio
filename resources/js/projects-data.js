/**
 * Project list data, in display order. To reorder projects, just move
 * entries around in this array — the render step in main.js handles
 * building the actual markup for whatever order they're in here.
 */
const PROJECTS = [
  {
    category: "fullstack",
    categoryLabel: "Legacy PHP",
    title: "Enterprise Learning Ecosystem",
    media: { type: "video", src: "resources/videos/powerenglish.mp4", poster: "resources/img/powerenglish.png" },
    description: `An ESL enrollment platform on a legacy PHP and MySQL codebase — students get homework and book video or phone classes, with teachers and admins working in their own separate systems.`,
    highlights: [
      { label: "Teacher side", text: `Took it from an old legacy HTML design to a modern rebrand, and improved the flow of the whole system, not just the look.` },
      { label: "Admin side", text: `Maintain payroll, attendance, scheduling, and payments, plus an FAQ system built with Gemini and an OpenAI-powered grammar checker for homework.` },
      { label: "Hiring system", text: `Maintain the applicant flow — resume checks, interview video reviews, approvals, Google-integrated emails, and an automated, scored grammar test.` },
      { label: "Marketing sites", text: `Shipped standalone marketing sites from scratch, and handled the marketing and SEO to launch them.` },
      { label: "Hosting", text: `Manage the Cafe24 hosting setup, including SSL certificate installs and renewals.` },
    ],
    tech: ["PHP", "MySQL", "Gemini", "OpenAI", "Google API", "Cafe24"],
    links: [
      { label: "Live", href: "https://www.pweng.net/", icon: true },
    ],
  },
  {
    category: "fullstack",
    categoryLabel: "E-commerce",
    title: "Joulery Handcrafted Items",
    media: { type: "video", src: "resources/videos/joulery.mp4", poster: "resources/img/joulery_screenshot.png" },
    description: `An online store for handcrafted Filipino jewelry — customers browse the pieces, add them to a cart, and order online. Built with Next.js, React, and Tailwind CSS, with Framer Motion for the interface animations, Payload CMS for content, and PayMongo for secure, webhook-driven order processing.`,
    tech: ["Next.js", "React", "Tailwind", "Framer Motion", "Payload", "PayMongo"],
    links: [
      { label: "GitHub", href: "https://github.com/ruisu-iwnl/brandmarketing", icon: false },
      { label: "Live", href: "https://joulery.vercel.app/", icon: true },
    ],
  },
  {
    category: "fullstack",
    categoryLabel: "Full Stack",
    title: "Discord Multipurpose Bot",
    media: { type: "video", src: "resources/videos/carrot.mp4", poster: "resources/img/carrot.png" },
    description: `A Discord bot with a web dashboard for per-server setup, plus Carrot — a RAG-powered AI assistant that answers questions grounded in a server's own message history.`,
    tech: ["Next.js", "TypeScript", "Discord.js", "Upstash", "Gemini", "RAG", "Render"],
    links: [
      { label: "GitHub", href: "https://github.com/ruisu-iwnl/discord-multipurpose-bot", icon: false },
      { label: "Live", href: "https://discord-multipurpose-bot-kot8.onrender.com/", icon: true },
    ],
  },
  {
    category: "fullstack",
    categoryLabel: "Full Stack",
    title: "Point-of-Sale System",
    media: { type: "video", src: "resources/videos/pos.mp4", poster: "resources/img/pos.png" },
    description: `A cross-platform POS built with Flutter — runs on desktop, Android tablets, or phones, and integrates with receipt printers and cash registers. Works offline-first with local SQLite storage, syncing to a Neon Postgres database once back online. Handles product management, sales reports, receipt generation, and void/cancel/discount transactions.`,
    tech: ["Flutter", "Dart", "SQLite", "Neon"],
    links: [
      { label: "GitHub", href: "https://github.com/ruisu-iwnl/flutter-pos", icon: false },
      { label: "Live", href: "https://ruisu-iwnl.github.io/demo-sample/", icon: true },
    ],
  },
  {
    category: "fullstack",
    categoryLabel: "Full Stack",
    title: "Smart Lease Management",
    media: { type: "none" },
    description: `A comprehensive platform featuring auto-expiring leases, automated monthly rental reports, and real-time payment synchronization.`,
    tech: ["PHP", "MySQL", "Bootstrap"],
    links: [
      { label: "View", href: "https://github.com/ruisu-iwnl/ezrent", icon: true },
    ],
  },
  {
    category: "fullstack",
    categoryLabel: "Full Stack",
    title: "QR Vehicle Access",
    media: { type: "none" },
    description: `Flask-powered security application utilizing encrypted QR codes for instant vehicle identification and access control.`,
    tech: ["Python", "Flask", "Security"],
    links: [
      { label: "View", href: "https://github.com/ruisu-iwnl/qrcode-vehicle-access-control-system", icon: true },
    ],
  },
  {
    category: "fullstack",
    categoryLabel: "Full Stack",
    title: "RFID Vehicle Entry",
    media: { type: "none" },
    description: `Hardware-software bridge using RFID card readers for automated gate control and entry logging.`,
    tech: ["Python", "Hardware", "IoT"],
    links: [
      { label: "View", href: "https://github.com/ruisu-iwnl/rfid-vehicle-access-control-system", icon: true },
    ],
  },
  {
    category: "automation",
    categoryLabel: "Automation",
    title: "Email Sender",
    media: { type: "none" },
    description: `Bulk email automation for recruiting and large-scale group messaging tasks.`,
    tech: ["Python", "SMTP"],
    links: [
      { label: "View", href: "https://github.com/ruisu-iwnl/email-sender", icon: true },
    ],
  },
];
