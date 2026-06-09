# Changelog

All notable changes to AI Life Manager will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2026-06-09

### 🎉 Initial Open-Source Release

#### Features

- **Dashboard** — Unified home view with today's tasks, habits, pet reminders, travel countdown, bill alerts, weekly life score, and AI daily tips
- **Chore Division** — Family chore management with member assignment, points system, ranking leaderboard, and rotation schedules
- **Habit Tracker** — Daily check-in with streak counting, weekly statistics, category filtering, and motivational progress rings
- **Life Checklists** — 30+ scenario templates (moving, business trip, travel, camping, etc.), checkbox tracking, progress visualization
- **Shopping List** — Smart categorization (10 categories), budget tracking, fridge linkage for automatic restocking
- **Expense Tracker** — Income/expense recording, category statistics, monthly budget management, bar chart visualization
- **Bill Manager** — Payment reminders with overdue highlighting, monthly cost statistics, due date management
- **Fridge Inventory** — Food stock management with 9 categories, 3-day expiry alerts, recipe recommendations from current ingredients
- **Recipe Lookup** — 20+ recipes with favorites, quick/detailed view modes, category search, ingredient-based filtering
- **Pet Care** — Multi-pet profiles, feeding/walk reminders, pet diary, vaccine records, weight tracking
- **Travel Planner** — Trip management with packing/todo lists (full CRUD), daily itinerary, departure countdown
- **Wardrobe Manager** — Clothing inventory with dirty laundry basket, seasonal storage, outfit suggestions
- **Room Organizer** — Zone-based room management, tidying challenges, item location tracking
- **AI Assistant** — Chat-style interface with keyword-based smart suggestions that read real data across all modules
- **Global Search** — Cross-module search with grouped results, search history, and instant filtering
- **Notifications** — Cross-module reminder aggregation (fridge, subscriptions, chores, bills, pets)
- **Profile** — Notification center, data export, dark mode toggle, multi-dimensional life score (100-point scale)
- **Dark Mode** — CSS Variables-based theme system with 20+ color tokens
- **Custom TabBar** — Emoji-based icons with badge support and animated selection

#### Architecture

- 17 reusable UI components (dashboard-card, task-card, progress-ring, chart-bar, stat-card, etc.)
- 18 service modules with local-first data persistence via wx.Storage
- 6 utility modules (date, money, task, storage, mock, constants)
- Theme Behavior mixin for cross-page dark mode support
- Cross-module data intelligence (dashboard, AI assistant, notifications, life score, export)

#### Documentation

- Comprehensive English README with architecture diagrams
- Chinese README (README.zh-CN.md)
- Product requirements document
- Technical architecture document
- Mock data design specification
- Data model documentation
- 210-point manual test checklist
- Contributing guidelines (CONTRIBUTING.md)

#### Project Infrastructure

- GitHub Actions CI workflow (structure validation, file checks)
- Issue templates (Bug Report, Feature Request)
- Pull Request template
- MIT License
