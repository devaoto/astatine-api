import ky from "ky";
import type { ReturnData, RootObject } from "./../types/anilist";
import { allTimePopularMoviesQuery } from "./queries";
import { convertStatus } from "../utils";

export const getPopularMovies = async (page: number, size: number) => {
  const response = (await (
    await ky.post("https://graphql.anilist.co", {
      json: {
        query: `${allTimePopularMoviesQuery}`,
        variables: {
          page,
          size,
          type: "ANIME",
          sort: ["POPULARITY_DESC", "SCORE_DESC"],
          format: "MOVIE",
          isAdult: false,
        },
      },
    })
  ).json()) as RootObject;

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
