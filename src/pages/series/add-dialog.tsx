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
import { addSeries } from '@/apis';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import AddForm from '@/pages/series/add-form';
import { seriesSchema, type SeriesFormValues } from '@/pages/series/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';

interface AddDialogProps {
  disabled: boolean;
  onRefresh: () => void;
}

const AddDialog: React.FC<AddDialogProps> = ({ disabled, onRefresh }) => {
  const [open, setOpen] = useState(false);

  const form = useForm<SeriesFormValues>({
    resolver: zodResolver(seriesSchema),
    defaultValues: { name: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  });

  const { run, loading } = useRequest(addSeries, {
    manual: true,
    loadingDelay: 150,
    debounceWait: 250,
    onSuccess() {
      setOpen(false);
      form.reset();
      onRefresh();
    }
  });

  const handleSubmit = (values: SeriesFormValues) => {
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
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className='sm:text-left'>新增</DialogTitle>
        </DialogHeader>
        <AddForm
          form={form}
          onSubmit={handleSubmit}
        />
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
