# Changelog

All notable changes to DoubtDesk will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Planned (v1.1)
- Custom 404 page
- Footer component
- Profile page fixes and mobile nav improvements
- README screenshot rendering

### Planned (v1.2)
- Real-time notifications
- Global search across doubts
- Helpful upvotes on community replies
- API rate limiting
- Separate login flows for students and teachers

---

## [v1.0.0] - 2026-05-22

### Added

#### Core Platform
- AI-powered doubt solver using Groq (Llama 3.3 / Llama 4) with step-by-step explanations
- LaTeX rendering for math and science equations via KaTeX
- Image-based doubt input via Tesseract.js and Vision LLMs
- Persistent AI chat history for continued doubt sessions

#### Classroom System
- Virtual classroom creation with teacher/student roles
- Invite code system for joining classrooms
- Three dedicated doubt channels per classroom:
  - **AI Solve** — instant AI-powered answers
  - **Community Board** — peer-to-peer discussion
  - **Teacher Lane** — direct teacher responses
- Anonymous posting with randomized student identifiers
- Classroom analytics dashboard:
  - Topic heatmap
  - Resolution pulse
  - Activity timeline

#### Moderation & Safety
- AI content moderation with 3-strike system
- Role-based access control for teachers and students

#### Public Features
- Public doubt board with subject filters
- Likes and replies on public doubts

#### User Experience
- User profiles with activity statistics
- Onboarding flow for university, year, and role selection
- Light and dark theme support

#### Authentication
- Clerk authentication with role-based access control
- Secure session management

#### Infrastructure
- Neon PostgreSQL database with Drizzle ORM
- Inngest background job processing
- Deployed on Vercel at [doubt-desk-seven.vercel.app](https://doubt-desk-seven.vercel.app)

---

[v1.0.0]: https://github.com/knoxiboy/DoubtDesk/releases/tag/v1.0.0
