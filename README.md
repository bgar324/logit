# Workout Tracker and Analyzer

A modern web application for tracking and analyzing your workouts, featuring a clean UI, calendar-based logging, and comprehensive analytics.

## Features

- 📅 Calendar-based workout logging
- 📊 Workout analysis and progress tracking
- 💪 Exercise PR (Personal Record) tracking
- 🏷️ Customizable workout tags
- 📝 Detailed movement and set tracking
- 📱 Responsive design

## Tech Stack

### Frontend
- Next.js 15.1.5
- React 19
- TypeScript
- Tailwind CSS
- React Calendar
- Recharts (for analytics)

### Backend
- PostgreSQL
- Prisma ORM
- Supabase

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd workout2
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with:
```env
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]"
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Database Schema

The application uses the following main models:
- `WorkoutLog`: Stores workout sessions with notes and tags
- `Movement`: Tracks exercises within a workout
- `Set`: Records individual sets with weight and reps
- `Dropset`: Tracks drop sets for movements
- `ExercisePR`: Keeps track of personal records
- `Exercise`: Maintains a list of exercises
- `Tag`: Manages workout tags

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run linting

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)