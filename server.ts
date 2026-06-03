/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Dynamic lookup function to retrieve movie metadata (poster and IMDb rating).
 * It queries OMDb first (using the free testing key 'thewdb') and falls back to
 * Wikipedia page images if the poster isn't found or OMDb fails.
 */
async function fetchMovieMetadata(title: string, year: string): Promise<{ posterUrl: string | null; imdbRating: string | null }> {
  let posterUrl: string | null = null;
  let imdbRating: string | null = null;

  // Try 1: OMDb with public key "thewdb"
  try {
    const omdbUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&y=${year}&apikey=thewdb`;
    const response = await fetch(omdbUrl);
    if (response.ok) {
      const data = await response.json() as any;
      if (data) {
        if (data.Poster && data.Poster !== "N/A" && data.Poster.startsWith("http")) {
          posterUrl = data.Poster;
        }
        if (data.imdbRating && data.imdbRating !== "N/A") {
          imdbRating = data.imdbRating;
        }
      }
    }
  } catch (err) {
    console.warn(`OMDb lookup failed for ${title} (${year}):`, err);
  }

  // Try 2: Wikipedia Page Images API
  if (!posterUrl) {
    // Search standard variations of the title for highest precision match
    const searchTitles = [
      `${title} (${year} film)`,
      `${title} (film)`,
      title
    ];

    for (const qTitle of searchTitles) {
      try {
        const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(qTitle)}&prop=pageimages&format=json&pithumbsize=500&redirects=1`;
        const response = await fetch(wikiUrl);
        if (response.ok) {
          const data = await response.json() as any;
          const pages = data?.query?.pages;
          if (pages) {
            const pageId = Object.keys(pages)[0];
            if (pageId && pageId !== "-1") {
              const thumbnail = pages[pageId]?.thumbnail?.source;
              if (thumbnail && thumbnail.startsWith("http")) {
                posterUrl = thumbnail;
                break;
              }
            }
          }
        }
      } catch (err) {
        console.warn(`Wikipedia page images lookup failed for ${qTitle}:`, err);
      }
    }
  }

  return { posterUrl, imdbRating };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON payloads
  app.use(express.json());

  // API endpoint for processing vibe requests
  app.post("/api/recommend", async (req: express.Request, res: express.Response) => {
    try {
      const { vibe, cinemaType = "all" } = req.body;
      if (!vibe || typeof vibe !== "string" || !vibe.trim()) {
        return res.status(400).json({ 
          error: "A valid description of your mood or movie vibe is required. Let's try again!" 
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "Your Gemini API Key is missing. Please define GEMINI_API_KEY in the Settings > Secrets segment of your workspace."
        });
      }

      // Lazy initialization of the GoogleGenAI client (with correct user-agent header mapping)
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Craft region-specific constraints
      let regionConstraint = "You can suggest movies from any region (including Hollywood, Indian cinema/Bollywood/regional industries, or international cinema).";
      let promptTitleSearch = "real, acclaimed movies";

      if (cinemaType === "hollywood") {
        regionConstraint = "You MUST ONLY recommend Hollywood/Western and English-language movies. Do NOT recommend any Indian cinema (such as Bollywood, Tollywood, Kollywood,, Hindi, Tamil, Telugu, etc.) movies under any circumstances.";
        promptTitleSearch = "real, acclaimed Hollywood and English-language movies";
      } else if (cinemaType === "indian") {
        regionConstraint = "You MUST ONLY recommend Indian cinema movies. This includes Hindi (Bollywood), Tamil (Kollywood), Telugu (Tollywood), Malayalam, Bengali, Marathi, Kannada, and any other regional Indian filmmaker/industry films. Do NOT recommend Hollywood, Western, or other non-Indian movies under any circumstances.";
        promptTitleSearch = "real, acclaimed Indian cinema movies (Bollywood, Tollywood, Kollywood, etc.)";
      }

      const systemInstruction = 
        "You are an expert movie curator. The user will provide a specific mood, vibe, or obscure scenario. " +
        `Suggest actual, existing movies that are highly acclaimed and loved, strictly based on real public reviews, critical consensus, and audience feedback. Sourcing rules: ${regionConstraint} ` +
        "The reason for each movie must be exactly two sentences: the first sentence must explain how it fits the user's specific vibe, and the second sentence must describe what real viewers, critics, and people on the web specifically praise about it in their actual reviews. " +
        "You must recommend exactly 3 movies. Generate a YouTube search link for the trailer inside the 'trailerUrl' field.";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Recommend exactly 3 ${promptTitleSearch} matching the people's real reviews for this specific vibe: "${vibe.trim()}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "A list of exactly 3 movie recommendations aligned with the vibe.",
            items: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: "The movie title.",
                },
                year: {
                  type: Type.STRING,
                  description: "The launch or release year (YYYY).",
                },
                reason: {
                  type: Type.STRING,
                  description: "Exactly two sentences: First explaining how it matches the vibe, and the second stating what real users and people praise about it in real reviews.",
                },
                trailerUrl: {
                  type: Type.STRING,
                  description: "The YouTube search URL for the trailer, strictly in format: https://www.youtube.com/results?search_query=Movie+Name+Year+trailer",
                },
              },
              required: ["title", "year", "reason", "trailerUrl"],
            },
          },
        },
      });

      if (!response.text) {
        throw new Error("No response returned from the AI model.");
      }

      let parsedData;
      try {
        parsedData = JSON.parse(response.text.trim());
      } catch (parseError) {
        console.error("Parsing Gemini recommendation output error:", parseError, "Raw output:", response.text);
        return res.status(500).json({ 
          error: "Failed to assemble the recommendations array. Please check your query or try again!" 
        });
      }

      // Populate poster images and IMDb ratings for each recommendation concurrently!
      const recommendationsWithMetadata = await Promise.all(
        parsedData.map(async (movie: any) => {
          let posterUrl = null;
          let imdbRating = null;
          try {
            const meta = await fetchMovieMetadata(movie.title, movie.year);
            posterUrl = meta.posterUrl;
            imdbRating = meta.imdbRating;
          } catch (metaErr) {
            console.error(`Error querying metadata for ${movie.title}:`, metaErr);
          }
          return {
            ...movie,
            posterUrl,
            imdbRating
          };
        })
      );

      // Dynamically sort recommendations by IMDb rating in descending order
      recommendationsWithMetadata.sort((a, b) => {
        const ratingA = parseFloat(a.imdbRating || "0") || 0;
        const ratingB = parseFloat(b.imdbRating || "0") || 0;
        return ratingB - ratingA;
      });

      return res.json({ recommendations: recommendationsWithMetadata });
    } catch (error: any) {
      console.error("Proxy recommendation error:", error);
      return res.status(500).json({ 
        error: error.message || "An unexpected error occurred while looking up your vibe suggestions." 
      });
    }
  });

  // Serve static assets out of the client folder depending on deployment env
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched successfully on port ${PORT}`);
  });
}

startServer();
