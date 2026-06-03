/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MovieRecommendation {
  title: string;
  year: string;
  reason: string;
  trailerUrl: string;
  posterUrl?: string | null;
  imdbRating?: string | null;
}

export interface VibeHistoryItem {
  id: string;
  vibe: string;
  timestamp: string;
  movies: MovieRecommendation[];
}
