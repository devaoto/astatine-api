import ky, { HTTPError } from "ky";
import {
  type MalSync,
  type AniZipData,
  type ConsumetEpisode,
  type Episodes,
  type ProviderData,
  type GogoAnimeInfo,
} from "../types/episode";
import _ from "lodash";

const bky = ky.extend({
  timeout: 9000
});

function convertString(input: string): string {
  if (!input.includes("$") && input.includes("?ep=")) return input;
  const parts = input.split("$");

  if (parts.length !== 4 || parts[1] !== "episode") {
    throw new Error("Invalid input format");
  }

  const mainPart = parts[0];
  const episodeNumber = parts[2];

  const output = `${mainPart}?ep=${episodeNumber}`;

  return output;
}

const getConsumet = async (id: string): Promise<ProviderData[]> => {
  const fetchGogoData = async (i: string, dub = false) => {
    try {
      const res = await bky.get(
        `${process.env.CONSUMET_API}/meta/anilist/episodes/${i}${
          dub ? "?dub=true" : ""
        }`
      );
      const data = await res.json<ConsumetEpisode[]>();

      if (data.length < 1) return [];
      return data.map((d) =>
        _.omit(d, ["image", "imageHash", "description", "createdAt"])
      );
    } catch (error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return [];
      } else {
        console.error(
          "An error occurred while fetching anime from consumet",
          error
        );
        return [];
      }
    }
  };

  const fetchHiAnime = async (i: string) => {
    try {
      const res = await bky.get(
        `${process.env.CONSUMET_API}/meta/anilist/episodes/${i}?provider=zoro`
      );
      const data = await res.json<ConsumetEpisode[]>();
      if (data.length < 1) return [];
      return data
        .map((d) =>
          _.omit(d, ["image", "imageHash", "description", "createdAt"])
        )
        .map((d) => ({
          ...d,
          id: convertString(d.id!),
        }));
    } catch (error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return [];
      } else {
        console.error(
          "An error occurred while fetching anime from consumet",
          error
        );
        return [];
      }
    }
  };

  try {
    const [dub, sub, hi] = await Promise.all([
      fetchGogoData(id, true),
      fetchGogoData(id),
      fetchHiAnime(id),
    ]);

    const zoroDub = dub.length > 0 ? hi : [];

    return [
      {
        providerId: "gogoanime",
        episodes: {
          sub: sub ?? [],
          dub: dub ?? [],
        },
      },
      {
        providerId: "hianime",
        episodes: {
          sub: hi ?? [],
          dub: zoroDub,
        },
      },
    ];
  } catch (error) {
    console.error("An error occurred while fetching anime data", error);
    return [
      {
        providerId: "gogoanime",
        episodes: {
          sub: [],
          dub: [],
        },
      },
      {
        providerId: "hianime",
        episodes: {
          sub: [],
          dub: [],
        },
      },
    ];
  }
};

const getMalSync = async (
  id: string
): Promise<{ sub: string; dub: string }> => {
  try {
    const res = await bky.get(
      `https://api.malsync.moe/mal/anime/anilist:${id}`
    );
    const data = await res.json<MalSync>();

    let subUrl = "";
    let dubUrl = "";

    if (data.Sites?.Gogoanime) {
      for (const key in data.Sites.Gogoanime) {
        const siteDetail = data.Sites.Gogoanime[key];
        const cleanedUrl = siteDetail.url.replace(
          /https?:\/\/[^/]+\/category\//,
          ""
        );

        if (key.includes("dub")) {
          dubUrl = cleanedUrl;
        } else {
          subUrl = cleanedUrl;
        }
      }
    }

    return { sub: subUrl, dub: dubUrl };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { sub: "", dub: "" };
  }
};

const getGogoAnime = async (id: string) => {
  try {
    const res = await bky.get(
      `${process.env.CONSUMET_API}/anime/gogoanime/info/${id}`
    );
    const data = await res.json<GogoAnimeInfo>();

    if (!data || !data.episodes) return [];

    return data.episodes;
  } catch (error) {
    console.error("An error occurred while fetching anime data", error);
    return [];
  }
};

const getMetadata = async (id: string) => {
  try {
    const res = await bky.get(`https://api.ani.zip/mappings?anilist_id=${id}`);
    const data = await res.json<AniZipData>();

    if (!data || !data.episodes) return {};
    return data.episodes;
  } catch (error) {
    console.error("An error occurred while fetching anime data", error);
    return {};
  }
};

const combineMetadataAndEpisodes = (
  consumetResponse: ProviderData[],
  metadataResponse: Episodes,
  combinedSubAndDub: ProviderData[]
): ProviderData[] => {
  if (consumetResponse.length < 1) {
    return [];
  }

  const gogoAnimeIndex = consumetResponse.findIndex(
    (provider) => provider.providerId === "gogoanime"
  );
  if (gogoAnimeIndex !== -1) {
    consumetResponse[gogoAnimeIndex] = combinedSubAndDub[0];
  }

  _.forEach(consumetResponse, (provider) => {
    _.forEach(["sub", "dub"], (type) => {
      provider.episodes[type as "sub" | "dub"] = _.map(
        provider.episodes[type as "sub" | "dub"],
        (
          episode: _.Omit<
            ConsumetEpisode,
            "image" | "imageHash" | "description" | "createdAt"
          >
        ) => {
          const metadataEpisode = metadataResponse[episode.number];
          if (metadataEpisode) {
            const title =
              metadataEpisode.title.en ||
              metadataEpisode.title["x-jat"] ||
              metadataEpisode.title.ja;
            return {
              ...episode,
              title,
              image: metadataEpisode.image,
              description: metadataEpisode.overview,
              rating: metadataEpisode.rating,
            };
          } else {
            return {
              ...episode,
              title: null,
              image: null,
              description: null,
              rating: null,
            };
          }
        }
      );
    });
  });

  return consumetResponse;
};

export const getEpisodes = async (id: string) => {
  const [consumet, meta, malsync] = await Promise.all([
    getConsumet(id),
    getMetadata(id),
    getMalSync(id),
  ]);

  const [sub, dub] = await Promise.all([
    malsync.sub !== "" ? getGogoAnime(malsync.sub) : Promise.resolve([]),
    malsync.dub !== "" ? getGogoAnime(malsync.dub) : Promise.resolve([]),
  ]);

  const combinedSubAndDub: ProviderData[] = [
    {
      providerId: "gogoanime",
      episodes: {
        sub: [...sub] as _.Omit<
          ConsumetEpisode,
          "image" | "imageHash" | "description" | "createdAt"
        >[],
        dub: [...dub] as _.Omit<
          ConsumetEpisode,
          "image" | "imageHash" | "description" | "createdAt"
        >[],
      },
    },
  ];

  return combineMetadataAndEpisodes(consumet, meta, combinedSubAndDub);
};
