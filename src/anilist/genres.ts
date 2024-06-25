import tags from "./tags";

const anilistGenres: string[] = [
  "Action",
  "Adventure",
  "Cars",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

const fullGenres = [
  {
    type: "genres",
    content: anilistGenres,
  },
  { type: "tags", content: tags },
];

export default fullGenres;
