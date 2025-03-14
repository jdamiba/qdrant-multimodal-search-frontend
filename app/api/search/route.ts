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

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

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
      throw new Error("Failed to fetch from search server");
    }

    const data = (await response.json()) as SearchResponse;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
