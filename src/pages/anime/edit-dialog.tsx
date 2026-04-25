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
import {
  editAnime,
  type AnimeListItem,
  type SeriesOptionRes,
  type TagsOptionRes
} from '@/apis';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import AnimeForm from '@/pages/anime/anime-form';
import { animeSchema, type AnimeFormValues } from '@/pages/anime/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditDialogProps {
  row: AnimeListItem;
  onRefresh: () => void;
  seriesOption: SeriesOptionRes;
  tagsOption: TagsOptionRes;
}

const EditDialog: React.FC<EditDialogProps> = ({
  row,
  seriesOption,
  tagsOption,
  onRefresh
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<AnimeFormValues>({
    resolver: zodResolver(animeSchema),
    values: {
      seriesId: String(row.seriesId),
      name: row.name,
      season: row.season,
      seasonName: row.seasonName ?? '',
      remark: row.remark,
      description: row.description,
      cover: row.cover,
      banner: row.banner,
      status: row.status,
      type: row.type,
      year: row.year,
      month: row.month,
      tags: row.tags.map(tag => String(tag.id)),
      director: row.director,
      cv: row.cv
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  });

  const { run, loading } = useRequest(editAnime, {
    manual: true,
    loadingDelay: 150,
    debounceWait: 250,
    onSuccess() {
      setOpen(false);
      onRefresh();
    }
  });

  const handleSubmit = (values: AnimeFormValues) => {
    run({ ...values, id: row.id });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant='link'
          size='link'
        >
          编辑
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className='px-0'
      >
        <DialogHeader className='px-6'>
          <DialogTitle className='sm:text-left'>编辑</DialogTitle>
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

export default EditDialog;
