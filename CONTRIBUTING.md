# Contributing to LeHalo

Thank you for your interest in contributing to LeHalo! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/lehalo/issues)
2. If not, create a new issue using the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
3. Provide as much detail as possible:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node.js version, browser)
   - Screenshots if applicable

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue using the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
3. Clearly describe the feature and its use case

### Submitting Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/lehalo.git
   cd lehalo
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm start
   # Test thoroughly in the browser
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```
   - Use clear, descriptive commit messages
   - Reference issue numbers if applicable

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Use the PR template
   - Describe your changes clearly
   - Link to related issues

## Development Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/yourusername/lehalo.git
   cd lehalo
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Make changes and test**
   - The server will auto-reload on file changes
   - Test in multiple browsers
   - Check for console errors

## Code Style Guidelines

### JavaScript
- Use ES6+ features
- Use `const` and `let` (avoid `var`)
- Use arrow functions where appropriate
- Use template literals for strings
- Add JSDoc comments for functions

### CSS
- Use CSS variables for theming
- Follow BEM naming convention where applicable
- Keep styles organized and commented
- Use meaningful class names

### HTML
- Use semantic HTML5 elements
- Include proper accessibility attributes
- Keep markup clean and readable

## Project Structure

- `server.js` - Main server entry point
- `routes/` - Route handlers
- `services/` - Proxy service modules
- `ui/` - Frontend files (HTML, CSS, JS)
- `assets/` - Static assets (images, icons)

## Testing

Before submitting a PR:
- [ ] Test all new features
- [ ] Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices if applicable
- [ ] Check for console errors
- [ ] Verify no breaking changes

## Documentation

- Update README.md if adding new features
- Add JSDoc comments for new functions
- Update inline comments for complex logic
- Update deployment docs if needed

## Questions?

- Open an issue for questions
- Join our Discord: [https://discord.gg/DgSHpwyf](https://discord.gg/DgSHpwyf)

## License

By contributing, you agree that your contributions will be licensed under the AGPL-3.0 license.

---

Thank you for contributing to LeHalo! 🎉

