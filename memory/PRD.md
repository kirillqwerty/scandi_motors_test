# AutoMinsk — Сайт-визитка автосалона

## Problem Statement
Сайт-визитка для компании по продаже автомобилей в Минске + подбор авто из Европы.

## Architecture
- **Backend**: FastAPI + MongoDB (Motor)
- **Frontend**: React + TailwindCSS + Framer Motion
- **DB**: MongoDB (cars, submissions collections)
- **Auth**: Simple token-based admin auth

## User Personas
- **Покупатель**: просмотр каталога, отправка заявки
- **Администратор**: управление каталогом и заявками

## Core Requirements
- Лендинг с секциями: Hero, О компании, Каталог, Подбор из Европы, Контакты
- Форма обратной связи (сохранение в БД)
- Админ-панель: CRUD авто + управление заявками

## What's Been Implemented (Dec 2025)
- Full landing page with dark luxury theme (Cabinet Grotesk + Outfit fonts)
- Car catalog with 6 seeded cars from MongoDB
- Contact form with service type selector and validation
- Admin panel with login, car CRUD, submissions management
- Glassmorphism header, scroll animations (Framer Motion), Marquee
- Europe car selection service section with 4-step process

## API Routes
- GET /api/cars, POST /api/cars, PUT /api/cars/{id}, DELETE /api/cars/{id}
- POST /api/submissions, GET /api/submissions, DELETE /api/submissions/{id}
- POST /api/admin/login, POST /api/seed

## Backlog
- P1: Telegram bot integration for form submissions
- P1: Image upload for car photos
- P2: Car detail page with full specifications
- P2: Search/filter in catalog
- P3: Multi-language support (BY/RU/EN)
