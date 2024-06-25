import ky from "ky";
import { advancedSearchQuery } from "./queries";
import type { ReturnData, RootObject } from "../types/anilist";
import { convertStatus, getRandom } from "../utils";
import fullGenres from "./genres";

const { anilistGenres, tags: anilistTags } = fullGenres.reduce(
  (acc: { anilistGenres: string[]; tags: string[] }, item) => {
    if (item.type === "genres") {
      acc.anilistGenres = item.content;
    } else if (item.type === "tags") {
      acc.tags = item.content;
    }
    return acc;
  },
  { anilistGenres: [], tags: [] }
);

export const advancedSearch = async (
  query?: string,
  type: string = "ANIME",
  page: number = 1,
  perPage: number = 20,
  format?: string,
  sort?: string[],
  genresOrTags?: string[],
  id?: string | number,
  year?: number,
  status?: string,
  season?: string
) => {
  const genres: string[] = [];
  const tags: string[] = [];

  genresOrTags?.forEach((item) => {
    if (anilistGenres.includes(item)) {
      genres.push(item);
    } else if (anilistTags.includes(item)) {
      tags.push(item);
    }
  });

  const response = await (
    await ky.post(
      process.env.CORS_PROXY
        ? getRandom([
            `${process.env.CORS_PROXY}/https://graphql.anilist.co`,
            "https://graphql.anilist.co",
          ])!
        : "https://graphql.anilist.co",
      {
        json: {
          query: advancedSearchQuery,
          variables: {
            search: query,
            type: type,
            page: page,
            size: perPage,
            format: format,
            sort: sort,
            genres: genres.length > 0 ? genres : undefined,
            id: id,
            year: year ? `${year}%` : undefined,
            status: status,
            season: season,
            tags: tags.length > 0 ? tags : undefined,
          },
        },
      }
    )
  ).json<RootObject>();

  const res = {
    currentPage: response.data.Page.pageInfo.currentPage,
    hasNextPage: response.data.Page.pageInfo.hasNextPage,
    total: response.data.Page.pageInfo.total,
    lastPage: response.data.Page.pageInfo.lastPage,
    results: response.data.Page.media
      .filter((item) => item.status !== "NOT_YET_RELEASED")
      .map((item) => ({
        id: item.id.toString(),
        malId: item.idMal,
        title: item.title,
        coverImage:
          item.coverImage.extraLarge ??
          item.coverImage.large ??
          item.coverImage.medium,
        trailer: item.trailer?.id
          ? `https://www.youtube.com/watch?v=${item.trailer?.id}`
          : null,
        description: item.description,
        status: convertStatus(item.status),
        bannerImage:
          item.bannerImage ??
          item.coverImage.extraLarge ??
          item.coverImage.large ??
          item.coverImage.medium,
        rating: item.averageScore,
        meanScore: item.meanScore,
        releaseDate: item.seasonYear,
        startDate: item.startDate,
        color: item.coverImage?.color,
        genres: item.genres,
        totalEpisodes: isNaN(item.episodes)
          ? 0
          : item.episodes ?? item.nextAiringEpisode?.episode! - 1 ?? 0,
        duration: item.duration,
        format: item.format,
        type: item.type,
        studios: item.studios.edges.map((studio) => studio.node.name),
        season: item.season,
        year: item.seasonYear,
        nextAiringEpisode: item.nextAiringEpisode,
        tags: item.tags.map((tag) => ({
          id: tag.id.toString(),
          name: tag.name,
          category: tag.category,
          rank: tag.rank,
          isGeneralSpoiler: tag.isGeneralSpoiler,
          isMediaSpoiler: tag.isMediaSpoiler,
          isAdult: tag.isAdult,
        })),
        endDate: item.endDate,
      })),
  };

  return res as ReturnData;
};
