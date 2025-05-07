# Games Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It serves as the frontend for a games-related application.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Scripts](#scripts)
- [Folder Structure](#folder-structure)
- [Learn More](#learn-more)
- [Deployment](#deployment)
- [License](#license)

## Getting Started

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

You can start editing the app by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Prerequisites

Ensure you have the following installed:

- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun (choose one package manager)

### Installation

Clone the repository and install dependencies:

```bash
git clone git@github.com:jquirosz/games_frontend.git
cd games_frontend
npm install
```

## Features

- Built with [Next.js](https://nextjs.org) for server-side rendering and static site generation.
- Uses [React](https://reactjs.org) for building user interfaces.
- Authentication with [oidc-client-ts](https://github.com/authts/oidc-client-ts).
- Tailwind CSS for styling.
- TypeScript for type safety.
- XML parsing with `xml2json`.

## Technologies Used

- **Framework**: Next.js
- **Language**: TypeScript, JavaScript
- **Styling**: Tailwind CSS
- **Authentication**: OIDC
- **Utilities**: XML to JSON conversion

## Scripts

Here are the available npm scripts:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality issues.

## Folder Structure

```
games_frontend/
├── app/                # Application pages and components
├── public/             # Static assets
├── styles/             # Global styles
├── node_modules/       # Dependencies
├── package.json        # Project configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Learn More

To learn more about the tools and frameworks used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Deployment

The easiest way to deploy this application is via [Vercel](https://vercel.com). Follow the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
