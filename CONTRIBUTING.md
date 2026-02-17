# Contributing to MyShop

First off, thank you for considering contributing to MyShop! 🎉

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Documentation](#documentation)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0
- Git
- Code editor (VS Code recommended)

### Setup Development Environment
```bash
# Fork and clone the repository
git clone https://github.com/your-username/myshop.git
cd myshop

# Create a new branch
git checkout -b feature/your-feature-name

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start development servers
npm run dev  # In both backend and frontend directories
```

## 🔄 Development Process

### 1. Choose an Issue

- Check [existing issues](https://github.com/yourusername/myshop/issues)
- Comment on the issue to let others know you're working on it
- If no issue exists, create one to discuss the change

### 2. Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

Examples:
- `feature/add-wishlist`
- `fix/cart-calculation-bug`
- `docs/update-api-documentation`

### 3. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed
- Add tests for new features

## 💻 Coding Standards

### JavaScript/React
```javascript
// Use ES6+ features
const handleClick = () => {
  // Arrow functions for consistency
}

// Destructuring
const { name, email } = user

// Template literals
const greeting = `Hello, ${name}!`

// Async/await over promises
const fetchData = async () => {
  try {
    const data = await API.get('/endpoint')
    return data
  } catch (error) {
    console.error(error)
  }
}
```

### Component Structure (React)
```javascript
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// 1. Imports
// 2. Component definition
// 3. PropTypes
// 4. Default export

function MyComponent({ prop1, prop2 }) {
  // 1. State declarations
  const [state, setState] = useState(null)
  
  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, [])
  
  // 3. Event handlers
  const handleClick = () => {
    // Handler logic
  }
  
  // 4. Render
  return (
    
      {/* JSX */}
    
  )
}

MyComponent.propTypes = {
  prop1: PropTypes.string.required,
  prop2: PropTypes.number
}

export default MyComponent
```

### Backend Structure
```javascript
// Controller example
exports.getResource = async (req, res, next) => {
  try {
    // Business logic
    const data = await Service.getData()
    
    res.status(200).json({
      success: true,
      data
    })
  } catch (error) {
    next(error)
  }
}
```

### CSS/Tailwind

- Use Tailwind utility classes
- Keep classes organized (layout → spacing → colors → effects)
- Use dark mode classes: `dark:bg-dark-bg`
- Extract repeated patterns to components

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

### Examples
```bash
feat(auth): add password reset functionality

- Add forgot password endpoint
- Implement email sending
- Add reset token validation

Closes #123
```
```bash
fix(cart): correct total calculation

Fixed an issue where discount was not being applied correctly
to the cart total.

Fixes #456
```

## 🔀 Pull Request Process

### Before Submitting

1. Update documentation
2. Add/update tests
3. Run linter: `npm run lint`
4. Run tests: `npm test`
5. Build successfully: `npm run build`
6. Update CHANGELOG.md

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] All tests pass
- [ ] Updated CHANGELOG.md
```

### Review Process

1. At least one maintainer approval required
2. All CI checks must pass
3. No merge conflicts
4. Documentation updated
5. Tests added/updated

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Writing Tests
```javascript
// Backend test example
describe('Auth Controller', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
      
    expect(res.statusCode).toBe(201)
    expect(res.body.success).toBe(true)
  })
})
```

## 📖 Documentation

### Code Comments
```javascript
/**
 * Calculate the total price including tax
 * @param {number} subtotal - The subtotal amount
 * @param {number} taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @returns {number} Total price with tax
 */
const calculateTotal = (subtotal, taxRate) => {
  return subtotal * (1 + taxRate)
}
```

### API Documentation

- Update `docs/API.md` for new endpoints
- Include request/response examples
- Document error cases
- Add authentication requirements

## 🎯 Feature Requests

1. Check existing issues first
2. Create a new issue with:
   - Clear description
   - Use case
   - Expected behavior
   - Additional context
3. Wait for discussion before implementing

## 🐛 Bug Reports

Include:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, Node version)
- Error messages/logs

## 💬 Questions?

- Create a [Discussion](https://github.com/yourusername/myshop/discussions)
- Join our [Discord](https://discord.gg/myshop)
- Email: dev@myshop.com

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🙏
