# Contributing to AI Life Manager

感谢你对 AI 生活管家的兴趣！欢迎贡献代码。

Thank you for your interest in AI Life Manager! Contributions are welcome.

---

## 🚀 Getting Started

### 开发环境 / Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/WuSuBuDuoMing/ai-life-manager.git
   cd ai-life-manager
   ```

2. **Install WeChat DevTools**
   - Download from [developers.weixin.qq.com](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

3. **Import the project**
   - Open WeChat DevTools → Import Project → Select the cloned folder

4. **Start coding!** No build step, no npm install needed.

---

## 📋 How to Contribute

### Reporting Bugs / 提交 Bug

- Use [GitHub Issues](https://github.com/WuSuBuDuoMing/ai-life-manager/issues)
- Include: device model, WeChat version, steps to reproduce, expected vs actual behavior
- Screenshots or screen recordings are highly appreciated

### Suggesting Features / 建议新功能

- Open a GitHub Issue with the `feature-request` label
- Describe the use case and why it would benefit users
- If possible, include mockups or wireframes

### Submitting Code / 提交代码

1. **Fork** the repository
2. **Create a branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following the coding conventions below
4. **Test thoroughly** in WeChat DevTools simulator
5. **Commit** with a clear message (see commit convention below)
6. **Push** and open a **Pull Request**

---

## 🎨 Coding Conventions

### File Naming

- Pages: `pages/module-name/` (kebab-case)
- Components: `components/component-name/` (kebab-case)
- Services: `services/module-service.js` (kebab-case with `-service` suffix)
- Utils: `utils/name-utils.js` (kebab-case with `-utils` suffix)

### Code Style

- **Indentation**: 2 spaces (configured in `project.config.json`)
- **Semicolons**: Required
- **Quotes**: Single quotes for strings
- **ES6**: Use arrow functions, template literals, destructuring where appropriate
- **Comments**: Add JSDoc comments for service functions

### Component Pattern

Every custom component should follow this structure:
```
components/my-component/
├── index.js          # Component logic
├── index.json        # Component config with "component": true
├── index.wxml        # Template
└── index.wxss        # Styles
```

### Service Pattern

Every service module should follow this pattern:
```javascript
const mockUtils = require('../../utils/mock-utils')
const storageUtils = require('../../utils/storage-utils')
const constants = require('../../utils/constants')

const STORAGE_KEY = constants.STORAGE_KEYS.YOUR_KEY

module.exports = {
  async getAll() { /* ... */ },
  async getById(id) { /* ... */ },
  async create(item) { /* ... */ },
  async update(id, data) { /* ... */ },
  async delete(id) { /* ... */ }
}
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Usage |
|--------|-------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Code style (formatting, no logic change) |
| `refactor:` | Code refactoring |
| `perf:` | Performance improvement |
| `test:` | Adding or updating tests |
| `chore:` | Build process or tooling changes |

Examples:
```
feat: add pet weight chart visualization
fix: resolve fridge expiry alert showing wrong date
docs: update README with new module descriptions
```

---

## 🧪 Testing

Before submitting a PR:

1. **Manual testing** in WeChat DevTools simulator
2. **Dark mode**: Toggle dark mode and verify all pages look correct
3. **Empty states**: Test with no data (fresh install simulation)
4. **Edge cases**: Long text, many items, special characters
5. **Cross-module**: Verify data flows between related modules

See [docs/manual-test-checklist.md](docs/manual-test-checklist.md) for the full 210-point test checklist.

---

## 📂 Adding a New Module

To add a new feature module:

1. **Create the page**: `pages/your-module/` (4 files: `.js`, `.json`, `.wxml`, `.wxss`)
2. **Create the service**: `services/your-module-service.js`
3. **Create components** (if needed): `components/your-component/`
4. **Register the page** in `app.json` under `"pages"`
5. **Add storage key** in `utils/constants.js` under `STORAGE_KEYS`
6. **Add categories** (if needed) in `utils/constants.js`
7. **Integrate with dashboard** in `services/dashboard-service.js`
8. **Integrate with notifications** in `services/notification-service.js` (if applicable)
9. **Add to global search** in `pages/search/`
10. **Update README** with the new module description

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

<div align="center">

**谢谢你的贡献！ / Thank you for contributing! 🎉**

</div>
