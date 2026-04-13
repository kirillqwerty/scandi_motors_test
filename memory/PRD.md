# Scandi Motors — Сайт автосалона

## Problem Statement
Сайт-визитка для Scandi Motors — продажа автомобилей в Минске + подбор из Европы + кредит/лизинг + комиссия.

## Architecture
- **Backend**: FastAPI + MongoDB (Motor)
- **Frontend**: React + TailwindCSS + Framer Motion
- **DB**: MongoDB (cars, articles, submissions collections)
- **Auth**: Simple token-based admin auth

## Implemented (v2 - Dec 2025)
- Landing page with gold/black color scheme (#FFC631), Scandi Motors logo
- Full catalog page (/catalog) with search + filter (Europe/Commission)
- Car detail page (/catalog/:id) with full specs grid
- Credit & Leasing info page (/credit)
- Commission sales page (/commission)
- Europe car import page (/europe) with marquee, steps, countries
- Articles/Blog system (/articles, /articles/:id) with admin CRUD
- Admin panel with 3 tabs: Cars, Articles, Submissions
- Contact form with service type selector

## API Routes
- Cars: GET/POST/PUT/DELETE /api/cars, GET /api/cars/:id
- Articles: GET/POST/PUT/DELETE /api/articles, GET /api/articles/:id
- Submissions: POST/GET/DELETE /api/submissions
- Admin: POST /api/admin/login, POST /api/seed

## Backlog
- P1: Telegram bot integration for submissions
- P1: Image upload for cars and articles
- P2: SEO meta tags per page
- P3: Multi-language (BY/RU/EN)
