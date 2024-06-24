export interface GogoAnimeSources {
  headers: Headers;
  sources: Source[];
  download: string;
}

export interface Source {
  url: string;
  isM3U8: boolean;
  quality: string;
}

export interface Headers {
  Referer: string;
}

export interface HiAnime {
  tracks: Track[];
  intro: Intro;
  outro: Intro;
  sources: ZSource[];
  anilistID: number;
  malID: number;
}

export interface ZSource {
  url: string;
  type: string;
}

export interface Intro {
  start: number;
  end: number;
}

export interface Track {
  file: string;
  label?: string;
  kind: string;
  default?: boolean;
}
