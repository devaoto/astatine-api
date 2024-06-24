import type { HiAnime } from "../types/sources";
import ky from "ky";
import type {
  GogoAnimeSources,
  Headers,
  Source,
  Track,
} from "../types/sources";

const bky = ky.extend({ timeout: 9000 });

const fetchGogoAnime = async (episodeId: string): Promise<GogoAnimeSources> => {
  try {
    const response = await bky.get(
      `${process.env.CONSUMET_API}/meta/anilist/watch/${episodeId}`
    );
    return await response.json<GogoAnimeSources>();
  } catch (error) {
    console.error(error);
    return { headers: { Referer: "" }, sources: [], download: "" };
  }
};

const fetchZoroAnime = async (
  subType: "sub" | "dub" = "sub",
  episodeId: string
): Promise<HiAnime> => {
  try {
    const cleanEpisodeId = episodeId.replace(/\/watch\//g, "");
    const response = await bky.get(
      `${process.env.HIANIME_API}/anime/episode-srcs?id=${cleanEpisodeId}&server=vidstreaming&category=${subType}`
    );
    return await response.json<HiAnime>();
  } catch (error) {
    console.error(error);
    return {
      tracks: [],
      intro: { start: 0, end: 0 },
      outro: { start: 0, end: 0 },
      sources: [],
      anilistID: 0,
      malID: 0,
    };
  }
};

interface ReturnS {
  headers: Headers;
  sources: Source[];
  tracks: Track[];
  download: string;
}

export const getSources = async (
  source: "gogoanime" | "hianime",
  episodeId: string,
  subType: "sub" | "dub"
): Promise<ReturnS> => {
  if (source === "gogoanime") {
    const data = await fetchGogoAnime(episodeId);
    return {
      headers: data.headers as Headers,
      sources: data.sources as Source[],
      tracks: [],
      download: data.download as string,
    };
  } else if (source === "hianime") {
    const data = await fetchZoroAnime(subType, episodeId);
    return {
      headers: { Referer: "" },
      sources: data.sources.map((s) => ({
        ...s,
        quality: "default",
        isM3U8: true,
      })),
      tracks: data.tracks as Track[],
      download: "",
    };
  } else {
    throw new Error("Invalid source type");
  }
};
