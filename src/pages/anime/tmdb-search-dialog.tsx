import { useState } from 'react';
import { useRequest } from 'ahooks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  scrapeSearch,
  scrapeDetail,
  type ScrapeSearchItem,
  type ScrapeDetailResult
} from '@/apis/anime';
import Exception from '@/components/custom/exception';

interface TmdbSearchDialogProps {
  onSelect: (detail: ScrapeDetailResult) => void;
}

const TmdbSearchDialog: React.FC<TmdbSearchDialogProps> = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<ScrapeSearchItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const { run: runSearch } = useRequest(scrapeSearch, {
    manual: true,
    debounceWait: 250,
    onSuccess(data) {
      setResults(data);
      setSearched(true);
      setLoading(false);
    },
    onError() {
      setLoading(false);
    }
  });

  const { run: runDetail, loading: fetchingDetail } = useRequest(scrapeDetail, {
    manual: true,
    debounceWait: 250,
    onSuccess(detail) {
      onSelect(detail);
      setOpen(false);
      resetState();
    }
  });

  const resetState = () => {
    setKeyword('');
    setResults([]);
    setSearched(false);
    setLoading(false);
  };

  const handleSearch = () => {
    if (!keyword.trim() || fetchingDetail) return;
    setResults([]);
    setSearched(false);
    setLoading(true);
    runSearch({ query: keyword.trim() });
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) resetState();
  };

  const busy = loading || fetchingDetail;

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <Button>TMDB</Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className='max-w-lg'
      >
        <DialogHeader>
          <DialogTitle>搜索 TMDB</DialogTitle>
        </DialogHeader>
        <div className='flex gap-2'>
          <Input
            placeholder='输入番剧名称...'
            value={keyword}
            disabled={fetchingDetail}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            disabled={busy || !keyword.trim()}
          >
            搜索
          </Button>
        </div>
        <ScrollArea className='h-80'>
          {loading && (
            <Exception
              type='loading'
              className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 md:h-36 w-fit'
            />
          )}
          {!loading && searched && results.length === 0 && (
            <Exception
              type='empty'
              className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 md:h-36 w-fit'
            />
          )}
          {!loading && results.length > 0 && (
            <div className='rounded-md border bg-card overflow-hidden'>
              {results.map(item => (
                <div
                  key={item.tmdbId}
                  onClick={() =>
                    !fetchingDetail &&
                    runDetail({
                      tmdbId: item.tmdbId,
                      mediaType: item.mediaType
                    })
                  }
                  className='flex gap-3 items-start px-3 py-2.5 border-b last:border-0 border-border/50 hover:bg-muted/50 transition-colors cursor-pointer data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed'
                  data-disabled={fetchingDetail}
                >
                  {item.cover ? (
                    <img
                      src={item.cover}
                      alt={item.name}
                      className='w-16 h-22 object-cover rounded shrink-0'
                    />
                  ) : (
                    <div className='w-16 h-22 bg-muted rounded shrink-0 flex items-center justify-center text-xs text-muted-foreground'>
                      无图
                    </div>
                  )}
                  <div className='flex flex-col gap-0.5 min-w-0 flex-1 h-22 overflow-hidden'>
                    <span
                      className='text-sm font-medium line-clamp-1 leading-snug'
                      title={item.name}
                    >
                      {item.name}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {item.mediaType === 'movie' ? '电影' : '剧集'}
                      {' · ID '}
                      {item.tmdbId}
                    </span>
                    <span
                      className='text-xs text-muted-foreground line-clamp-3 mt-0.5'
                      title={item.overview}
                    >
                      {item.overview}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TmdbSearchDialog;
