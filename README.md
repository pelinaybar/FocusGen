# FocusGen — Real-Time Classroom Focus Tracking

FocusGen is a team-built web application that explores real-time classroom focus analysis and presents actionable views for teachers and students.

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![face-api.js](https://img.shields.io/badge/face--api.js-F7DF1E?logo=javascript&logoColor=111)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

## Product Overview

The application provides separate teacher and student experiences. Students can join a class and view their personal focus indicator, while teachers can manage classes, publish announcements, and inspect aggregate statistics.

## Features

- Browser-based face analysis with `face-api.js`
- Teacher and student dashboards
- Class creation and join-code flow
- Classroom announcements
- Individual and class-level focus indicators
- Responsive React interface
- FastAPI backend with PostgreSQL and SQLAlchemy
- Alembic database migrations
- Docker and local setup scripts

## Architecture

```text
.
├── src/          # React application
├── public/       # Static assets and face-api models
├── backend/      # FastAPI, schemas, services, and persistence
├── Dockerfile
└── docker-compose.yml
```

## Requirements

- Node.js 16+
- Python 3.9+
- PostgreSQL 12+
- Git

## Local Development

```bash
git clone https://github.com/pelinaybar/FocusGen.git
cd FocusGen
npm install
```

Create and activate a Python virtual environment in `backend/`, install its requirements, configure the database connection, and run migrations. Then start both services:

```bash
# backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# frontend, from the repository root
npm run dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

## Responsible Use

Focus-related signals inferred from a camera can be imperfect and sensitive. Any real-world use should include informed consent, transparent limitations, privacy safeguards, accessibility considerations, and meaningful human oversight.

## Team

| Name | Role |
|---|---|
| Fethiye Helvacılar | Product Owner |
| Andaç Semercioğlu | Scrum Master |
| Pelin Aybar | Backend Developer |
| Aslı Sude Tetik | Frontend Developer |
| Betül Alpaslan | Developer |

Project sprint notes are available in [Sprintler.md](Sprintler.md), with an additional summary in [PROJE_ÖZETİ.md](PROJE_%C3%96ZET%C4%B0.md).

---

[Portfolio](https://pelinaybar.com) · [GitHub Profile](https://github.com/pelinaybar)
