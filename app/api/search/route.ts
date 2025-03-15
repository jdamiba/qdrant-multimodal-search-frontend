import { NextResponse } from "next/server";

interface SearchResponse {
  results: Array<{
    filename: string; // The name of the image file
    score: number; // Similarity score (between 0 and 1, higher is better)
  }>;
}

// Remove trailing slash if present
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

console.log("Attempting to connect to:", API_URL);

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    console.log("Search query:", query);

    const response = await fetch(`${API_URL}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        limit: 12, // Show up to 12 results in the grid
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`Server responded with ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as SearchResponse;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      url: `${API_URL}/search`,
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to perform search",
      },
      { status: 500 }
    );
  }
}
