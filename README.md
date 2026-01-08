# 🎓 ScholarLens - College Scholarship & Programs Platform

A comprehensive web platform for discovering scholarships and programs with AI-powered personalized matching based on student profiles.

## ✨ Features

### For Students:
- 🎯 Personalized Matching — tailored to CGPA, department, skills, interests
- ⏰ Smart Deadline Sorting — urgent opportunities first
- 📊 Two views — "My Matches" (eligible) and "All Opportunities"
- 🤖 AI Chatbot — quick answers about scholarships and usage
- 🔍 Filtering — by type, deadline, provider, etc.

### For Admins:
- ➕ Manage scholarships/programs (CRUD)
- 👥 View eligible students per opportunity
- 📈 Dashboard stats
- ⚡ Fast bulk-style entry forms

## 🏗️ Tech Stack
- Backend: Node.js + Express
- DB: MongoDB + Mongoose
- Auth: JWT
- Frontend: HTML/CSS/Vanilla JS
- Security: bcrypt password hashing

## 🚀 Setup
1) Install deps
```bash
npm install
```
2) Configure .env (already present)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/scholarship_platform
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```
3) Run MongoDB (local or Atlas)
4) Seed real 2026 data
```bash
node seed.js
```
Creates: 1 admin, 2 students, 8 scholarships, 15+ programs/events (Google STEP, GSoC, GSSoC, Outreachy, MLH, Engage, DE Shaw Ascend, GDSC, GitHub Campus Expert, GHC, Flipkart GWC, Adobe Codiva, etc.).
5) Start server
```bash
npm start
# or
npm run dev
```
Server: http://localhost:3000

## 🔑 Default Logins
- Admin: admin@college.edu / admin123
- Student: priya@student.edu / student123 (F, CS, 8.5)
- Student: rahul@student.edu / student123 (M, IT, 7.8)

## 📚 2026 Opportunities Included
### Scholarships
1) Google Women Techmakers Scholars — $10k — Dec 2026
2) Adobe India WIT — ₹5,00,000 — Sep 2026
3) Generation Google APAC — $1k — Dec 2026
4) Palantir Global Impact — $7k — Apr 2026
5) Microsoft Tuition — varies — Feb 2026
6) Venkat Panchapakesan — $10k — May 2026
7) Grace Hopper Scholarship — pass+travel — May 2026
8) WeTech Qualcomm — $10k — Mar 2026

### Programs / Internships
- Google STEP 2026 — Jan deadline
- GSoC 2026 — Apr deadline — $1.5k–$6.6k
- GSSoC — Apr — beginner-friendly
- Outreachy — Feb — $7k
- MLH Fellowship — Jan — $5k
- Microsoft Engage — Mar — India
- DE Shaw Ascend — Sep — women-only

### Ambassador
- GDSC Lead, Microsoft Learn Ambassadors, GitHub Campus Expert, WomenTechmakers Ambassador, Alexa Student Influencer

### Hackathons / Events
- Grace Hopper Celebration (Oct 2026)
- Google Code Jam to I/O for Women
- LinkedIn Wintathon, She Codes Indeed, Flipkart GWC, Visa Code Your Way
- Harvard WECode, Adobe Codiva

## 📱 Usage
Students: Register → complete profile → My Matches → Apply → Chatbot help.
Admins: Login → add opportunities → view eligible students → manage.

## 🎯 Matching Criteria
Gender, CGPA, year, department, skills, interests, location.

## 📊 API (key routes)
- POST /api/auth/register | /login | /me | /profile
- GET /api/scholarships, /scholarships/by-deadline, /scholarships/eligible, /scholarships/:id
- GET /api/programs, /programs/by-deadline, /programs/eligible, /programs/type/:type
- Admin CRUD under /api/admin/scholarships and /api/admin/programs + eligible-students

## 🤖 Chatbot
Helps with finding items, eligibility, navigation, deadlines, profile tips.

## 🔒 Security
bcrypt hashing, JWT auth, role-based access, protected admin routes, basic validation.

## 🐛 Troubleshooting
- Mongo not running ⇒ start mongod / check MONGODB_URI
- Port busy ⇒ change PORT
- No data ⇒ run `node seed.js`

## 📂 Structure (trimmed)
```
models/        # User, Scholarship, Program
routes/        # auth, scholarships, programs, admin/*
middleware/    # auth.js
public/        # html, css, js (dashboards, chatbot)
server.js
seed.js
.env
```

**Built for students to discover 2026 scholarships and programs.**