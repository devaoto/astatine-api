import { getCurrentSeason } from "../utils";

export const trendingQuery = `query ($page: Int, $isAdult: Boolean = false, $size: Int, $sort: [MediaSort] = [TRENDING_DESC, POPULARITY_DESC], $type: MediaType) {
    Page(page: $page, perPage: $size) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(isAdult: $isAdult, sort: $sort, type: $type) {
        id
        idMal
        status(version: 2)
        title {
          userPreferred
          romaji
          english
          native
        }
        genres
        trailer {
          id
          site
          thumbnail
        }
        description
        format
        bannerImage
        coverImage {
          extraLarge
          large
          medium
          color
        }
        episodes
        meanScore
        duration
        season
        seasonYear
        averageScore
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        studios(isMain: true) {
          edges {
            isMain
            node {
              id
              name
              isAnimationStudio
            }
          }
        }
        type
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        countryOfOrigin
        favourites
        hashtag
        isAdult
        synonyms
        tags {
          id
          name
          description
          category
          rank
          isGeneralSpoiler
          isMediaSpoiler
          isAdult
          userId
        }
      }
    }
  }`;

export const allTimePopularQuery = `query ($page: Int, $isAdult: Boolean = false, $size: Int, $sort: [MediaSort] = [POPULARITY_DESC], $type: MediaType) {
    Page(page: $page, perPage: $size) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(isAdult: $isAdult, sort: $sort, type: $type) {
        id
        idMal
        status(version: 2)
        title {
          userPreferred
          romaji
          english
          native
        }
        genres
        trailer {
          id
          site
          thumbnail
        }
        description
        format
        bannerImage
        coverImage {
          extraLarge
          large
          medium
          color
        }
        episodes
        meanScore
        duration
        season
        seasonYear
        averageScore
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        studios(isMain: true) {
          edges {
            isMain
            node {
              id
              name
              isAnimationStudio
            }
          }
        }
        type
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        countryOfOrigin
        favourites
        hashtag
        isAdult
        synonyms
        tags {
          id
          name
          description
          category
          rank
          isGeneralSpoiler
          isMediaSpoiler
          isAdult
          userId
        }
      }
    }
  }`;

export const allTimePopularMoviesQuery = `
  query ($page: Int, $size: Int, $sort: [MediaSort], $format: MediaFormat, $isAdult: Boolean) {
  Page(page: $page, perPage: $size) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(isAdult: $isAdult, sort: $sort, format: $format) {
      id
      idMal
      status(version: 2)
      title {
        userPreferred
        romaji
        english
        native
      }
      genres
      trailer {
        id
        site
        thumbnail
      }
      description
      format
      bannerImage
      coverImage {
        extraLarge
        large
        medium
        color
      }
      episodes
      meanScore
      duration
      season
      seasonYear
      averageScore
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      studios(isMain: true) {
        edges {
          isMain
          node {
            id
            name
            isAnimationStudio
          }
        }
      }
      type
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      countryOfOrigin
      favourites
      hashtag
      isAdult
      synonyms
      tags {
        id
        name
        description
        category
        rank
        isGeneralSpoiler
        isMediaSpoiler
        isAdult
        userId
      }
    }
  }
}
`;

export const popularThisSeasonQuery = `query ($page: Int, $isAdult: Boolean = false, $size: Int, $sort: [MediaSort] = [POPULARITY_DESC], $type: MediaType, $season: MediaSeason = ${getCurrentSeason().toUpperCase()}, $seasonYear: Int = ${new Date().getFullYear()}) {
    Page(page: $page, perPage: $size) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(season: $season, seasonYear: $seasonYear, isAdult: $isAdult, sort: $sort, type: $type) {
        id
        idMal
        status(version: 2)
        title {
          userPreferred
          romaji
          english
          native
        }
        genres
        trailer {
          id
          site
          thumbnail
        }
        description
        format
        bannerImage
        coverImage {
          extraLarge
          large
          medium
          color
        }
        episodes
        meanScore
        duration
        season
        seasonYear
        averageScore
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        studios(isMain: true) {
          edges {
            isMain
            node {
              id
              name
              isAnimationStudio
            }
          }
        }
        type
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
      }
    }
  }`;

export const upcomingNextSeason = `query Query($season: MediaSeason, $seasonYear: Int, $sort: [MediaSort], $isAdult: Boolean, $type: MediaType, $isMain: Boolean, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(season: $season, seasonYear: $seasonYear, sort: $sort, isAdult: $isAdult, type: $type) {
          title {
            romaji
            english
            native
            userPreferred
          }
          countryOfOrigin
          nextAiringEpisode {
            airingAt
            episode
            id
            mediaId
            timeUntilAiring
          }
          coverImage {
            extraLarge
            large
            medium
            color
          }
          id
          idMal
          season
          seasonYear
          isAdult
          genres
          format
          studios(isMain: $isMain) {
            edges {
              isMain
              node {
                id
                name
                isAnimationStudio
              }
            }
          }
        }
        pageInfo {
          currentPage
          hasNextPage
          lastPage
          perPage
          total
        }
      }
    }`;

export const top100Anime = `query ($page: Int, $perPage: Int, $sort: [MediaSort], $type: MediaType, $isAdult: Boolean) {
  Page(page: $page, perPage: $perPage) {
    media(sort: $sort, type: $type, isAdult: $isAdult) {
      id
      idMal
      title {
        romaji
        english
        native
        userPreferred
      }
      description
      coverImage {
        extraLarge
        large
        medium
        color
      }
      bannerImage
      averageScore
      countryOfOrigin
      duration
      endDate {
        year
        month
        day
      }
      airingSchedule {
        edges {
          node {
            airingAt
            episode
            id
            mediaId
            timeUntilAiring
          }
        }
      }
      episodes
      favourites
      format
      genres
      hashtag
      isAdult
      meanScore
      popularity
      nextAiringEpisode {
        id
        airingAt
        timeUntilAiring
        episode
        mediaId
      }
      season
      seasonYear
      startDate {
        year
        month
        day
      }
      trailer {
        id
        site
        thumbnail
      }
      type
      updatedAt
      studios {
        edges {
          isMain
          node {
            id
            favourites
            isAnimationStudio
            isFavourite
            name
            siteUrl
          }
          id
        }
      }
    }
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
  }
}`;
