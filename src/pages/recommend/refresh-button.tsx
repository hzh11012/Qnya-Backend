import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { refreshAffinity } from '@/apis/recommend';
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

/** 重建共现矩阵按钮：确认弹窗 + 请求期间禁用，完成后刷新状态查询 */
const RefreshAffinityButton = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: refreshAffinity,
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['recommend'] });
    }
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
          {isPending ? '重建中…' : '重建共现矩阵'}
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
            <DialogTitle className='text-center'>重建共现矩阵</DialogTitle>
            <DialogDescription>
              将清空并根据全量观看/追番/评分数据重新计算「猜你喜欢」的番剧亲和表。
              数据量大时耗时较长，日常由定时任务维护。请确认是否继续？
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

export default RefreshAffinityButton;
