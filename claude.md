# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based AI Training Course Constructor - an interactive platform that allows users to create personalized AI tool training programs. The system uses a modular approach where training content is organized into hourly "building blocks" that can be combined to create custom learning paths.

## Tech Stack & Architecture

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Data Storage**: JSON files for course structure and content
- **Architecture**: Static web application with modular component structure

Expected project structure:
```
project/
├── index.html              # Main page
├── css/
│   ├── styles.css          # Core styles
│   └── responsive.css      # Media queries
├── js/
│   ├── app.js             # Main application logic
│   ├── constructor.js      # Course builder logic
│   └── utils.js           # Helper functions
├── data/
│   └── courses.json       # Course database
└── assets/
    └── images/            # Icons and images
```

## Key Features & Components

### Core Functionality
1. **Course Catalog**: Filterable catalog of training modules by difficulty, tools, duration, category
2. **Course Constructor**: Drag & drop interface for building custom programs with prerequisite validation
3. **Interactive Elements**: Training artifacts, practice exercises, and assessment tools
4. **Responsive Design**: Desktop, tablet, and mobile optimizations

### Data Structure
Courses are structured with the following key properties:
- `id`, `title`, `duration` (in minutes)
- `category` (basic|intermediate|advanced)
- `tools` (ChatGPT, Claude, Perplexity, etc.)
- `topics`, `practicalTasks`, `prerequisites`
- `difficulty` and `price`

## Development Guidelines

### Code Style
- Use semantic HTML5 markup with proper ARIA attributes
- Follow modern CSS practices (flexbox/grid, CSS variables)
- Write clean, modular JavaScript ES6+
- Maintain consistent indentation and naming conventions

### Color Scheme
Based on ai-lab.company styling:
- Primary: Dark blue (#1a202c) or dark gray (#2d3748)
- Accent: Blue (#667eea) or purple (#764ba2)
- Background: Light gray (#f7fafc) or white (#ffffff)
- Text: Dark gray (#2d3748) and medium gray (#4a5568)

## Important Context

The project is based on a detailed requirements document (`claude.md` in Russian) that outlines:
- Modular hour-based lesson system ("ящички")
- Integration with various AI tools (ChatGPT, Claude, Perplexity, Copilot)
- Interactive training components and practical exercises
- Course personalization for different client needs

When working on this project, refer to the existing `claude.md` file for detailed feature requirements and the `meeteng_text.MD` file for additional context from stakeholder discussions about course content and structure.