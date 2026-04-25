import React, { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useRequest } from 'ahooks';
import { addAnime, type SeriesOptionRes, type TagsOptionRes } from '@/apis';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import AnimeForm from '@/pages/anime/anime-form';
import { animeSchema, type AnimeFormValues } from '@/pages/anime/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddDialogProps {
  disabled: boolean;
  onRefresh: () => void;
  seriesOption: SeriesOptionRes;
  tagsOption: TagsOptionRes;
}

const AddDialog: React.FC<AddDialogProps> = ({
  disabled,
  seriesOption,
  tagsOption,
  onRefresh
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<AnimeFormValues>({
    resolver: zodResolver(animeSchema),
    defaultValues: {
      seriesId: '',
      name: '',
      season: 1,
      seasonName: '',
      remark: '',
      description: '',
      cover: '',
      banner: '',
      status: 'draft',
      type: 'movie',
      year: new Date().getFullYear(),
      month: 'january',
      tags: [],
      director: '',
      cv: ''
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  });

  const { run, loading } = useRequest(addAnime, {
    manual: true,
    loadingDelay: 150,
    debounceWait: 250,
    onSuccess() {
      setOpen(false);
      form.reset();
      onRefresh();
    }
  });

  const handleSubmit = (values: AnimeFormValues) => {
    run({ ...values });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button disabled={disabled || loading}>添加</Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className='px-0'
      >
        <DialogHeader className='px-6'>
          <DialogTitle className='sm:text-left'>新增</DialogTitle>
        </DialogHeader>
        <ScrollArea className='max-h-[calc(100vh-10rem)] sm:max-h-[calc(26rem)]'>
          <div className='px-6 pb-1'>
            <AnimeForm
              form={form}
              seriesOption={seriesOption}
              tagsOption={tagsOption}
              onSubmit={handleSubmit}
            />
          </div>
        </ScrollArea>
        <DialogFooter className='flex gap-6 px-6'>
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
            onClick={form.handleSubmit(handleSubmit)}
            disabled={loading}
          >
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDialog;
