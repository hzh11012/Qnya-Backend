import type { VideoListItem, AnimeOptionRes } from '@/apis';
import { createTableStore, type SimpleTableStore } from '@/store/base';

interface VideoExtra {
  animeOptions: AnimeOptionRes;
  setAnimeOptions: (options: AnimeOptionRes) => void;
}

type VideoStore = SimpleTableStore<VideoListItem> & VideoExtra;

const useVideoStore = createTableStore<VideoListItem, VideoExtra>(
  'video-store',
  set => ({
    animeOptions: [],
    setAnimeOptions: options =>
      set({ animeOptions: options } as Partial<VideoStore>)
  })
);

export { useVideoStore };
