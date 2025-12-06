import { _mock } from './_mock';

// ----------------------------------------------------------------------

const TUTORIAL_CATEGORIES = ['beginner', 'advanced', 'ai', 'automation', 'integration', 'workflow', 'chatbot', 'agent'];
const TUTORIAL_SOURCES = ['youtube.com', 'vimeo.com', 'tutorial.ai-nexus.io'];
const TUTORIAL_LANGUAGES = ['English', 'Spanish', 'Portuguese', 'German', 'French'];

const TUTORIAL_TITLES = [
  'How to share your tutorials',
  'Beginner course',
  'Advanced Course',
  'How to Create AI Chatbot for absolute beginner?',
  'Conexão com SQL Server',
  'Credentials through Google OAuth',
  'RBAC for AI Agents',
  '5 Creative n8n workflows that will blow your mind',
  'New n8n MCP Update',
  'Control Your Own AI Agent with Siri! Easy iPhone Setup',
  'I automated Upwork job search with AI',
  'N8n Tutorial: What is n8n and how to get started',
  'How to Install n8n Locally: Step by Step Guide',
  'How to post to Facebook with n8n',
  'How to extract enriched LinkedIn data',
  'Adiós Vector DBs: El Nuevo método',
  '50+ n8n Video Course (UPDATED 2024)',
  'How to Audit your Security with AI',
  'Building Multi-Agent Systems from Scratch',
  'Connect ANY API in 5 Minutes',
  'Automate Your Email Responses with AI',
  'Create a Voice Assistant with OpenAI',
  'Workflow Automation Best Practices',
  'Building Custom Nodes Tutorial',
  'Error Handling and Debugging Guide',
  'Working with Databases in n8n',
  'Scheduling Workflows Like a Pro',
  'Data Transformation Techniques',
  'API Authentication Methods Explained',
  'Creating Dynamic Webhooks',
  'Mastering HTTP Requests',
  'Building a CRM Integration',
  'Slack Bot Development Guide',
  'Gmail Automation Tutorial',
  'Twitter Bot in 10 Minutes',
  'Discord Integration Setup',
  'Notion API Complete Guide',
  'Airtable Workflows Tutorial',
  'Google Sheets Automation',
  'Zapier Alternative: Why Choose n8n',
  'Serverless Deployment Guide',
  'Docker Setup for n8n',
  'Self-Hosting Best Practices',
  'Scaling Your Workflows',
  'Performance Optimization Tips',
  'Security Best Practices',
  'Monitoring and Logging Setup',
  'Backup and Recovery Strategies',
];

const TUTORIAL_DESCRIPTIONS = [
  'Learn how to create and share your own tutorials with the community. This comprehensive guide covers recording, editing, and publishing your content.',
  'Start your journey with n8n basics. 9 videos covering 2 hours of training for absolute beginners.',
  'Take your skills to the next level with advanced techniques. 8 videos, 1.5 hours of in-depth training.',
  'Create your first AI chatbot from scratch. Perfect for beginners with no coding experience required.',
  'Complete guide to connecting SQL Server databases with n8n. Includes troubleshooting common issues.',
  'Set up Google OAuth credentials for secure API authentication. Step-by-step walkthrough included.',
  'Build a single Multi-Agent with role-based access control. Learn to check permissions and manage agent tools.',
  'Discover 5 creative workflow automations that will transform how you work. Real-world examples included.',
  'Latest updates to the MCP (Model Context Protocol) integration. New features and improvements explained.',
  'Set up a Siri-activated AI Agent using n8n and Apple Shortcuts. Control your AI with just your voice!',
  'Automate your job search on Upwork using AI. Save hours of manual work every day.',
  'Complete introduction to n8n. Learn what it is, why you should use it, and how to get started today.',
  'Install n8n on your local machine. Covers Windows, Mac, and Linux installation.',
  'Create Meta access credentials and post to Facebook pages automatically. Social media automation made easy.',
  'Extract and enrich LinkedIn profile data. Build powerful recruitment and sales workflows.',
  'New approach to vector databases. Learn the latest techniques for AI memory and context.',
  'Complete video course with 50+ tutorials. Updated for 2024 with new features and best practices.',
  'Use AI to audit your security setup. Identify vulnerabilities and get recommendations automatically.',
  'Build complex multi-agent systems. Learn coordination, communication, and task distribution.',
  'Connect to any REST API in minutes. Master authentication, headers, and request formatting.',
  'Let AI handle your email responses. Set up intelligent auto-replies based on context.',
  'Build your own voice assistant using OpenAI. Speech-to-text and text-to-speech integration.',
  'Learn industry best practices for workflow automation. Avoid common pitfalls and mistakes.',
  'Create your own custom nodes. Extend n8n functionality with your own integrations.',
  'Master error handling and debugging. Learn to troubleshoot workflows efficiently.',
  'Work with SQL, PostgreSQL, MongoDB and more. Database operations made simple.',
  'Schedule workflows using cron expressions. Time-based automation explained.',
  'Transform data between formats. JSON, XML, CSV conversion and manipulation.',
  'OAuth, API keys, JWT tokens explained. Secure your API connections properly.',
  'Build dynamic webhooks that adapt to incoming data. Advanced webhook techniques.',
  'Everything about HTTP requests. GET, POST, PUT, DELETE with real examples.',
  'Integrate with popular CRM systems. Salesforce, HubSpot, and more.',
  'Build a fully functional Slack bot. Handle messages, commands, and interactions.',
  'Automate Gmail workflows. Send emails, process attachments, and organize your inbox.',
  'Create a Twitter bot in just 10 minutes. Post, reply, and engage automatically.',
  'Set up Discord bot integration. Manage channels, roles, and automated messages.',
  'Complete guide to Notion API. Databases, pages, and blocks explained.',
  'Master Airtable workflows. Create records, update tables, and sync data.',
  'Automate Google Sheets operations. Read, write, and format spreadsheets.',
  'Comparing n8n with Zapier. Why n8n is the better choice for power users.',
  'Deploy n8n serverless. AWS Lambda, Google Cloud Functions, and Azure.',
  'Set up n8n with Docker. Container orchestration and best practices.',
  'Self-hosting guide for production. Security, performance, and maintenance.',
  'Scale your workflows to handle millions of executions. Architecture patterns.',
  'Optimize workflow performance. Reduce execution time and resource usage.',
  'Secure your n8n instance. Authentication, encryption, and access control.',
  'Set up monitoring and logging. Track performance and debug issues.',
  'Backup strategies and disaster recovery. Protect your workflows and data.',
];

// Demo YouTube video IDs - cycling through 3 demo videos
const YOUTUBE_VIDEO_IDS = [
  'yAoLSRbwxL8', // Demo video 1
  'D0UnqGm_miA', // Demo video 2
  'k_Lf2N2LJv8', // Demo video 3
];

// Thumbnail images - cycling through 3 images
const THUMBNAIL_IMAGES = [
  'https://img.freepik.com/premium-psd/attractive-new-youtube-thumbnail-design-template_941802-3547.jpg',
  'https://img.freepik.com/free-psd/feel-music-concept-banner-template_23-2148653083.jpg',
  'https://img.freepik.com/premium-psd/man-suit-with-video-design-front-it_526766-980.jpg',
];

// ----------------------------------------------------------------------

export const _tutorials = [...Array(48)].map((_, index) => ({
  id: `tutorial-${index + 1}`,
  title: TUTORIAL_TITLES[index],
  description: TUTORIAL_DESCRIPTIONS[index],
  thumbnail: THUMBNAIL_IMAGES[Math.floor(Math.random() * THUMBNAIL_IMAGES.length)],
  videoUrl: `https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_IDS[index % YOUTUBE_VIDEO_IDS.length]}`,
  embedUrl: `https://www.youtube.com/embed/${YOUTUBE_VIDEO_IDS[index % YOUTUBE_VIDEO_IDS.length]}`,
  category: TUTORIAL_CATEGORIES[index % TUTORIAL_CATEGORIES.length],
  source: TUTORIAL_SOURCES[index % TUTORIAL_SOURCES.length],
  language: TUTORIAL_LANGUAGES[index % TUTORIAL_LANGUAGES.length],
  duration: `${Math.floor(Math.random() * 30) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  views: `${(Math.random() * 10).toFixed(1)}k`,
  author: {
    id: _mock.id(index + 400),
    name: _mock.fullName(index),
    avatarUrl: _mock.image.avatar(index),
    role: index % 5 === 0 ? 'n8n Team' : 'Community Member',
    verified: index % 5 === 0,
  },
  likes: Math.floor(Math.random() * 20),
  comments: Math.floor(Math.random() * 15),
  links: Math.floor(Math.random() * 5),
  publishedAt: _mock.time(index),
  createdAt: _mock.time(index),
  tags: [TUTORIAL_CATEGORIES[index % TUTORIAL_CATEGORIES.length], 'tutorial'],
  // Mock comments
  commentsList: [...Array(Math.min(5, Math.floor(Math.random() * 6)))].map((__, commentIdx) => ({
    id: _mock.id(index * 100 + commentIdx),
    author: {
      id: _mock.id(index * 100 + commentIdx + 1000),
      name: _mock.fullName(index * 100 + commentIdx),
      avatarUrl: _mock.image.avatar(index * 100 + commentIdx),
      role: commentIdx === 0 ? 'Community Member' : 'Member',
    },
    content: [
      'Thanks for sharing! This is exactly what I was looking for.',
      'Great tutorial! Very well explained.',
      'I love how you made this so simple to understand.',
      'This helped me solve my problem. Thank you!',
      'Amazing work! Looking forward to more tutorials.',
      'Could you do a follow-up on advanced features?',
    ][commentIdx % 6],
    likes: Math.floor(Math.random() * 10),
    createdAt: _mock.time(index * 10 + commentIdx),
    replies: [],
  })),
}));

