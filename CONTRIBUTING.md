# Contributing to @osmium/iterate

Thank you for your interest in contributing to `@osmium/iterate`! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 14.0.0 or higher
- npm, yarn, or pnpm
- Git

### Setup Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/iterate.git
   cd iterate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests to ensure everything works**
   ```bash
   npm test
   ```

4. **Run tests with coverage**
   ```bash
   npm run test:coverage
   ```

## 📝 Development Workflow

### Branch Naming
- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation updates
- `test/description` - for test improvements

### Commit Messages
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat: add parallel processing with custom limits`
- `fix: resolve TypeScript type inference issue`
- `docs: update README with new examples`
- `test: add edge case tests for boolean mapping`

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- Place tests in the `tests/` directory
- Use descriptive test names
- Follow the existing test patterns
- Aim for high test coverage (current: 99.24%)
- Test both sync and async variants
- Include edge cases and error scenarios

Example test structure:
```typescript
import { iterateSync } from '../src';
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
    it('should handle basic case', () => {
        const result = iterateSync([1, 2, 3], (x) => x * 2, []);
        expect(result).toEqual([2, 4, 6]);
    });

    it('should handle edge case', () => {
        const result = iterateSync([], (x) => x, []);
        expect(result).toEqual([]);
    });
});
```

## 📚 Documentation

### Code Documentation
- Use JSDoc comments for public APIs
- Include examples in documentation
- Document complex algorithms and edge cases
- Keep comments up-to-date with code changes

### README and Examples
- Update README.md for new features
- Add examples to EXAMPLES.md
- Update type definitions if needed
- Include performance considerations

## 🔧 Code Style

### TypeScript Guidelines
- Use strict TypeScript configuration
- Prefer explicit types over `any`
- Use proper generic constraints
- Follow existing naming conventions

### Formatting
- Use tabs for indentation
- Follow existing code style
- Run linter before committing
- Use meaningful variable names

### Performance Considerations
- Optimize for common use cases
- Avoid unnecessary allocations
- Consider memory usage for large datasets
- Profile performance-critical paths

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Environment details** (Node.js version, OS, etc.)
5. **Minimal code example** that demonstrates the issue

Use this template:
```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Node.js version: 
- @osmium/iterate version: 
- Operating System: 

## Code Example
```typescript
// Minimal example that reproduces the issue
```

## 💡 Feature Requests

For feature requests, please include:

1. **Use case description** - why is this needed?
2. **Proposed API** - how should it work?
3. **Examples** - show usage examples
4. **Alternatives considered** - other approaches you've thought of

## 🔄 Pull Request Process

### Before Submitting
1. **Run tests** and ensure they pass
2. **Add tests** for new functionality
3. **Update documentation** if needed
4. **Check TypeScript** compilation
5. **Verify coverage** hasn't decreased significantly

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Coverage maintained or improved

## Documentation
- [ ] README updated if needed
- [ ] Examples added if applicable
- [ ] Type definitions updated

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] No breaking changes (or clearly documented)
```

### Review Process
1. **Automated checks** must pass (tests, linting, etc.)
2. **Code review** by maintainers
3. **Discussion** and feedback incorporation
4. **Final approval** and merge

## 📋 Development Scripts

```bash
# Development
npm run test          # Run tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage

# Building
npm run compile       # Compile TypeScript
npm run build         # Full build process
npm run clean         # Clean build artifacts

# Linting
npm run lint          # Run ESLint
npm run lint:fix      # Fix linting issues
```

## 🏗️ Architecture

### Project Structure
```
├── src/              # Source code
│   └── index.ts      # Main entry point
├── tests/            # Test files
├── defs/             # TypeScript definitions
├── dist/             # Built files
├── docs/             # Documentation
└── examples/         # Usage examples
```

### Core Concepts
- **Universal iteration** - single API for all data types
- **Type safety** - full TypeScript support
- **Performance** - optimized for common use cases
- **Flexibility** - extensible and configurable

## 🤝 Community

### Getting Help
- 📖 Check the [documentation](README.md)
- 💬 Start a [discussion](https://github.com/osmium-org/iterate/discussions)
- 🐛 Report [issues](https://github.com/osmium-org/iterate/issues)

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow GitHub's community guidelines

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to `@osmium/iterate`! Your help makes this project better for everyone. 🎉