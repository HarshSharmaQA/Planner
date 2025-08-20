# Task Management Application

A comprehensive task management application built with React, TypeScript, and TailwindCSS, featuring team collaboration capabilities.

## Features

- ✅ **Task Management**: Create, edit, delete, and organize tasks
- ✅ **Team Collaboration**: Add team members and assign tasks
- ✅ **Data Export**: Export tasks and team data to CSV/JSON
- ✅ **Advanced Filtering**: Filter tasks by status, priority, assignee, and more
- ✅ **Analytics Dashboard**: Track task completion and team performance
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Modern UI**: Clean, intuitive interface with dark mode support

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/project-bolt-sb1-av7rqdkx.git
cd project-bolt-sb1-av7rqdkx
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Deployment to GitHub Pages

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `project-bolt-sb1-av7rqdkx`
3. Don't initialize with README (we already have one)

### 2. Update Repository Settings

1. **Update vite.config.ts**: Change the base URL to match your repository name
```typescript
// vite.config.ts
base: '/YOUR_REPOSITORY_NAME/', // Replace with your actual repo name
```

### 3. Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Task management application"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# Push to main branch
git push -u origin main
```

### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Build and deployment**, select **GitHub Actions**
4. The workflow will automatically trigger and deploy your site

### 5. Access Your Deployed Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/       # React components
├── store/           # Zustand state management
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## Features Overview

### Team Management
- Add/edit/delete team members
- Assign tasks to team members
- Track team member performance

### Data Export
- Export tasks to CSV format
- Export tasks to JSON format
- Includes team member assignments

### Task Organization
- Categories, priorities, and statuses
- Tags for additional organization
- Due dates and time tracking
- Progress tracking

### Analytics
- Task completion statistics
- Team performance metrics
- Priority distribution
- Category breakdowns

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).