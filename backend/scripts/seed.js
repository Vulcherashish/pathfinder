require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Job = require('../models/Job');
const College = require('../models/College');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB Connected for seeding');
};

const jobs = [
  { title: 'Full Stack Developer', company: 'TechCorp', skills: ['React', 'Node.js', 'MongoDB'], salary: '₹8L - ₹20L/yr', description: 'Build scalable web applications using modern full-stack technologies.', category: 'tech', careerPath: 'developer', location: 'Bangalore / Remote', type: 'Full-time' },
  { title: 'Frontend Developer', company: 'WebSolutions', skills: ['React', 'CSS', 'JavaScript'], salary: '₹6L - ₹15L/yr', description: 'Create responsive, pixel-perfect user interfaces with React.', category: 'tech', careerPath: 'developer', location: 'Mumbai', type: 'Full-time' },
  { title: 'Backend Engineer', company: 'CloudBase', skills: ['Node.js', 'Python', 'AWS'], salary: '₹10L - ₹25L/yr', description: 'Design and build robust server-side systems and REST APIs.', category: 'tech', careerPath: 'developer', location: 'Hyderabad / Remote', type: 'Full-time' },
  { title: 'UI/UX Designer', company: 'CreativeStudio', skills: ['Figma', 'Adobe XD', 'Prototyping'], salary: '₹5L - ₹14L/yr', description: 'Design intuitive user experiences for web and mobile platforms.', category: 'creative', careerPath: 'designer', location: 'Delhi', type: 'Full-time' },
  { title: 'Graphic Designer', company: 'BrandHouse', skills: ['Photoshop', 'Illustrator', 'Branding'], salary: '₹4L - ₹10L/yr', description: 'Create visual assets for digital and print media.', category: 'creative', careerPath: 'designer', location: 'Pune', type: 'Full-time' },
  { title: 'Motion Designer', company: 'AnimFX', skills: ['After Effects', 'Cinema 4D', 'Blender'], salary: '₹6L - ₹16L/yr', description: 'Produce engaging motion graphics and animations for campaigns.', category: 'creative', careerPath: 'designer', location: 'Mumbai', type: 'Full-time' },
  { title: 'Business Analyst', company: 'ConsultPro', skills: ['Excel', 'SQL', 'Power BI'], salary: '₹7L - ₹18L/yr', description: 'Analyze business processes and provide data-driven recommendations.', category: 'business', careerPath: 'management', location: 'Gurgaon', type: 'Full-time' },
  { title: 'Product Manager', company: 'StartupX', skills: ['Roadmapping', 'Agile', 'Analytics'], salary: '₹15L - ₹35L/yr', description: 'Lead product strategy, roadmap execution, and cross-functional teams.', category: 'business', careerPath: 'management', location: 'Bangalore', type: 'Full-time' },
  { title: 'Marketing Manager', company: 'GrowthLab', skills: ['SEO', 'Social Media', 'Analytics'], salary: '₹8L - ₹20L/yr', description: 'Drive brand awareness and lead generation through digital channels.', category: 'business', careerPath: 'management', location: 'Chennai', type: 'Full-time' },
  { title: 'Data Scientist', company: 'DataMinds', skills: ['Python', 'Machine Learning', 'SQL'], salary: '₹12L - ₹30L/yr', description: 'Extract insights from large datasets using machine learning and statistics.', category: 'tech', careerPath: 'analyst', location: 'Bangalore / Remote', type: 'Full-time' },
];

const colleges = [
  { name: 'IIT Bombay', location: 'Mumbai, Maharashtra', course: 'B.Tech Computer Science', rating: 5.0, description: 'Premier engineering institute with world-class research facilities.', fees: '₹2.5L/year', category: 'tech', careerPath: 'developer', website: 'https://iitb.ac.in' },
  { name: 'BITS Pilani', location: 'Pilani, Rajasthan', course: 'B.E. Computer Science', rating: 4.8, description: 'Top ranked institute known for producing industry-ready engineers.', fees: '₹4.5L/year', category: 'tech', careerPath: 'developer', website: 'https://bits-pilani.ac.in' },
  { name: 'VIT University', location: 'Vellore, Tamil Nadu', course: 'B.Tech Software Engineering', rating: 4.3, description: 'Strong industry connections and modern labs.', fees: '₹1.98L/year', category: 'tech', careerPath: 'developer', website: 'https://vit.ac.in' },
  { name: 'National Institute of Design', location: 'Ahmedabad, Gujarat', course: 'B.Des Product Design', rating: 4.9, description: 'India\'s top design institute with global recognition.', fees: '₹3.8L/year', category: 'creative', careerPath: 'designer', website: 'https://nid.edu' },
  { name: 'MIT Institute of Design', location: 'Pune, Maharashtra', course: 'B.Des Communication Design', rating: 4.4, description: 'Focuses on user-centred design and visual communication.', fees: '₹2.5L/year', category: 'creative', careerPath: 'designer', website: 'https://mitid.edu.in' },
  { name: 'Symbiosis Institute of Design', location: 'Pune, Maharashtra', course: 'B.Des Interaction Design', rating: 4.2, description: 'Industry-integrated design curriculum.', fees: '₹3.2L/year', category: 'creative', careerPath: 'designer', website: 'https://sid.edu.in' },
  { name: 'IIM Ahmedabad', location: 'Ahmedabad, Gujarat', course: 'MBA Business Management', rating: 5.0, description: 'Top-ranked business school in Asia.', fees: '₹23L/year', category: 'business', careerPath: 'management', website: 'https://iima.ac.in' },
  { name: 'XLRI Jamshedpur', location: 'Jamshedpur, Jharkhand', course: 'PGDM Business Management', rating: 4.7, description: 'Premier HR and management institute.', fees: '₹24L/year', category: 'business', careerPath: 'management', website: 'https://xlri.ac.in' },
  { name: 'SP Jain School of Management', location: 'Mumbai, Maharashtra', course: 'BBA / MBA Management', rating: 4.5, description: 'Strong placement record with top MNCs.', fees: '₹18L/year', category: 'business', careerPath: 'management', website: 'https://spjain.org' },
  { name: 'ISB Hyderabad', location: 'Hyderabad, Telangana', course: 'PGP Business Analytics', rating: 4.8, description: 'World-class faculty and global curriculum.', fees: '₹40L/year', category: 'business', careerPath: 'analyst', website: 'https://isb.edu' },
];

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Job.deleteMany({});
    await College.deleteMany({});
    console.log('🗑️  Cleared existing jobs and colleges');

    // Insert jobs and colleges
    await Job.insertMany(jobs);
    await College.insertMany(colleges);
    console.log('✅ Jobs and Colleges seeded');

    // Create admin if not exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@pathfinder.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin user created: admin@pathfinder.com / admin123');
    } else {
      console.log('ℹ️  Admin already exists');
    }

    console.log('\n🎉 Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
