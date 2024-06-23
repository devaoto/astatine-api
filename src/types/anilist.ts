export interface RootObject {
  data: Data;
}

export interface Data {
  Page: Page;
}

export interface Page {
  pageInfo: PageInfo;
  media: Media[];
}

export interface Media {
  id: number;
  idMal: number;
  status: string;
  title: Title;
  genres: string[];
  trailer: Trailer;
  description: string;
  format: string;
  bannerImage: string;
  coverImage: CoverImage;
  episodes: number;
  meanScore: number;
  duration: number;
  season: string;
  seasonYear: number;
  averageScore: number;
  nextAiringEpisode: NextAiringEpisode;
  studios: Studios;
  type: string;
  startDate: StartDate;
  endDate: EndDate;
  countryOfOrigin: string;
  favourites: number;
  hashtag: string;
  isAdult: boolean;
  synonyms: string[];
  tags: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  description: string;
  category: string;
  rank: number;
  isGeneralSpoiler: boolean;
  isMediaSpoiler: boolean;
  isAdult: boolean;
  userId: number;
}

export interface EndDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface StartDate {
  year: number;
  month: number;
  day: number;
}

interface Studios {
  edges: Edge[];
}

export interface Edge {
  isMain: boolean;
  node: Node;
}

export interface Node {
  id: number;
  name: string;
  isAnimationStudio: boolean;
}

export interface NextAiringEpisode {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
}

export interface CoverImage {
  extraLarge: string;
  large: string;
  medium: string;
  color: string;
}

export interface Trailer {
  id: string;
  site: string;
  thumbnail: string;
}

interface Title {
  userPreferred: string;
  romaji: string;
  english: string;
  native: string;
}

export interface PageInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}

export interface ReturnData {
  currentPage: number;
  hasNextPage: boolean;
  total: number;
  lastPage: number;
  results: Result[];
}

export interface Result {
  id: string;
  malId: number;
  title: Title;
  coverImage: string;
  trailer: string;
  description: string;
  status: string;
  bannerImage: string;
  rating: number;
  meanScore: number;
  releaseDate: number;
  startDate: StartDate;
  endDate: EndDate;
  color: string;
  genres: string[];
  totalEpisodes: number;
  duration: number;
  format: string;
  type: string;
  studios: string[];
  season: string;
  year: number;
  nextAiringEpisode: NextAiringEpisode;
  tags: ITag[];
}

export interface ITag {
  id: string;
  name: string;
  category: string;
  rank: number;
  isGeneralSpoiler: boolean;
  isMediaSpoiler: boolean;
  isAdult: boolean;
}
