# Chit Fund Admin Portal

A modern frontend application for managing Chit Fund operations with mock data.

## Features

- **Authentication**: Login and Register functionality
- **Customer Management**: Add and view customers
- **Chit Scheme Management**: Create and manage chit schemes
- **Payment Tracking**: View payment history and status
- **Auction Management**: Track auctions and bidding

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router DOM

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Demo Credentials

- **Username**: `admin`
- **Password**: `password`

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── services/       # Mock API service
├── types/          # TypeScript type definitions
├── App.tsx         # Main app component
├── main.tsx        # Entry point
└── index.css      # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Mock Data

All data is currently mocked and stored in memory. The mock API service (`src/services/mockApi.ts`) simulates API calls with delays.

## Notes

- This is a frontend-only application with mock data
- No backend is required to run this application
- All data is stored in memory and will reset on page refresh

