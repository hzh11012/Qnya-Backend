import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ZodType } from 'zod';

interface CreateFormDialogOptions<TValues extends FieldValues> {
  schema: ZodType<TValues, FieldValues>;
  api: (params: any) => Promise<any>;
  FormComponent: React.ComponentType<any>;
  title: string;
  triggerText: string;
  triggerVariant?: 'default' | 'link';
  triggerSize?: 'default' | 'link';
  scrollable?: boolean;
  contentClassName?: string;
  onSuccessDelay?: number;
}

interface FormDialogProps<TValues extends FieldValues> {
  disabled?: boolean;
  defaultValues?: DefaultValues<TValues>;
  values?: TValues;
  onRefresh: () => void;
  transformSubmit?: (values: TValues) => any;
  formProps?: Record<string, any>;
}

function createFormDialog<TValues extends FieldValues>({
  schema,
  api,
  FormComponent,
  title,
  triggerText,
  triggerVariant = 'default',
  triggerSize,
  scrollable = false,
  contentClassName,
  onSuccessDelay
}: CreateFormDialogOptions<TValues>) {
  const FormDialog: React.FC<FormDialogProps<TValues>> = ({
    disabled,
    defaultValues,
    values,
    onRefresh,
    transformSubmit,
    formProps
  }) => {
    const [open, setOpen] = useState(false);

    const form = useForm<TValues>({
      resolver: zodResolver(schema) as Resolver<TValues>,
      ...(values ? { values } : { defaultValues }),
      mode: 'onSubmit',
      reValidateMode: 'onChange'
    });

    const { run, loading } = useRequest(api, {
      manual: true,
      loadingDelay: 150,
      debounceWait: 250,
      onSuccess() {
        setOpen(false);
        if (defaultValues) {
          form.reset();
        }
        if (onSuccessDelay) {
          setTimeout(onRefresh, onSuccessDelay);
        } else {
          onRefresh();
        }
      }
    });

    const handleSubmit = (formValues: TValues) => {
      run(transformSubmit ? transformSubmit(formValues) : { ...formValues });
    };

    const formContent = (
      <FormComponent
        form={form}
        onSubmit={handleSubmit}
        {...formProps}
      />
    );

    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>
          <Button
            disabled={disabled || loading}
            {...(triggerVariant !== 'default'
              ? { variant: triggerVariant }
              : {})}
            {...(triggerSize ? { size: triggerSize } : {})}
          >
            {triggerText}
          </Button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          {...(contentClassName ? { className: contentClassName } : {})}
        >
          <DialogHeader {...(contentClassName ? { className: 'px-6' } : {})}>
            <DialogTitle className='sm:text-left'>{title}</DialogTitle>
          </DialogHeader>
          {scrollable ? (
            <ScrollArea className='max-h-[calc(100vh-10rem)] sm:max-h-[calc(26rem)]'>
              <div className='px-6 pb-1'>{formContent}</div>
            </ScrollArea>
          ) : (
            formContent
          )}
          <DialogFooter
            className={`flex gap-6${contentClassName ? ' px-6' : ''}`}
          >
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

  return FormDialog;
}

interface RowActionsProps<T> {
  row: T;
  onRefresh: () => void;
}

export { createFormDialog };
export type { FormDialogProps, RowActionsProps };
