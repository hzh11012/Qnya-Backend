import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { reindexSearchIndex } from '@/apis/search';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Info, RefreshCw } from 'lucide-react';

/** 重建搜索索引按钮：确认弹窗 + 请求期间禁用，防止重复触发 */
const ReindexButton = () => {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: reindexSearchIndex,
    onSuccess: () => setOpen(false)
  });

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant='outline'
          disabled={isPending}
          className='gap-1.5'
        >
          <RefreshCw
            className={`size-3.5 ${isPending ? 'animate-spin' : ''}`}
          />
          {isPending ? '重建中…' : '重建搜索索引'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className='flex flex-col items-center gap-3'>
          <div className='flex size-9 shrink-0 items-center justify-center rounded-full border'>
            <Info
              className='opacity-80 text-primary'
              size={18}
            />
          </div>
          <DialogHeader>
            <DialogTitle className='text-center'>重建搜索索引</DialogTitle>
            <DialogDescription>
              将清空并从数据库重新灌入全部番剧搜索索引，耗时数秒到十几秒。
              日常无需执行，仅在索引数据异常时使用。请确认是否继续？
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter className='flex gap-6'>
          <DialogClose asChild>
            <Button
              type='button'
              className='flex-1'
              variant='outline'
            >
              取消
            </Button>
          </DialogClose>
          <Button
            type='submit'
            className='flex-1'
            onClick={() => mutate()}
            disabled={isPending}
          >
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReindexButton;
