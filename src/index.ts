import chalk from "chalk";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { getTrending } from "./anilist/getTrending";
import { HTTPException } from "hono/http-exception";
import type { ReturnData } from "./types/anilist";
import { getPopular } from "./anilist/getPopular";
import { getPopularMovies } from "./anilist/getPopularMovies";
import { getEpisodes } from "./provider/episode";
import { getSources } from "./provider/sources";
import { advancedSearch } from "./anilist/advancedSearch";

const app = new Hono();

app.use(prettyJSON());
app.use("/api/*", cors());

app.get("/api/", (c) => {
  return c.json({
    message: "Success! 🎉",
  });
});

app.get("/api/trending", async (c) => {
  let { page, limit } = c.req.query();

  if (!page) {
    page = "1";
  }
  if (!limit) {
    limit = "24";
  }

  if (isNaN(Number(page))) {
    throw new HTTPException(400, { message: "Page must be a number" });
  }

  if (isNaN(Number(limit))) {
    throw new HTTPException(400, { message: "Limit must be a number" });
  }

  const trending = await getTrending(Number(page), Number(limit));

  return c.json(trending);
});

app.get("/api/popular", async (c) => {
  let { page, limit, type, format } = c.req.query();

  if (!page) {
    page = "1";
  }
  if (!limit) {
    limit = "24";
  }
  if (!type) {
    type = "allTime";
  }

  if (!format) {
    format = "TV";
  }

  let popularData: ReturnData = {
    currentPage: 0,
    hasNextPage: false,
    total: 0,
    lastPage: 0,
    results: [],
  };

  if (isNaN(Number(page))) {
    throw new HTTPException(400, { message: "Page must be a number" });
  }

  if (isNaN(Number(limit))) {
    throw new HTTPException(400, { message: "Limit must be a number" });
  }

  if (type === "allTime" && format === "TV") {
    popularData = await getPopular(Number(page), Number(limit));
  } else if (type === "allTime" && format === "MOVIE") {
    popularData = await getPopularMovies(Number(page), Number(limit));
  }

  return c.json(popularData);
});

app.get("/api/episodes/:id", async (c) => {
  const { id } = c.req.param();

  if (!id) {
    throw new HTTPException(400, { message: "An ID is required" });
  }

  return c.json(await getEpisodes(id));
});

app.get("/api/sources/:provider/:episodeId", async (c) => {
  let { provider, episodeId } = c.req.param();
  let audio = c.req.query().audio as "sub" | "dub";

  if (!provider || (provider !== "gogoanime" && provider !== "hianime")) {
    provider = "hianime";
  }
  if (!episodeId) {
    throw new HTTPException(400, { message: "An episode ID is required" });
  }
  if (!audio || (audio !== "dub" && audio !== "sub")) {
    audio = "sub";
  }

  return c.json(
    await getSources(
      provider as "gogoanime" | "hianime",
      decodeURIComponent(episodeId),
      audio
    )
  );
});

app.get("/api/advanced-search", async (c) => {
  const {
    query,
    type = "ANIME",
    page = 1,
    perPage = 20,
    format,
    sort,
    genresOrTags,
    id,
    year,
    status,
    season,
  } = c.req.query();

  try {
    const searchResults = await advancedSearch(
      query,
      type,
      Number(page),
      Number(perPage),
      format,
      sort ? sort.split(",") : undefined,
      genresOrTags ? genresOrTags.split(",") : undefined,
      id,
      year ? Number(year) : undefined,
      status,
      season
    );
    return c.json(searchResults);
  } catch (error) {
    throw new HTTPException(500, {
      message: "Failed to perform advanced search",
      res: new Response((error as Error).message),
    });
  }
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  } else {
    return c.json({ message: "An error occurred" });
  }
});

console.log(chalk.green("✅ Server Started on PORT", chalk.bold(3000)));
console.log(chalk.cyan("🍂 API URL", chalk.bold("http://localhost:3000/api/")));

export default {
  port: 3000,
  fetch: app.fetch,
};
