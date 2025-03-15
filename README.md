# House Image Search Frontend

A Next.js application that provides a semantic search interface for house images. Users can search for houses using natural language descriptions (e.g., "victorian windows", "modern kitchen") and see matching results ranked by similarity.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── search/         # API route that proxies requests to the backend
│   │       └── route.ts
│   ├── page.tsx           # Main search interface
│   └── layout.tsx         # Root layout
├── public/
│   └── images/            # Directory for house images
└── next.config.ts         # Next.js configuration including CORS and image settings
```

## Environment Variables

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000  # Development backend URL
```

For production, set:

```bash
NEXT_PUBLIC_API_URL=https://your-production-backend.com
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Natural language search for house images
- Real-time search results with similarity scores
- Responsive grid layout
- Image optimization with Next.js Image component
- Environment-based API configuration

## Backend Integration

This frontend expects a backend server that:

1. Accepts POST requests to `/search`
2. Expects JSON body with `{ query: string, limit: number }`
3. Returns JSON response with `{ results: Array<{ filename: string, score: number }> }`

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
