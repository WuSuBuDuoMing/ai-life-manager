<div align="center">

# AI Life Manager

### An All-in-One Lifestyle Management WeChat Mini Program

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.16.0-blue.svg)](CHANGELOG.md)
[![WeChat Mini Program](https://img.shields.io/badge/Platform-WeChat%20Mini%20Program-07C160?logo=wechat&logoColor=white)](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black)]()
[![CI](https://github.com/WuSuBuDuoMing/ai-life-manager/actions/workflows/ci.yml/badge.svg)](https://github.com/WuSuBuDuoMing/ai-life-manager/actions/workflows/ci.yml)
[![GitHub Stars](https://img.shields.io/github/stars/WuSuBuDuoMing/ai-life-manager?style=social)](https://github.com/WuSuBuDuoMing/ai-life-manager)
[![GitHub Issues](https://img.shields.io/github/issues/WuSuBuDuoMing/ai-life-manager)](https://github.com/WuSuBuDuoMing/ai-life-manager/issues)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/WuSuBuDuoMing/ai-life-manager)](https://github.com/WuSuBuDuoMing/ai-life-manager/commits/main)

**[Chinese / 中文文档](README.zh-CN.md)** | [Report Bug](https://github.com/WuSuBuDuoMing/ai-life-manager/issues/new?template=bug_report.md) | [Request Feature](https://github.com/WuSuBuDuoMing/ai-life-manager/issues/new?template=feature_request.md) | [Changelog](CHANGELOG.md)

</div>

---

## Overview

**AI Life Manager** is a **local-first, all-in-one lifestyle management** WeChat Mini Program designed for young people living independently. It integrates **17 feature modules** — from chore division and habit tracking to fridge inventory, pet care, travel planning, bill reminders, and an AI life assistant — all in a clean, card-based UI with dark mode support.

**Zero backend required.** All data is stored locally via `wx.Storage`. No accounts, no servers, no internet dependency.

### Open Source Commitment

This project is developed as an open-source initiative, built entirely in public with the [vibe-coding methodology](docs/vibe-coding-pitch.md). Every line of code was AI-assisted and human-reviewed, demonstrating how modern tools can empower solo developers to build production-quality applications.

<div align="center">

```
┌──────────────────────────────────────────────────┐
│           WeChat Mini Program Native Framework    │
├────────────────┬─────────────────┬────────────────┤
│    Page Layer  │   Service Layer │   Data Layer   │
│  WXML + WXSS   │   JavaScript    │  wx.Storage    │
│  Componentized │   18 Services   │  Mock Data     │
│  CSS Variables │   6 Utilities   │  JSON Models   │
│  Dark Mode     │   Cross-module  │  Local-First   │
└────────────────┴─────────────────┴────────────────┘
```

</div>

## Why AI Life Manager?

- **No signup, no cloud, no tracking** — your data stays on your device
- **17 integrated modules** that share data intelligently, not 17 separate apps
- **AI-powered suggestions** that read your real fridge inventory, habits, and bills
- **Zero image assets** — the entire UI uses emoji icons for maximum portability
- **Dark mode** with 20+ CSS Variables theme tokens
- **Gamified life score** (100 points across 7 dimensions) to keep you motivated
- **Built entirely with AI** — open development process, fully documented
- **Zero npm dependencies** — runs purely in WeChat Mini Program runtime
- **107+ unit tests** across 5 test suites with custom wx API mock framework

---

## Features

| Module | Description | Key Capabilities |
|:-------|:------------|:-----------------|
| 🏡 **Dashboard** | Unified home view | Today's tasks, habits, pet reminders, travel countdown, bill alerts, weekly life score, AI daily tips |
| 🧹 **Chore Division** | Family chore management | Member assignment, points system, ranking leaderboard, rotation schedules |
| ✅ **Habit Tracker** | Daily check-in | Streak counting, weekly statistics, category filtering, motivational progress rings |
| 📋 **Life Checklists** | Scenario templates | 30+ templates (moving, business trip, travel, camping), checkbox tracking, progress visualization |
| 🛒 **Shopping List** | Smart categorization | 10 categories, budget tracking, fridge linkage for automatic restocking |
| 💰 **Expense Tracker** | Financial tracking | Income/expense recording, category statistics, monthly budget management, bar chart visualization |
| 💳 **Bill Manager** | Payment reminders | Overdue highlighting, monthly cost statistics, due date management |
| 🧊 **Fridge Inventory** | Food stock management | 9 categories, 3-day expiry alerts, recipe recommendations from current ingredients |
| 🍳 **Recipe Lookup** | Recipe database | 20+ recipes with favorites, quick/detailed view modes, category search, ingredient-based filtering |
| 🐕 **Pet Care** | Multi-pet profiles | Feeding/walk reminders, pet diary, vaccine records, weight tracking |
| ✈️ **Travel Planner** | Trip management | Packing/todo lists (full CRUD), daily itinerary, departure countdown |
| 👔 **Wardrobe Manager** | Clothing inventory | Dirty laundry basket, seasonal storage, outfit suggestions |
| 🏠 **Room Organizer** | Zone-based room management | Tidying challenges, item location tracking |
| 🤖 **AI Assistant** | Smart suggestions | Chat-style interface, keyword-based suggestions that read real data across all modules |
| 🔍 **Global Search** | Cross-module search | Grouped results, search history, instant filtering |
| 🔔 **Notifications** | Reminder aggregation | Cross-module alerts from fridge, subscriptions, chores, bills, pets |
| 👤 **Profile** | Settings & score | Notification center, data export, dark mode toggle, multi-dimensional life score (100-point scale) |

---

## Architecture

### Design Philosophy

- **Local-First**: All data lives in `wx.Storage` — no server, no account, no privacy concerns
- **Service Layer Pattern**: 18 service modules handle all business logic and data persistence
- **Component-Based UI**: 17 reusable custom components with consistent design language
- **Cross-Module Intelligence**: Dashboard, AI Assistant, Notifications, and Life Score all aggregate data from every module
- **Emoji-Only Design**: Zero image assets — the entire UI uses emoji icons for maximum portability
- **Behavior Mixins**: Shared dark mode behavior via `theme-behavior.js` for consistent theming

### Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Framework** | WeChat Mini Program (Native) |
| **Language** | JavaScript ES6+ |
| **Styling** | WXSS + CSS Variables (20+ theme tokens) |
| **Data** | wx.Storage with mock service layer (swappable to real backend) |
| **Components** | 17 custom components with Behavior mixins |
| **Theming** | Light/Dark mode via CSS Variables + `theme-behavior.js` |
| **Animations** | 10+ CSS animations (fadeIn, slideUp, bounceIn, shimmer, etc.) |
| **Testing** | Custom test framework with wx API mock (128 assertions across 6 suites) |

### Project Structure

```
ai-life-manager/
├── app.js / app.json / app.wxss     # Entry point, config, global styles (660+ lines)
├── custom-tab-bar/                   # Custom tabBar with emoji icons & badges
├── behaviors/
│   └── theme-behavior.js             # Dark mode Behavior mixin
│
├── pages/                            # 17 feature pages
│   ├── index/                        #   Dashboard (data cards, habits, reminders)
│   ├── chores/                       #   Chore division (search, ranking, stats)
│   ├── checklists/                   #   Life checklists (30+ templates)
│   ├── shopping/                     #   Shopping list (categories, budget)
│   ├── subscriptions/                #   Subscription management (renewal alerts)
│   ├── budget/                       #   Expense tracking (charts, stats)
│   ├── fridge/                       #   Fridge inventory (expiry alerts)
│   ├── recipes/                      #   Recipe lookup (20+ recipes, favorites)
│   ├── pets/                         #   Pet care (diary, vaccines, weight)
│   ├── travel/                       #   Travel planning (itinerary, packing)
│   ├── wardrobe/                     #   Wardrobe & laundry management
│   ├── room/                         #   Room organization (zones, challenges)
│   ├── habits/                       #   Habit tracking (streaks, stats)
│   ├── bills/                        #   Bill management (reminders, overdue)
│   ├── assistant/                    #   AI life assistant (chat UI)
│   ├── search/                       #   Global cross-module search
│   └── profile/                      #   Profile, settings, data export, life score
│
├── components/                       # 17 reusable UI components
│   ├── dashboard-card/               #   Stat cards for dashboard
│   ├── task-card/                    #   Task/chore display
│   ├── chore-card/                   #   Chore-specific card
│   ├── checklist-card/               #   Checklist item
│   ├── shopping-item/                #   Shopping list item
│   ├── subscription-card/            #   Subscription service card
│   ├── expense-card/                 #   Expense record card
│   ├── food-card/                    #   Fridge food item
│   ├── wardrobe-card/                #   Clothing item card
│   ├── room-zone-card/               #   Room zone card
│   ├── progress-ring/                #   Circular progress indicator
│   ├── chart-bar/                    #   Bar chart visualization
│   ├── stat-card/                    #   Statistics card with trend
│   ├── search-bar/                   #   Search input
│   ├── empty-state/                  #   Empty state placeholder
│   ├── loading-state/                #   Skeleton / spinner
│   └── nav-bar/                      #   Custom navigation bar
│
├── services/                         # 18 business logic modules (all with JSDoc)
│   ├── dashboard-service.js          #   Aggregates all modules for home view
│   ├── chore-service.js              #   Chore CRUD + points system
│   ├── checklist-service.js          #   Checklist + 30 templates
│   ├── shopping-service.js           #   Shopping list + categories
│   ├── subscription-service.js       #   Subscription tracking + alerts
│   ├── budget-service.js             #   Expense management + stats
│   ├── fridge-service.js             #   Fridge inventory + 9 categories
│   ├── wardrobe-service.js           #   Wardrobe management
│   ├── room-service.js               #   Room organization
│   ├── habit-service.js              #   Habit tracking + streaks
│   ├── recipe-service.js             #   Recipe database + favorites
│   ├── pet-service.js                #   Pet profiles + reminders + diary
│   ├── travel-service.js             #   Travel plans + itinerary
│   ├── bill-service.js               #   Bill management + overdue alerts
│   ├── assistant-service.js          #   AI assistant (10 keyword rule modules)
│   ├── notification-service.js       #   Cross-module reminder aggregation
│   ├── export-service.js             #   Data overview + text export
│   └── life-score-service.js         #   7-dimension life score (100 pts)
│
├── utils/                            # 6 utility modules
│   ├── constants.js                  #   Centralized constants (categories, keys, rules)
│   ├── date-utils.js                 #   Date formatting & calculations
│   ├── money-utils.js                #   Currency formatting & budget math
│   ├── task-utils.js                 #   Task sorting, filtering, grouping
│   ├── storage-utils.js              #   wx.Storage wrapper with batch ops
│   └── mock-utils.js                 #   Mock data infrastructure
│
├── tests/                            # Unit tests
│   ├── wx-mock.js                    #   wx API mock for testing
│   ├── date-utils.test.js            #   Date utility tests (26 assertions)
│   ├── money-utils.test.js           #   Money utility tests (20 assertions)
│   ├── task-utils.test.js            #   Task utility tests (20 assertions)
│   ├── bill-service.test.js          #   Bill service tests (19 assertions)
│   ├── habit-service.test.js         #   Habit service tests (22 assertions)
│   └── storage-utils.test.js         #   Storage utility tests (21 assertions)
│
└── docs/                             # Project documentation
    ├── product-requirements.md       #   PRD
    ├── technical-architecture.md     #   Architecture deep-dive
    ├── data-model.md                 #   Data structures
    ├── mock-data-design.md           #   Mock data specification
    ├── feature-map.md                #   Feature module map
    ├── manual-test-checklist.md      #   210 test cases
    └── next-steps.md                 #   Roadmap
```

---

## Quick Start

### Prerequisites

- [WeChat DevTools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) installed
- A WeChat Mini Program AppID (or use the test AppID for preview)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/WuSuBuDuoMing/ai-life-manager.git
cd ai-life-manager

# 2. Open WeChat DevTools → Import Project
#    Select the cloned folder as the project directory

# 3. Replace AppID in project.config.json
#    "appid": "your-app-id-here"

# 4. Run in simulator — no build step needed!
```

> **Note:** This project has zero npm dependencies. It runs entirely within the WeChat Mini Program runtime.

### Running Tests

```bash
# Run individual test suites (Node.js required)
node tests/date-utils.test.js
node tests/money-utils.test.js
node tests/task-utils.test.js
node tests/bill-service.test.js
node tests/habit-service.test.js
```

---

## Deployment to WeChat Developer Tools

### Step 1: Download & Install WeChat DevTools

| Platform | Download Link | Notes |
|----------|--------------|-------|
| macOS (Intel) | [Download](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) | Drag to Applications |
| macOS (Apple Silicon) | [Download](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) | Native M1/M2/M3 support |
| Windows 64-bit | [Download](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) | Run installer |
| Windows 32-bit | [Download](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) | For older systems |

> **Warning:** WeChat DevTools >= 1.06.2301010

### Step 2: Clone the Repository

**macOS / Linux:**
```bash
git clone https://github.com/WuSuBuDuoMing/ai-life-manager.git
cd ai-life-manager
```

**Windows (PowerShell):**
```powershell
git clone https://github.com/WuSuBuDuoMing/ai-life-manager.git
cd ai-life-manager
```

> **Note:** This project has zero npm dependencies. No `npm install` is needed -- it runs entirely within the WeChat Mini Program runtime.

### Step 3: Import Project into WeChat DevTools

1. Open **WeChat Developer Tools**
2. On the welcome screen, click the **+** (Import Project) button
3. In the import dialog:
   - **Project Directory:** Browse to the cloned repository folder
   - **AppID:** Enter your Mini Program AppID (get it from [MP Backend](https://mp.weixin.qq.com/))
     - Or use the **Test AppID** (测试号) for quick preview
   - **Project Name:** Auto-filled from the folder name
4. Click **Import** (确定)

> **Tip:** If you don't have an AppID yet, click "Test Account" (测试号) to use a sandbox environment.

### Step 4: Compile & Preview

1. After import, the simulator panel opens automatically on the left
2. The app compiles and renders in the simulator
3. Use the simulator toolbar to:
   - Switch phone models (iPhone 14, Pixel 7, etc.)
   - Toggle dark mode
   - Adjust network speed (WiFi, 4G, Offline)
   - Rotate screen orientation

### Step 5: Test on Real Device

**Method A: Preview (预览)**
1. Click the **Preview** (预览) button in the toolbar
2. A QR code appears -- scan it with your phone's WeChat
3. The mini program loads on your real device

**Method B: Real-time Debug (真机调试)**
1. Click **Real-time Debug** (真机调试) in the toolbar
2. Scan the QR code with your phone
3. A debug panel opens in DevTools showing console logs, network requests, and storage

### Step 6: Upload for Review (提交审核)

1. Click **Upload** (上传) in the toolbar
2. Fill in:
   - **Version:** e.g., `1.0.0`
   - **Description:** What changed in this version
3. Click **Upload**
4. Go to [MP Backend](https://mp.weixin.qq.com/) -> **Management** -> **Version Management**
5. Click **Submit for Review** (提交审核)
6. Wait for WeChat's review (usually 1-7 days)

### Step 7: Release (发布)

1. After review approval, go to **Version Management** in MP Backend
2. Click **Release** (全量发布)
3. The mini program is now live for all users!

---

### Alternative: Linux CLI Deployment (miniprogram-ci)

For Linux servers or CI/CD pipelines, use [miniprogram-ci](https://www.npmjs.com/package/miniprogram-ci):

```bash
# Install
npm install -g miniprogram-ci

# Generate CI private key from MP Backend > Development > Upload Key
# Save as ci-private.key

# Preview (QR code for scanning)
miniprogram-ci preview \
  --appid YOUR_APPID \
  --pk-version 1 \
  --pk-branch main \
  --private-key-path ci-private.key \
  --desc "Preview"

# Upload (submit for review)
miniprogram-ci upload \
  --appid YOUR_APPID \
  --pk-version 1 \
  --pk-branch main \
  --private-key-path ci-private.key \
  --desc "Release v1.0.0"
```

### Docker CI/CD

```yaml
# docker-compose.yml
version: '3'
services:
  miniprogram-ci:
    image: nicepkg/miniprogram-ci:latest
    volumes:
      - .:/app
      - ./ci-private.key:/app/ci-private.key
    command: miniprogram-ci upload --appid YOUR_APPID --pk-version 1 --private-key-path ci-private.key
```

---

### Troubleshooting

| Problem | Solution |
|---------|----------|
| "AppID does not exist" | Verify your AppID in MP Backend, or use test AppID |
| Simulator shows blank page | Check `app.json` pages array, ensure all files exist |
| Upload fails with "version exists" | Increment the version number in project.config.json |
| Real device shows different layout | Enable "Remote Debug" to check CSS/rendering differences |

---

## Design System

### Color Palette

| Token | Light Mode | Dark Mode |
|:------|:-----------|:----------|
| Background | `#F5F0EB` | `#1A1A2E` |
| Card | `#FFFFFF` | `#252540` |
| Primary | `#4CAF50` | `#66BB6A` |
| Secondary | `#FF9800` | `#FFA726` |
| Accent | `#FF7043` | `#FF7043` |
| Text Primary | `#2C2C2C` | `#E8E8E8` |
| Text Secondary | `#888888` | `#888888` |

### Theme Implementation

```css
/* Light theme (default) */
page {
  --bg-primary: #F5F0EB;
  --bg-card: #FFFFFF;
  --text-primary: #2C2C2C;
  --color-primary: #4CAF50;
}

/* Dark theme */
page.dark {
  --bg-primary: #1A1A2E;
  --bg-card: #252540;
  --text-primary: #E8E8E8;
  --color-primary: #66BB6A;
}
```

---

## Cross-Module Intelligence

One of the most powerful aspects of AI Life Manager is how its modules work together:

```
┌──────────────────────────────────────────────┐
│                 Dashboard                     │
│  (Reads from ALL modules → unified home view) │
└──────────────────────┬───────────────────────┘
                       │
     ┌─────────────────┼─────────────────┐
     v                 v                 v
┌─────────┐    ┌──────────────┐    ┌──────────────┐
│  AI     │    │ Notification │    │  Life Score  │
│Assistant│    │   Service    │    │   (100 pts)  │
│(10 rules│    │ (6 modules)  │    │(7 dimensions)│
│+context)│    │              │    │              │
└─────────┘    └──────────────┘    └──────────────┘

Data flows:
  Fridge → Shopping    (expiring items → restock list)
  Fridge → Recipes     (current stock → meal suggestions)
  All → Notifications  (reminders from fridge, bills, subs, chores, pets)
  All → AI Assistant   (context-aware advice from real user data)
  All → Life Score     (7-dimension scoring: chores, habits, fridge, bills, room, budget, shopping)
```

---

## Life Score System

A gamified 100-point scoring system across 7 life dimensions:

| Dimension | Max Points | What It Measures |
|:----------|:-----------|:-----------------|
| Chores | 20 | Task completion rate |
| Habits | 20 | Daily check-in consistency |
| Fridge | 15 | Food waste (fewer expired = higher) |
| Bills | 15 | Payment punctuality |
| Room | 10 | Organization progress |
| Budget | 10 | Spending discipline |
| Shopping | 10 | List management efficiency |

**Levels:** Beginner -> Apprentice -> Skilled -> Expert -> Master

---

## API Reference

Each service module exposes a clean, Promise-based API. All functions return `Promise` objects via `mockAsync()`.

### Service API Summary

| Service | Key Functions | Description |
|:--------|:-------------|:------------|
| `dashboard-service` | `getDashboardData()`, `getTodayChores()`, `getGreeting()` | Aggregated home view data |
| `chore-service` | `getChores()`, `completeChore(id)`, `getLeaderboard()`, `getWeeklySchedule()`, `generateWeeklyPlan()` | Chore CRUD + points |
| `checklist-service` | `getChecklists()`, `getTemplates()`, `createFromTemplate(id)`, `toggleChecklistItem(cId, iId)` | 30+ scenario templates |
| `shopping-service` | `getItems()`, `addItem(item)`, `togglePurchased(id)`, `addFromFridge()` | Shopping + fridge linkage |
| `subscription-service` | `getSubscriptions()`, `calculateMonthlyTotal(subs)`, `getAISavingTips(subs)` | Subscription tracking |
| `budget-service` | `getRecords()`, `addRecord(r)`, `getMonthlyTotal(m, y)`, `getWeeklyTrend()`, `getAnomalies()` | Expense management |
| `fridge-service` | `getItems()`, `getExpiringItems(days)`, `getRecipeRecommendations()`, `getWeeklyMenu()` | Fridge inventory |
| `wardrobe-service` | `getClothes()`, `getLaundryBasket()`, `getWeeklyOutfit()`, `getWashingReminder()` | Clothing management |
| `room-service` | `getZones()`, `addTask(task)`, `completeTask(id)`, `getWeeklyChallenge()` | Room organization |
| `habit-service` | `getHabits()`, `toggleToday(id)`, `getHabitStats()`, `getWeeklyData(id)` | Habit tracking |
| `recipe-service` | `getRecipes()`, `searchRecipes(kw)`, `toggleFavorite(id)`, `getSuggestions(ingredients)` | Recipe database |
| `pet-service` | `getPet()`, `addReminder(r)`, `getDiary()`, `getVaccines()`, `getWeightHistory()` | Pet profiles |
| `travel-service` | `getPlans()`, `addPlan(p)`, `toggleTodo(pId, tId)`, `getDaysUntil(pId)` | Travel planning |
| `bill-service` | `getBills()`, `markPaid(id)`, `getUpcoming(days)`, `getMonthlyTotal()` | Bill reminders |
| `assistant-service` | `ask(question)` | AI suggestions (10 keyword rules) |
| `notification-service` | `getAllReminders()`, `getReminderCounts()`, `getDailySummary()` | Cross-module alerts |
| `export-service` | `getLifeOverview()`, `exportAsText()` | Data export |
| `life-score-service` | `getLifeScore()` | 7-dimension life score |

### Utility API Summary

| Module | Key Functions | Description |
|:-------|:-------------|:------------|
| `mock-utils` | `mockAsync(data, delay)`, `getFromStorage(key, def)`, `setToStorage(key, data)`, `generateId()` | Core storage + mock infra |
| `date-utils` | `formatDate(date)`, `isToday(date)`, `daysUntil(date)`, `getWeekRange()`, `getRelativeTime(date)` | Date formatting & calculation |
| `money-utils` | `formatMoney(amount)`, `calculatePercentage(v, t)`, `sumByCategory(records)`, `getBudgetStatus(usage)` | Currency formatting |
| `task-utils` | `sortByDate(items)`, `filterByStatus(items, s)`, `groupByDate(items)`, `getOverdueItems(items)` | Task sorting & filtering |
| `storage-utils` | `get(key)`, `set(key, val)`, `getList(key)`, `addToList(key, item)`, `getStorageInfo()` | wx.Storage wrapper |
| `constants` | `PAGES`, `STORAGE_KEYS`, `BUDGET_CATEGORIES`, `FOOD_CATEGORIES`, `POINTS_RULES` | Centralized constants |

---

## Testing

The project includes a lightweight custom testing framework with a wx API mock:

| Test Suite | Assertions | Coverage |
|:-----------|:-----------|:---------|
| `date-utils.test.js` | 26 | Date formatting, comparison, calculation |
| `money-utils.test.js` | 20 | Currency formatting, budget math |
| `task-utils.test.js` | 20 | Sorting, filtering, grouping, ID generation |
| `bill-service.test.js` | 19 | Bill CRUD, payment, statistics |
| `habit-service.test.js` | 22 | Habit CRUD, toggle, streaks, weekly data |
| `storage-utils.test.js` | 21 | Storage CRUD, list ops, batch ops, info |

**Total: 128 assertions across 6 test suites**

Run all tests:
```bash
for f in tests/*.test.js; do node "$f"; done
```

---

## Documentation

| Document | Description |
|:---------|:------------|
| [Product Requirements](docs/product-requirements.md) | Full PRD with user stories |
| [Technical Architecture](docs/technical-architecture.md) | Deep-dive into the codebase architecture |
| [Data Model](docs/data-model.md) | Data structures and storage schema |
| [Mock Data Design](docs/mock-data-design.md) | Mock service layer specification |
| [Feature Map](docs/feature-map.md) | Visual feature module overview |
| [Test Checklist](docs/manual-test-checklist.md) | 210 manual test cases |
| [Roadmap](docs/next-steps.md) | Future development plans |

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For bug reports, please use the [Bug Report template](https://github.com/WuSuBuDuoMing/ai-life-manager/issues/new?template=bug_report.md).
For feature requests, please use the [Feature Request template](https://github.com/WuSuBuDuoMing/ai-life-manager/issues/new?template=feature_request.md).

---

## Security

For security vulnerabilities, please see [SECURITY.md](SECURITY.md). **Do not** open public issues for security vulnerabilities.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Copyright (c) 2024-2026 WuSuBuDuoMing

---

<div align="center">

**Built with care for a more organized life**

[Back to top](#ai-life-manager)

</div>
