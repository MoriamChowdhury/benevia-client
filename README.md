# Benevia

**Live Site:** https://benevia-client.vercel.app

Benevia is a community-driven platform where people create, join and track social service events in their local area, such as winter clothes distribution, tree plantation drives and cleanups.

## Key Features

- Email/password and Google authentication with BetterAuth, including password validation (uppercase, lowercase and at least 6 characters)
- Create events with form validation, and past dates are not allowed
- Browse upcoming events only, with title search and event type filter
- Event details page with a Join Event button for logged-in users, plus a live participants count
- Leave an event you joined, and see your joined events sorted by event date
- Manage Events page to update and delete only the events you created
- JWT protected API routes with owner-only update and delete
- Dark and light theme toggle that applies to the whole site
- Loading skeletons and a profile page to update your name and photo
- Fully responsive layout for mobile, tablet and desktop

## Tech Stack

- Next.js (App Router) with TypeScript
- Tailwind CSS and DaisyUI
- BetterAuth with MongoDB adapter and JWT
- Express.js and MongoDB (separate server repository)

## Run Locally

1. Clone the repository and run `npm install`
2. Create a `.env.local` file with these variables:

```env
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

3. Start the development server with `npm run dev`
4. Run the Benevia server as well so events can load

## Repositories

- Client: https://github.com/MoriamChowdhury/benevia-client
- Server: https://github.com/MoriamChowdhury/benevia-server