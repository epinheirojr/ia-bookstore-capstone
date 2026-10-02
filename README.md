# PageTurner Bookstore

PageTurner is a responsive eCommerce bookstore developed as part of the Applied AI Specialist Capstone project.

The application demonstrates an end-to-end online bookstore experience built with React and developed through an AI-assisted workflow using IBM Bob as the Agentic IDE.

## Features

- Responsive Home / Landing page
- Featured and personalized book recommendations
- Browse books by category
- Search and category filtering
- Book detail pages
- Ratings and tentative delivery information
- Related books
- Shopping cart
- Quantity management and item removal
- Free-shipping calculation
- Gift points redemption
- Delivery address form and validation
- Payment method selection
- Simulated payment flow
- Purchase confirmation
- Order history
- Buy Again functionality
- Recommendations based on purchase history
- Persistent cart and orders using localStorage
- Responsive desktop, tablet, and mobile layouts
- Accessible navigation and form interactions
- Custom 404 page

## Technology Stack

- React
- Vite
- Tailwind CSS
- React Router
- React Context
- useReducer
- localStorage
- JavaScript / JSX
- Git and GitHub

The current capstone implementation uses local mock book data and simulated payment processing. It does not connect to a real payment provider or production backend.

## Application Flow

The main customer journey is:

Home → Catalogue → Book Details → Cart → Checkout → Payment → Confirmation → Order History

Users can also return to previous orders and use Buy Again to add purchased books back to the cart.

## Project Structure

```text
src/
├── components/
│   ├── book/
│   ├── cart/
│   ├── checkout/
│   ├── layout/
│   └── ui/
├── context/
├── data/
├── hooks/
├── pages/
└── utils/
```

## Running Locally

**Prerequisites**

- Node.js (v18 or later recommended)
- npm

**Commands**

```bash
git clone https://github.com/epinheirojr/ia-bookstore-capstone.git
cd ia-bookstore-capstone
npm install
npm run dev
```

Vite will display the local development URL (typically `http://localhost:5173`) in the terminal output after startup.

## Production Build

```bash
npm run build
```

Output is written to the `dist/` directory. The final capstone validation completed with zero build errors and zero build warnings.

## AI-Assisted Development with IBM Bob

IBM Bob was used as the Agentic IDE throughout the development of this project. The workflow proceeded as follows:

1. **Requirement review and frontend architecture proposal** — Bob analysed the customer journeys and proposed the application architecture, folder structure, pages, components, routing, state management, and mock data design before any code was written.
2. **React/Vite application and routing scaffold** — project initialisation, Tailwind configuration, routing skeleton, Layout, Header, and Footer.
3. **Component generation** — reusable catalogue, book, cart, checkout, payment, and order components generated iteratively.
4. **Human review of generated code** — each phase was reviewed before proceeding to the next.
5. **Refactoring shared components and utilities** — duplicated logic (shipping calculation, payment labels) was consolidated into shared utilities to reduce duplication.
6. **Human review identified and corrected issues** — including the missing separate Payment step in the checkout flow and an incorrect gift-points cart total calculation.
7. **Accessibility, responsive design, routing, state, and persistence review** — skip-to-main-content, keyboard navigation, localStorage persistence, and URL-based category deep-linking were verified and completed.
8. **Final code-quality review and cleanup** — unused imports, dead files, nested interactive elements, and duplicated constants were removed.
9. **Production build validation** — `npm run build` confirmed 0 errors and 0 warnings.
10. **Git/GitHub workflow** — Git and GitHub were used for source control, repository publishing, branch-based documentation updates, and pull request workflow.

AI-generated suggestions were reviewed, tested, and refined at each stage rather than accepted without validation.

## Persistence

Cart contents and completed orders are persisted to browser `localStorage` for the capstone demonstration. Each context reads from storage on mount and writes back on every state change. Invalid or missing stored data safely falls back to empty state, so the application initialises correctly on first load or after storage is cleared.

## Accessibility

The application is built with accessibility in mind:

- Semantic HTML elements (`<main>`, `<nav>`, `<article>`, `<aside>`, `<header>`, `<footer>`)
- Keyboard-accessible controls — all interactive elements are reachable and activatable without a mouse
- Visible focus states throughout
- Descriptive `aria-label` and `aria-expanded` attributes on interactive controls
- Accessible expand/collapse controls on order history cards
- Skip-to-main-content navigation link visible on keyboard focus
- Meaningful empty and error states with clear user guidance

## Capstone

This repository contains the responsive frontend implementation for the Applied AI Specialist Capstone project. It demonstrates AI-assisted development using an Agentic IDE together with iterative human review, testing, refinement, and Git-based source control.
