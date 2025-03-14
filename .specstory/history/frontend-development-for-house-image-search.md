## SpecStory

## Frontend Development for House Image Search (3/13/2025, 11:10:00 PM)

_**User**_

i want to make this the frontend for a house image multimodal search. I have a qdrant collection that contains embeddings of house images. I want my user to be able to type in a query like "victorian windows" and then we show them the most similar results. qdrant should return a file name, and we can match that to images in the public/images folder

---

_**Assistant**_

I'll help you create a multimodal search interface for house images. First, let's check if we have the necessary dependencies and then modify the page to create a search interface.

Let me first check the package.json to see what dependencies we have:


---

_****_

Read file: package.json

---

_****_

Let me check if we have a public/images directory:


---

_****_

<details>
            <summary>Listed directory public • **5** results</summary>
        
| Name |
|-------|
| 📄 `file.svg` |
| 📄 `next.svg` |
| 📄 `vercel.svg` |
| 📄 `window.svg` |
| 📄 `globe.svg` |

</details>

---

_****_

I'll help you create a multimodal search interface. We'll need to:
1. Create an API route to handle Qdrant queries
2. Create a search interface with a text input
3. Display the results in a grid layout
4. Add loading states and error handling

First, let's create the API route for Qdrant:


---

_****_

```diff
- 
+ import { NextResponse } from 'next/server';
+ 
+ export async function POST(request: Request) {
+   try {
+     const { query } = await request.json();
+     
+     // TODO: Replace with your Qdrant API endpoint and collection name
+     const response = await fetch('http://localhost:6333/collections/houses/points/search', {
+       method: 'POST',
+       headers: {
+         'Content-Type': 'application/json',
+       },
+       body: JSON.stringify({
+         vector: query, // This should be the embedding of the text query
+         limit: 12,
+         with_payload: ['filename'], // Assuming filename is stored in the payload
+       }),
+     });
+ 
+     if (!response.ok) {
+       throw new Error('Failed to fetch from Qdrant');
+     }
+ 
+     const data = await response.json();
+     return NextResponse.json(data);
+   } catch (error) {
+     console.error('Search error:', error);
+     return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
+   }
+ } 
```

---

_****_

Now, let's modify the main page to create a search interface:


---

_****_

```diff
- import Image from "next/image";
+ 'use client';
+ 
+ import { useState } from 'react';
+ import Image from 'next/image';
  
  export default function Home() {
+   const [query, setQuery] = useState('');
+   const [results, setResults] = useState<any[]>([]);
+   const [loading, setLoading] = useState(false);
+   const [error, setError] = useState('');
+ 
+   const handleSearch = async (e: React.FormEvent) => {
+     e.preventDefault();
+     setLoading(true);
+     setError('');
+     
+     try {
+       const response = await fetch('/api/search', {
+         method: 'POST',
+         headers: {
+           'Content-Type': 'application/json',
+         },
+         body: JSON.stringify({ query }),
+       });
+ 
+       if (!response.ok) {
+         throw new Error('Search failed');
+       }
+ 
+       const data = await response.json();
+       setResults(data.result || []);
+     } catch (err) {
+       setError('Failed to perform search. Please try again.');
+     } finally {
+       setLoading(false);
+     }
+   };
+ 
    return (
-     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
-       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
-         <Image
-           className="dark:invert"
-           src="/next.svg"
-           alt="Next.js logo"
-           width={180}
-           height={38}
-           priority
-         />
-         <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
-           <li className="mb-2 tracking-[-.01em]">
-             Get started by editing{" "}
-             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
-               app/page.tsx
-             </code>
-             .
-           </li>
-           <li className="tracking-[-.01em]">
-             Save and see your changes instantly.
-           </li>
-         </ol>
- 
-         <div className="flex gap-4 items-center flex-col sm:flex-row">
-           <a
-             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
-             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
-             target="_blank"
-             rel="noopener noreferrer"
-           >
-             <Image
-               className="dark:invert"
-               src="/vercel.svg"
-               alt="Vercel logomark"
-               width={20}
-               height={20}
-             />
-             Deploy now
-           </a>
-           <a
-             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
-             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
-             target="_blank"
-             rel="noopener noreferrer"
-           >
-             Read our docs
-           </a>
+     <div className="min-h-screen p-8">
+       <main className="max-w-7xl mx-auto">
+         <h1 className="text-4xl font-bold mb-8 text-center">House Image Search</h1>
+         
+         <form onSubmit={handleSearch} className="mb-8">
+           <div className="flex gap-4 max-w-2xl mx-auto">
+             <input
+               type="text"
+               value={query}
+               onChange={(e) => setQuery(e.target.value)}
+               placeholder="Describe the house you're looking for..."
+               className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
+             />
+             <button
+               type="submit"
+               disabled={loading}
+               className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
+             >
+               {loading ? 'Searching...' : 'Search'}
+             </button>
+           </div>
+         </form>
+ 
+         {error && (
+           <div className="text-red-500 text-center mb-8">{error}</div>
+         )}
+ 
+         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
+           {results.map((result, index) => (
+             <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
+               <Image
+                 src={`/images/${result.payload.filename}`}
+                 alt={`House ${index + 1}`}
+                 fill
+                 className="object-cover"
+               />
+             </div>
+           ))}
          </div>
        </main>
-       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
-         <a
-           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
-           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
-           target="_blank"
-           rel="noopener noreferrer"
-         >
-           <Image
-             aria-hidden
-             src="/file.svg"
-             alt="File icon"
-             width={16}
-             height={16}
-           />
-           Learn
-         </a>
-         <a
-           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
-           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
-           target="_blank"
-           rel="noopener noreferrer"
-         >
-           <Image
-             aria-hidden
-             src="/window.svg"
-             alt="Window icon"
-             width={16}
-             height={16}
-           />
-           Examples
-         </a>
-         <a
-           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
-           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
-           target="_blank"
-           rel="noopener noreferrer"
-         >
-           <Image
-             aria-hidden
-             src="/globe.svg"
-             alt="Globe icon"
-             width={16}
-             height={16}
-           />
-           Go to nextjs.org →
-         </a>
-       </footer>
      </div>
    );
```

---

_****_

Now we need to create a directory for the house images and add some configuration for Next.js to handle the images properly. Let's create the images directory:



---

_****_



---

_****_



---

_**User**_

i have a python server running at localhost 8000. this server has a /search endpoint that expects a text input and will return image paths

---

_**Assistant**_

I'll modify the API route to use your Python server instead of directly querying Qdrant. Let me update the search route:


---

_****_

```diff
      const { query } = await request.json();
  
-     // TODO: Replace with your Qdrant API endpoint and collection name
-     const response = await fetch(
-       "http://localhost:6333/collections/houses/points/search",
-       {
+     const response = await fetch("http://localhost:8000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
-         body: JSON.stringify({
-           vector: query, // This should be the embedding of the text query
-           limit: 12,
-           with_payload: ["filename"], // Assuming filename is stored in the payload
-         }),
-       }
-     );
+       body: JSON.stringify({ query }),
+     });
  
      if (!response.ok) {
-       throw new Error("Failed to fetch from Qdrant");
+       throw new Error("Failed to fetch from search server");
      }
  
```

---

_****_

Now I'll update the frontend to handle the response format from your Python server. Let me modify the page component:


---

_****_

```diff
  export default function Home() {
    const [query, setQuery] = useState("");
-   const [results, setResults] = useState<any[]>([]);
+   const [results, setResults] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
        const data = await response.json();
-       setResults(data.result || []);
+       setResults(data.image_paths || []);
      } catch (err) {
        setError("Failed to perform search. Please try again.");
  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
-           {results.map((result, index) => (
+           {results.map((imagePath, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden"
              >
                <Image
-                 src={`/images/${result.payload.filename}`}
+                 src={imagePath}
                  alt={`House ${index + 1}`}
                  fill
```

---

_****_

I've made the following changes:

1. Updated the API route to forward requests to your Python server at `http://localhost:8000/search`
2. Modified the frontend to expect an array of image paths in the response (assuming your Python server returns a JSON object with an `image_paths` array)
3. Updated the image display to use the full image paths returned by your server

The interface is now ready to use. When you type a query like "victorian windows" and click search:
1. The query will be sent to your Python server
2. Your server will process the query and return an array of image paths
3. The frontend will display these images in a responsive grid layout

Make sure your Python server:
1. Is running at `http://localhost:8000`
2. Has a `/search` endpoint that accepts POST requests with a JSON body containing a `query` field
3. Returns a JSON response with an `image_paths` array containing the full URLs or paths to the images

Would you like me to make any adjustments to the interface or help you with anything else?

---

_**User**_

server expects this format curl -X POST \
  http://localhost:8000/search \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "your search text here",
    "limit": 5
}'

---

_**Assistant**_

I'll update the API route to include the `limit` parameter in the request:

---

_****_

```diff
          "Content-Type": "application/json",
        },
-       body: JSON.stringify({ query }),
+       body: JSON.stringify({
+         query,
+         limit: 12  // Show up to 12 results in the grid
+       }),
      });
  
```

---

_****_

I've updated the API route to include the `limit` parameter in the request body. I set it to 12 since our grid layout is optimized for displaying multiple images, and this will give us 3 full rows in the 4-column layout on large screens.

The request format now matches exactly what your server expects:
```json
{
    "query": "your search text here",
    "limit": 12
}
```

Everything else in the frontend remains the same since it was already set up to handle the response format. You can now use the search interface and it will properly communicate with your Python server at `localhost:8000`.

Would you like me to make any other adjustments to the interface or the request format?

---

_**User**_

// Response type definition
interface SearchResponse {
  results: Array<{
    filename: string;  // The name of the image file
    score: number;    // Similarity score (between 0 and 1, higher is better)
  }>;
}

---

_**Assistant**_

I'll update both the API route and the frontend to handle this response type correctly:

---

_****_

```diff
  import { NextResponse } from "next/server";
+ 
+ interface SearchResponse {
+   results: Array<{
+     filename: string;  // The name of the image file
+     score: number;    // Similarity score (between 0 and 1, higher is better)
+   }>;
+ }
  
  export async function POST(request: Request) {
      }
  
-     const data = await response.json();
+     const data = await response.json() as SearchResponse;
      return NextResponse.json(data);
    } catch (error) {
```

---

_****_

Now let's update the frontend to handle this response type and display both the images and their similarity scores:

---

_****_

```diff
  import { useState } from "react";
  import Image from "next/image";
+ 
+ interface SearchResult {
+   filename: string;
+   score: number;
+ }
  
  export default function Home() {
    const [query, setQuery] = useState("");
-   const [results, setResults] = useState<string[]>([]);
+   const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
        const data = await response.json();
-       setResults(data.image_paths || []);
+       setResults(data.results || []);
      } catch (err) {
        setError("Failed to perform search. Please try again.");
  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
-           {results.map((imagePath, index) => (
+           {results.map((result, index) => (
              <div
                key={index}
-               className="relative aspect-square rounded-lg overflow-hidden"
+               className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <Image
-                 src={imagePath}
+                 src={`/images/${result.filename}`}
                  alt={`House ${index + 1}`}
                  fill
                  className="object-cover"
                />
+               <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
+                 Similarity: {Math.round(result.score * 100)}%
+               </div>
              </div>
            ))}
```

---

_****_

I've made the following updates:

1. Added type definitions for the search response in both files
2. Updated the frontend to handle the new response format with `filename` and `score`
3. Added a hover overlay that shows the similarity score as a percentage
4. Assumed images are stored in the `/public/images` directory and accessed via `/images/filename`

The interface now:
1. Shows images in a responsive grid
2. Displays similarity scores when hovering over images
3. Rounds the similarity score to a percentage for better readability
4. Has a nice fade-in animation for the score overlay

Make sure your images are placed in the `/public/images` directory of your Next.js project, and the filenames match exactly what's returned by your Python server.

Would you like me to make any adjustments to the styling or functionality?

---

_**User**_

I want to have a separate /search URL for when I deploy my backend to production

---

_**Assistant**_

I'll help you set up environment-based URLs for the backend. We'll use environment variables to switch between development and production URLs.

First, let's create a `.env.local` file for local development:

---

_****_

```diff
- 
+ NEXT_PUBLIC_API_URL=http://localhost:8000 
```

---

_****_

Now let's create a `.env.production` file for production:

---

_****_

```diff
- 
+ NEXT_PUBLIC_API_URL=https://your-production-api.com 
```

---

_****_

Now let's update the API route to use the environment variable:

---

_****_

```diff
    }>;
  }
+ 
+ const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  export async function POST(request: Request) {
    try {
      const { query } = await request.json();
  
-     const response = await fetch("http://localhost:8000/search", {
+     const response = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: {
```

---

_****_

Let's also add a `.gitignore` entry to make sure we don't commit our local environment variables:

---

_****_



---

_****_



---



---

