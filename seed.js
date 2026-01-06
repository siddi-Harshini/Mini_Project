require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Scholarship = require('./models/Scholarship');
const Program = require('./models/Program');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

async function seedDatabase() {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Scholarship.deleteMany({});
    await Program.deleteMany({});

    // Create Admin User
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@college.edu',
      password: adminPassword,
      role: 'admin'
    });

    // Create Sample Student Users
    console.log('👥 Creating sample students...');
    const studentPassword = await bcrypt.hash('student123', 10);
    
    const students = await User.create([
      {
        name: 'Priya Sharma',
        email: 'priya@student.edu',
        password: studentPassword,
        role: 'student',
        profile: {
          gender: 'female',
          year: 2,
          department: 'CS',
          cgpa: 8.5,
          skills: ['Python', 'JavaScript', 'Machine Learning'],
          interests: ['AI', 'Web Development', 'Data Science'],
          location: 'India',
          graduationYear: 2026
        }
      },
      {
        name: 'Rahul Kumar',
        email: 'rahul@student.edu',
        password: studentPassword,
        role: 'student',
        profile: {
          gender: 'male',
          year: 3,
          department: 'IT',
          cgpa: 7.8,
          skills: ['Java', 'React', 'Node.js'],
          interests: ['Web Development', 'Mobile Development'],
          location: 'India',
          graduationYear: 2025
        }
      }
    ]);

    // Create Scholarships with real 2026 data
    console.log('💰 Creating scholarships...');
    const scholarships = await Scholarship.create([
      {
        title: 'Google Women Techmakers Scholars Program',
        description: 'The Women Techmakers Scholars Program (formerly Google Anita Borg Memorial Scholarship) provides scholarships for women excelling in computing and technology. Selected scholars receive $10,000 USD for the academic year.',
        provider: 'Google',
        amount: '$10,000 USD',
        deadline: new Date('2026-12-01'), // Typically opens in December
        applicationLink: 'https://www.womentechmakers.com/scholars',
        eligibility: {
          gender: ['female'],
          minCGPA: 7.5,
          year: [2, 3, 4],
          departments: ['CS', 'IT', 'ECE'],
          requiredSkills: [],
          interests: ['Technology', 'Computer Science']
        },
        tags: ['google', 'women', 'tech', 'diversity'],
        createdBy: admin._id
      },
      {
        title: 'Adobe India Women-in-Technology Scholarship',
        description: 'Adobe offers scholarships to outstanding women studying computer science or related fields. Winners receive financial support and mentorship opportunities.',
        provider: 'Adobe',
        amount: '₹5,00,000',
        deadline: new Date('2026-09-30'), // Typically September
        applicationLink: 'https://adobe.com/careers/university/scholarship',
        eligibility: {
          gender: ['female'],
          minCGPA: 7.0,
          year: [2, 3],
          departments: ['CS', 'IT'],
          requiredSkills: [],
          interests: ['Software Development', 'Design', 'Technology']
        },
        tags: ['adobe', 'women', 'india', 'technology'],
        createdBy: admin._id
      },
      {
        title: 'Generation Google Scholarship (APAC)',
        description: 'Scholarship for students pursuing computer science degrees in Asia Pacific. Recipients receive $1,000 USD and are invited to the annual Google Scholars Retreat.',
        provider: 'Google',
        amount: '$1,000 USD',
        deadline: new Date('2026-12-15'), // December deadline
        applicationLink: 'https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship-apac',
        eligibility: {
          gender: ['all'],
          minCGPA: 7.0,
          year: [2, 3, 4],
          departments: ['CS', 'IT'],
          requiredSkills: [],
          interests: ['Computer Science', 'Technology']
        },
        tags: ['google', 'asia-pacific', 'scholarship'],
        createdBy: admin._id
      },
      {
        title: 'Palantir Global Impact Scholarship',
        description: 'Supporting students from traditionally underrepresented communities in technology. Includes $7,000 scholarship and mentorship.',
        provider: 'Palantir Technologies',
        amount: '$7,000 USD',
        deadline: new Date('2026-04-01'), // April deadline
        applicationLink: 'https://www.palantir.com/students/scholarship/',
        eligibility: {
          gender: ['all'],
          minCGPA: 7.5,
          year: [2, 3],
          departments: ['CS', 'IT'],
          requiredSkills: [],
          interests: ['Software Engineering', 'Data Science']
        },
        tags: ['palantir', 'diversity', 'global'],
        createdBy: admin._id
      },
      {
        title: 'Microsoft Tuition Scholarship',
        description: 'Partial tuition scholarships for students pursuing degrees in computer science, computer engineering, or related STEM disciplines.',
        provider: 'Microsoft',
        amount: 'Varies',
        deadline: new Date('2026-02-15'), // February deadline
        applicationLink: 'https://careers.microsoft.com/students/us/en/usscholarshipprogram',
        eligibility: {
          gender: ['all'],
          minCGPA: 7.5,
          year: [2, 3, 4],
          departments: ['CS', 'IT', 'ECE'],
          requiredSkills: [],
          interests: ['Software Engineering', 'Technology']
        },
        tags: ['microsoft', 'tuition', 'stem'],
        createdBy: admin._id
      },
      {
        title: 'Venkat Panchapakesan Memorial Scholarship',
        description: 'Supporting students from India pursuing computer science education. Preference given to students with financial need and strong academic records.',
        provider: 'Venkat Panchapakesan Memorial',
        amount: '$10,000 USD',
        deadline: new Date('2026-05-31'), // May deadline
        applicationLink: 'https://buildyourfuture.withgoogle.com/scholarships/venkat-panchapakesan-memorial-scholarship',
        eligibility: {
          gender: ['all'],
          minCGPA: 8.0,
          year: [2, 3, 4],
          departments: ['CS', 'IT'],
          requiredSkills: [],
          interests: ['Computer Science']
        },
        tags: ['india', 'computer-science', 'memorial'],
        createdBy: admin._id
      },
      {
        title: 'Grace Hopper Celebration Scholarship',
        description: 'Scholarship covering registration, travel, and accommodation for the Grace Hopper Celebration, the world\'s largest gathering of women technologists.',
        provider: 'AnitaB.org',
        amount: 'Full Conference Pass + Travel',
        deadline: new Date('2026-05-15'), // May deadline
        applicationLink: 'https://ghc.anitab.org/scholarships-2/',
        eligibility: {
          gender: ['female', 'other'],
          minCGPA: 7.0,
          year: [2, 3, 4],
          departments: ['CS', 'IT', 'ECE'],
          requiredSkills: [],
          interests: ['Technology', 'Networking']
        },
        tags: ['women', 'conference', 'grace-hopper'],
        createdBy: admin._id
      },
      {
        title: 'WeTech Qualcomm Global Scholarship',
        description: 'Supporting women pursuing undergraduate degrees in STEM. Recipients receive $10,000 and mentorship from Qualcomm employees.',
        provider: 'Qualcomm',
        amount: '$10,000 USD',
        deadline: new Date('2026-03-31'), // March deadline
        applicationLink: 'https://www.iie.org/programs/wetech/stem-scholarships/',
        eligibility: {
          gender: ['female'],
          minCGPA: 7.5,
          year: [2, 3],
          departments: ['CS', 'IT', 'ECE', 'EEE'],
          requiredSkills: [],
          interests: ['STEM', 'Technology']
        },
        tags: ['qualcomm', 'women', 'stem', 'global'],
        createdBy: admin._id
      }
    ]);

    // Create Programs from your list
    console.log('🎓 Creating programs...');
    
    // Calculate future deadlines
    const getDeadline = (daysFromNow) => {
      const date = new Date();
      date.setDate(date.getDate() + daysFromNow);
      return date;
    };

    const programs = await Program.create([
      // Internships & Programs
      {
        title: 'Google STEP Internship 2026',
        description: 'Student Training in Engineering Program (STEP) for first and second-year undergraduate students. Three-year program focused on developing skills and building a network. Summer 2026 internship includes coding projects, skills training, and professional development.',
        provider: 'Google',
        type: 'internship',
        duration: '10-12 weeks (Summer 2026)',
        deadline: new Date('2026-01-31'), // Typically January deadline
        applicationLink: 'https://buildyourfuture.withgoogle.com/programs/step',
        location: 'Multiple locations (USA, Canada, India)',
        eligibility: {
          gender: ['all'],
          minCGPA: 7.0,
          year: [1, 2],
          departments: ['CS', 'IT'],
          requiredSkills: [],
          interests: ['Software Engineering']
        },
        tags: ['google', 'internship', 'first-year', 'second-year'],
        createdBy: admin._id
      },
      {
        title: 'Google Summer of Code (GSoC) 2026',
        description: 'Global online program focused on bringing new contributors into open source software development. Contributors work with open source organizations on 10 or 22-week programming projects. Stipend: $1,500-$6,600 based on project size and location.',
        provider: 'Google',
        type: 'internship',
        duration: '10-22 weeks (May-September 2026)',
        deadline: new Date('2026-04-02'), // Typically early April
        applicationLink: 'https://summerofcode.withgoogle.com',
        location: 'Remote (Global)',
        eligibility: {
          gender: ['all'],
          minCGPA: 0,
          year: [1, 2, 3, 4],
          departments: ['CS', 'IT'],
          requiredSkills: ['Git', 'Programming'],
          interests: ['Open Source', 'Software Development']
        },
        tags: ['google', 'open-source', 'remote', 'stipend'],
        createdBy: admin._id
      },
      {
        title: 'GirlScript Summer of Code (GSSoC) 2026',
        description: 'India\'s largest open-source program by GirlScript Foundation. Beginners friendly 3-month program with mentor support, swags, and certificates. No registration fees. Open to students and professionals globally.',
        provider: 'GirlScript Foundation',
        type: 'coding-event',
        duration: '3 months (May-July 2026)',
        deadline: new Date('2026-04-15'), // Typically mid-April
        applicationLink: 'https://gssoc.girlscript.tech',
        location: 'Remote (India & Global)',
        eligibility: {
          gender: ['all'],
          minCGPA: 0,
          year: [1, 2, 3, 4],
          departments: ['CS', 'IT'],
          requiredSkills: [],
          interests: ['Open Source', 'Web Development']
        },
        tags: ['girlscript', 'open-source', 'india', 'beginner-friendly'],
        createdBy: admin._id
      },
      {
        title: 'Outreachy May-August 2026 Internships',
        description: 'Provides remote internships for people subject to systemic bias and impacted by underrepresentation in tech. $7,000 USD stipend, $600 travel stipend. Work on open source and open science projects. Priority to applicants from or living in Africa, Latin America, and Asia.',
        provider: 'Outreachy',
        type: 'internship',
        duration: '3 months (May-August 2026)',
        deadline: new Date('2026-02-03'), // Initial applications typically early February
        applicationLink: 'https://www.outreachy.org',
        location: 'Remote (Global)',
        eligibility: {
          gender: ['all'], // Open to people facing systemic bias
          minCGPA: 0,
          year: [2, 3, 4],
          departments: ['CS', 'IT'],
          requiredSkills: [],
          interests: ['Open Source', 'Diversity', 'Technology']
        },
        tags: ['diversity', 'underrepresented', 'open-source', 'paid'],
        createdBy: admin._id
      },
      {
        title: 'MLH Fellowship Spring 2026',
        description: '12-week remote program where students contribute to Open Source, build projects with peers, or prep for SWE interviews. Includes $5,000 stipend, mentorship from industry professionals, and career support. Three tracks: Open Source, Production Engineering, and Software Engineering.',
        provider: 'Major League Hacking',
        type: 'fellowship',
        duration: '12 weeks (Feb-May 2026)',
        deadline: new Date('2026-01-15'), // Spring batch typically mid-January
        applicationLink: 'https://fellowship.mlh.io',
        location: 'Remote (Global)',
        eligibility: {
          gender: ['all'],
          minCGPA: 0,
          year: [2, 3, 4],
          departments: ['CS', 'IT'],
          requiredSkills: ['Programming'],
          interests: ['Software Engineering', 'Open Source']
        },
        tags: ['mlh', 'fellowship', 'remote', 'paid', 'mentorship'],
        createdBy: admin._id
      },
      {
        title: 'Microsoft Engage 2026 (India)',
        description: 'Exclusive mentorship program for engineering students in India. 4-week program with project building, 1:1 mentor sessions, technical workshops, and resume building. Top performers get fast-tracked for Microsoft internship interviews. Open to students graduating in 2027 or 2028.',
        provider: 'Microsoft',
        type: 'internship',
        duration: '4 weeks (May-June 2026)',
        deadline: new Date('2026-03-31'), // Typically March/April
        applicationLink: 'https://acms.microsoft.com/engage',
        location: 'Remote (India)',
        eligibility: {
          gender: ['all'],
          minCGPA: 0,
          year: [2, 3],
          departments: ['CS', 'IT', 'ECE'],
          requiredSkills: [],
          interests: ['Software Engineering', 'Product Development']
        },
        tags: ['microsoft', 'india', 'mentorship', 'internship-track'],
        createdBy: admin._id
      },
      {
        title: 'DE Shaw Ascend Program 2026',
        description: 'Exclusive program for female students interested in technology careers. Includes technical workshops, networking sessions with women leaders at DE Shaw, and fast-track consideration for internships. Focus on algorithms, system design, and problem-solving.',
        provider: 'DE Shaw & Co',
        type: 'internship',
        duration: '2 days workshop + Internship opportunities',
        deadline: new Date('2026-09-30'), // Typically September
        applicationLink: 'https://www.deshawindia.com/ascend',
        location: 'India (Bangalore, Hyderabad)',
        eligibility: {
          gender: ['female'],
          minCGPA: 7.5,
          year: [3, 4],
          departments: ['CS', 'IT'],
          requiredSkills: ['Programming', 'Data Structures'],
          interests: ['Software Engineering', 'Finance Technology']
        },
        tags: ['de-shaw', 'women', 'india', 'internship'],
        createdBy: admin._id
      },
      {
        title: 'Google Developer Student Clubs (GDSC) Lead 2026-27',
        description: 'Lead a GDSC chapter on your campus! Organize workshops, study jams, and solution challenges. Access to Google Cloud credits, swag, and direct support from Google. Build technical and leadership skills while growing your campus tech community.',
        provider: 'Google Developers',
        type: 'ambassador',
        duration: '1 year (July 2026 - June 2027)',
        deadline: new Date('2026-06-30'), // Typically June/July
        applicationLink: 'https://developers.google.com/community/gdsc',
        location: 'Campus-based',
        eligibility: {
          gender: ['all'],
          minCGPA: 0,
          year: [2, 3, 4],
          departments: ['CS', 'IT', 'ECE'],
          requiredSkills: [],
          interests: ['Community Building', 'Leadership', 'Teaching']
        },
        tags: ['google', 'leadership', 'campus', 'community'],
        createdBy: admin._id
      },
      {
        title: 'Microsoft Learn Student Ambassadors 2026-27',
        description: 'Global program for students passionate about tech and community. Three levels: Alpha (beginner), Beta (intermediate), Gold (advanced). Benefits: Azure credits, LinkedIn Learning, exclusive events, mentorship, swag, and certificate. Build projects, host events, earn badges.',
        provider: 'Microsoft',
        type: 'ambassador',
        duration: 'Ongoing (Rolling admissions)',
        deadline: new Date('2026-12-31'), // Rolling applications
        applicationLink: 'https://studentambassadors.microsoft.com',
        location: 'Global (Campus + Virtual)',
        eligibility: {
          gender: ['all'],
          minCGPA: 0,
          year: [1, 2, 3, 4],
          departments: ['CS', 'IT', 'ECE'],
          requiredSkills: [],
          interests: ['Cloud Computing', 'Teaching', 'Community']
        },
        tags: ['microsoft', 'ambassador', 'azure', 'global'],
        createdBy: admin._id
      },
      {
        title: 'GitHub Campus Expert 2026',
        description: 'Exclusive training program to build and lead tech communities on campus. Free access to GitHub tools, swag, and funding for events. Learn community leadership, technical writing, public speaking, and git/GitHub best practices. Ongoing applications.',
        provider: 'GitHub Education',
        type: 'ambassador',
        duration: 'Ongoing program',
        deadline: new Date('2026-12-31'), // Rolling applications
        applicationLink: 'https://education.github.com/experts',
        location: 'Campus-based (Global)',
        eligibility: {
          gender: ['all'],
          minCGPA: 0,
          year: [2, 3, 4],
          departments: ['CS', 'IT'],
          requiredSkills: ['Git', 'GitHub'],
          interests: ['Open Source', 'Community Building', 'Teaching']
        },
        tags: ['github', 'campus', 'leadership', 'open-source'],
        createdBy: admin._id
      },
      // Hackathons & Conferences
      {
        title: 'Grace Hopper Celebration (GHC) 2026',
        description: 'World\'s largest gathering of women and non-binary technologists. October 2026 in Philadelphia, USA. Features keynotes, technical sessions, career fair with 600+ companies, networking, and scholarships. Apply for student scholarships covering registration + travel.',
        provider: 'AnitaB.org',
        type: 'conference',
        duration: '3 days (October 14-16, 2026)',
        deadline: new Date('2026-05-15'), // Scholarship deadline typically May
        applicationLink: 'https://ghc.anitab.org',
        location: 'Philadelphia, USA',
        eligibility: {
          gender: ['female', 'other'],
          minCGPA: 0,
          year: [2, 3, 4],
          departments: ['CS', 'IT', 'ECE', 'EEE'],
          requiredSkills: [],
          interests: ['Technology', 'Networking', 'Career Development']
        },
        tags: ['women', 'conference', 'networking', 'career-fair'],
        createdBy: admin._id
      },
      {
        title: 'Google Code Jam to I/O for Women 2026',
        description: 'Exclusive online algorithmic competition for women. Top performers win a trip to Google I/O conference. Multiple rounds: online qualifiers, online rounds, and virtual finals. Great for competitive programmers.',
        provider: 'Google',
        type: 'coding-event',
        duration: 'Multi-round (Feb-April 2026)',
        deadline: new Date('2026-02-28'), // Typically Feb/March
        applicationLink: 'https://codingcompetitions.withgoogle.com/codejamio',
        location: 'Online',
        eligibility: {
          gender: ['female'],
          minCGPA: 0,
          year: [1, 2, 3, 4],
          departments: ['CS', 'IT'],
          requiredSkills: ['Algorithms', 'Data Structures'],
          interests: ['Competitive Programming']
        },
        tags: ['google', 'women', 'coding-competition', 'algorithms'],
        createdBy: admin._id
      },
      {
        title: 'LinkedIn Wintathon 2026',
        description: 'Annual winter hackathon by LinkedIn India for students graduating in 2026-2027. 24-hour online hackathon with real-world problem statements. Winners get pre-placement interview opportunities, cash prizes, swag, and LinkedIn Premium.',
        provider: 'LinkedIn',
        type: 'hackathon',
        duration: '24 hours (December 2026)',
        deadline: new Date('2026-11-30'), // Typically November
        applicationLink: 'https://linkedin.com/wintathon',
        location: 'Online (India)',
        eligibility: {
          gender: ['all'],
          minCGPA: 0,
          year: [3, 4],
          departments: ['CS', 'IT'],
          requiredSkills: ['Programming'],
          interests: ['Problem Solving', 'Software Development']
        },
        tags: ['linkedin', 'hackathon', 'india', 'placement'],
        createdBy: admin._id
      },
      {
        title: 'She Codes Indeed 2026',
        description: 'Hackathon exclusively for women by Indeed India. Build innovative solutions, network with women engineers at Indeed, and compete for prizes. Top performers get interview opportunities for internships and full-time roles.',
        provider: 'Indeed',
        type: 'hackathon',
        duration: '24 hours',
        deadline: new Date('2026-03-08'), // Typically around International Women\'s Day
        applicationLink: 'https://indeed.com/shecodes',
        location: 'Online (India)',
        eligibility: {
          gender: ['female'],
          minCGPA: 0,
          year: [2, 3, 4],
          departments: ['CS', 'IT'],
          requiredSkills: ['Programming'],
          interests: ['Software Engineering']
        },
        tags: ['indeed', 'women', 'hackathon', 'india'],
        createdBy: admin._id
      },
      {
        title: 'Flipkart Girls Wanna Code 2026',
        description: 'Exclusive hackathon for women by Flipkart. Multi-round competition starting with online coding test, followed by hackathon. Winners receive cash prizes, pre-placement interviews, certificates, and mentorship from Flipkart women engineers.',
        provider: 'Flipkart',
        type: 'hackathon',
        duration: '2 rounds + Final hackathon',
        deadline: new Date('2026-08-31'), // Typically August/September
        applicationLink: 'https://unstop.com/flipkart-gwc',
        location: 'Online (India)',
        eligibility: {
          gender: ['female'],
          minCGPA: 7.0,
          year: [3, 4],
          departments: ['CS', 'IT'],
          requiredSkills: ['Data Structures', 'Algorithms'],
          interests: ['Software Engineering', 'E-commerce']
        },
        tags: ['flipkart', 'women', 'hackathon', 'placement'],
        createdBy: admin._id
      },
      {
        title: 'Visa Code Your Way 2026',
        description: 'Global hackathon by Visa for students. Build innovative payment solutions using Visa APIs. Focus on fintech, security, and digital payments. Winners get cash prizes, internship opportunities, and mentorship.',
        provider: 'Visa',
        type: 'hackathon',
        duration: '48 hours',
        deadline: new Date('2026-07-31'), // Typically July/August
        applicationLink: 'https://visa.com/codeyourway',
        location: 'Online (Global)',
        eligibility: {
          gender: ['all'],
          minCGPA: 0,
          year: [2, 3, 4],
          departments: ['CS', 'IT'],
          requiredSkills: ['APIs', 'Web Development'],
          interests: ['Fintech', 'Payments', 'Security']
        },
        tags: ['visa', 'hackathon', 'fintech', 'global'],
        createdBy: admin._id
      },
      {
        title: 'WomenTechmakers Ambassador 2026',
        description: 'Google\'s program empowering women in technology through visibility, community, and resources. Ambassadors organize events, workshops, and study groups. Receive Google swag, event funding, and access to exclusive WTM community.',
        provider: 'Google WomenTechmakers',
        type: 'ambassador',
        duration: '1 year (ongoing)',
        deadline: new Date('2026-12-31'), // Rolling applications
        applicationLink: 'https://www.womentechmakers.com/ambassadors',
        location: 'Global',
        eligibility: {
          gender: ['female', 'other'],
          minCGPA: 0,
          year: [2, 3, 4],
          departments: ['CS', 'IT', 'ECE'],
          requiredSkills: [],
          interests: ['Community Building', 'Women in Tech', 'Leadership']
        },
        tags: ['google', 'women', 'ambassador', 'community'],
        createdBy: admin._id
      },
      {
        title: 'Alexa Student Influencer Program 2026',
        description: 'Amazon program for students passionate about voice technology and Alexa. Build Alexa skills, create content, organize workshops. Receive Echo devices, AWS credits, certification, and direct Amazon mentorship.',
        provider: 'Amazon Alexa',
        type: 'ambassador',
        duration: '6 months',
        deadline: new Date('2026-08-31'), // Typically August
        applicationLink: 'https://developer.amazon.com/en-US/alexa/alexa-student-influencer',
        location: 'India',
        eligibility: {
          gender: ['all'],
          minCGPA: 0,
          year: [2, 3, 4],
          departments: ['CS', 'IT'],
          requiredSkills: [],
          interests: ['Voice Technology', 'AI', 'Cloud Computing']
        },
        tags: ['amazon', 'alexa', 'voice-tech', 'india'],
        createdBy: admin._id
      },
      {
        title: 'Harvard WECode 2026',
        description: 'Harvard\'s largest student-run Women Engineers\' Conference. Features tech talks, workshops, career fair, and networking. Scholarships available for students covering registration and travel. Great opportunity to connect with tech companies.',
        provider: 'Harvard University',
        type: 'conference',
        duration: '2 days (February 2026)',
        deadline: new Date('2026-01-15'), // Typically January
        applicationLink: 'https://www.harvardwecode.com',
        location: 'Cambridge, USA',
        eligibility: {
          gender: ['female', 'other'],
          minCGPA: 0,
          year: [2, 3, 4],
          departments: ['CS', 'IT', 'ECE', 'EEE'],
          requiredSkills: [],
          interests: ['Technology', 'Networking']
        },
        tags: ['harvard', 'women', 'conference', 'career'],
        createdBy: admin._id
      },
      {
        title: 'Adobe Codiva 2026',
        description: 'Adobe\'s flagship all-women coding competition in India. Multi-round online competition testing problem-solving and coding skills. Top performers get pre-placement interviews, cash prizes, and internship opportunities at Adobe India.',
        provider: 'Adobe',
        type: 'coding-event',
        duration: 'Multi-round (August-September 2026)',
        deadline: new Date('2026-08-15'), // Typically August
        applicationLink: 'https://adobe.com/codiva',
        location: 'Online (India)',
        eligibility: {
          gender: ['female'],
          minCGPA: 7.0,
          year: [3, 4],
          departments: ['CS', 'IT'],
          requiredSkills: ['Data Structures', 'Algorithms', 'Problem Solving'],
          interests: ['Competitive Programming', 'Software Engineering']
        },
        tags: ['adobe', 'women', 'coding-competition', 'india'],
        createdBy: admin._id
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Created 1 admin user`);
    console.log(`   - Created ${students.length} student users`);
    console.log(`   - Created ${scholarships.length} scholarships`);
    console.log(`   - Created ${programs.length} programs`);
    console.log(`\n🔑 Login Credentials:`);
    console.log(`   Admin: admin@college.edu / admin123`);
    console.log(`   Student 1: priya@student.edu / student123`);
    console.log(`   Student 2: rahul@student.edu / student123`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
