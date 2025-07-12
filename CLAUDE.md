# Cryptic Elixir - Astro Template

## Project Overview
An Astro-based web application template with interactive elements and modern web technologies.

## Tech Stack
- **Framework:** Astro 5.11.0
- **Styling:** Tailwind CSS 3.4.4
- **3D Graphics:** Three.js 0.178.0
- **Language:** TypeScript (strict mode)

## Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture
- **Layouts:** BaseLayout.astro provides consistent HTML structure
- **Components:** 
  - Common: Header, Footer, Button
  - Interactive: AnimatedHero, VideoPlayer
- **Scripts:** Separate JS modules for animations and WebGL
- **Styling:** Tailwind CSS with custom styles support

## Key Files
- `src/layouts/BaseLayout.astro` - Main layout component
- `src/pages/index.astro` - Homepage
- `src/scripts/webgl-scene.js` - Three.js WebGL setup
- `astro.config.mjs` - Astro configuration
- `tailwind.config.cjs` - Tailwind CSS configuration

## Project Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   └── interactive/     # Interactive/animated components
├── layouts/             # Page layouts
├── pages/              # Route pages
├── scripts/            # JavaScript modules
└── styles/             # CSS files
```

## Features
- Responsive design with Tailwind CSS
- WebGL/Three.js integration for 3D graphics
- SEO-optimized with proper meta tags
- TypeScript support with strict configuration
- Component-based architecture
- Interactive animations and effects

## Notes
- The project is themed around "Cryptic Elixir" - occult literature and rare books
- Includes placeholder content for interactive elements
- Ready for expansion with additional animations and effects