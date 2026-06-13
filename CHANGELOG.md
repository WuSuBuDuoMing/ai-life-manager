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

## [1.1.0] - 2026-06-10

### Added
- English README with architecture diagrams, badges, and comprehensive documentation
- Chinese README (README.zh-CN.md) for bilingual support
- GitHub Actions CI workflow (structure validation, file checks)
- Issue templates (Bug Report, Feature Request)
- Pull Request template
- CONTRIBUTING.md (bilingual English/Chinese)
- CHANGELOG.md (this file)
- Multi-platform installation guide in Release notes
- npm package configuration (publish.yml workflow)
- Website and Topics added to GitHub repository

### Changed
- Repository made public for open-source community
- All commit authors unified to WuSuBuDuoMing

## [1.3.0] - 2026-06-14

### Changed
- Local optimization and performance improvements
- Project documentation update
- CHANGELOG sync across repositories
- Open-source infrastructure enhancement

## [1.2.0] - 2026-06-11

### Fixed
- **Bug**: `profile.js` called nonexistent `loadData()` after cache clear — now correctly calls `loadStats()` + `loadReminders()` + `loadLifeScore()`
- **Dead code**: Removed redundant `toggleTheme()` from profile page (already provided by `theme-behavior.js`)
- **Redundancy**: Removed duplicate `isDark: false` from profile page data (provided by behavior)
- **Version mismatch**: Updated help/about dialogs to show correct version (was showing v2.0)

### Added
- **Unit tests**: 5 test suites with 87 assertions covering core utilities and services
  - `tests/wx-mock.js` — wx API mock for Node.js testing
  - `tests/date-utils.test.js` — 26 tests for date formatting, comparison, and calculation
  - `tests/money-utils.test.js` — 20 tests for currency formatting and budget math
  - `tests/task-utils.test.js` — 20 tests for sorting, filtering, grouping, and ID generation
  - `tests/bill-service.test.js` — 19 tests for bill CRUD, payment, and statistics
  - `tests/habit-service.test.js` — 22 tests for habit CRUD, toggle, streaks, and weekly data
- **JSDoc comments**: Added comprehensive JSDoc documentation to all public functions in:
  - `services/bill-service.js` (8 functions)
  - `services/habit-service.js` (6 functions)
  - `services/recipe-service.js` (7 functions)
  - `services/travel-service.js` (8 functions)
  - `services/room-service.js` (8 functions)
  - `services/shopping-service.js` (7 functions)
  - `services/subscription-service.js` (7 functions)
  - `services/checklist-service.js` (6 functions)
  - `services/chore-service.js` (5 functions)
  - `services/assistant-service.js` (1 function)
  - `utils/date-utils.js` (15 functions — full rewrite with expanded formatting)
  - `utils/money-utils.js` (9 functions — full rewrite with expanded formatting)
  - `utils/task-utils.js` (10 functions — full rewrite with expanded formatting)

### Changed
- **Code style**: Removed inconsistent semicolons from `bill-service.js`, `habit-service.js`, `recipe-service.js`, `travel-service.js` (now consistent with majority of codebase)
- **Room service**: Changed file header from `// 注释` to `/** JSDoc */` format
- **README.md**: Added test section and tests/ directory to project structure
- **README.zh-CN.md**: Added test running instructions
