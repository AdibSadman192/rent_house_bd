# Rent House BD Frontend

A modern Next.js application for property rental management.

## Directory Structure

```
frontend/
├── components/          # React components
│   └── [See components/README.md]
├── config/             # Configuration files
│   ├── roles.js       # Role and permission definitions
│   └── constants.js   # Global constants
├── contexts/          # React contexts
│   ├── AuthContext.js
│   └── ThemeContext.js
├── hooks/             # Custom React hooks
│   ├── useSession.js
│   └── useSocket.js
├── lib/              # Library configurations
│   ├── axios.js
│   └── socket.js
├── pages/            # Next.js pages
│   ├── _app.js
│   ├── index.js
│   └── [feature]/
├── public/           # Static files
│   ├── images/
│   └── icons/
├── services/         # API services
│   ├── auth.js
│   └── property.js
├── styles/          # Global styles
│   ├── globals.css
│   └── theme.js
└── utils/           # Utility functions
    ├── authMiddleware.js
    └── helpers.js
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

## Code Guidelines

1. File Organization:
   - Use appropriate directory for each file type
   - Keep related files together
   - Use index.js for cleaner imports

2. Naming Conventions:
   - Components: PascalCase
   - Files: camelCase
   - Constants: UPPER_CASE
   - CSS Modules: kebab-case

3. Code Style:
   - Use ESLint and Prettier
   - Follow Next.js best practices
   - Write meaningful comments
   - Keep files under 250 lines

4. State Management:
   - Use React Context for global state
   - Use hooks for component state
   - Keep state close to where it's used

5. Performance:
   - Use Next.js Image component
   - Implement code splitting
   - Optimize bundle size
   - Use proper caching strategies

## Development Tools

1. **Code Quality**:
   - ESLint with React plugins
   - Prettier for code formatting
   - Husky for git hooks
   - lint-staged for pre-commit checks

2. **Testing**:
   - Jest for unit testing
   - React Testing Library for component testing
   - Coverage reporting
   - Mocked router and authentication

3. **Path Aliases**:
   All imports use `@/` prefix for better organization:
   - `@/components/*` → `components/*`
   - `@/contexts/*` → `contexts/*`
   - `@/hooks/*` → `hooks/*`
   - `@/utils/*` → `utils/*`
   - `@/config/*` → `config/*`
   - `@/styles/*` → `styles/*`

## Testing

1. **Unit Tests**:
   ```bash
   # Run all tests
   npm run test

   # Run tests in watch mode
   npm run test:watch

   # Generate coverage report
   npm run test -- --coverage
   ```

2. **Test Files Location**:
   - Component tests: `components/__tests__/`
   - Hook tests: `hooks/__tests__/`
   - Utility tests: `utils/__tests__/`

3. **Testing Guidelines**:
   - Write tests for all new components
   - Mock external dependencies
   - Test edge cases
   - Keep tests focused and isolated

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production bundle
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run test`: Run tests
- `npm run format`: Format code with Prettier

## Contributing

1. **Before Committing**:
   - Code is automatically formatted on commit
   - ESLint checks are run
   - Tests must pass
   - Follow the code style guide

2. **Development Workflow**:
   - Create feature branch
   - Write tests for new features
   - Ensure all tests pass
   - Submit pull request

3. **Code Review Process**:
   - Code must be reviewed
   - All checks must pass
   - Follow pull request template
   - Address review comments

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
