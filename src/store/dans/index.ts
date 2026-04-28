import type { DanmakuListItem } from '@/apis';
import { createTableStore } from '@/store/base';

const useDanmakuStore = createTableStore<DanmakuListItem>('danmaku-store');

export { useDanmakuStore };
