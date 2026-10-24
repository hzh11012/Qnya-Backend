import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

/**
 * FormComponent 的公共 props：由本工厂注入；业务表单的 props 需包含这
 * 两项，额外的 props 经 formProps 传入（TFormProps 推断自表单组件类型）
 */
interface InjectedFormProps<TValues extends FieldValues> {
  form: UseFormReturn<TValues>;
  onSubmit: (values: TValues) => void;
}

interface CreateFormDialogOptions<
  TValues extends FieldValues,
  TApiParams = TValues,
  TFormProps extends InjectedFormProps<TValues> = InjectedFormProps<TValues>
> {
  schema: ZodType<TValues, FieldValues>;
  api: (params: TApiParams) => Promise<unknown>;
  FormComponent: React.ComponentType<TFormProps>;
  title: string;
  triggerText: string;
  triggerVariant?: 'default' | 'link';
  triggerSize?: 'default' | 'link';
  scrollable?: boolean;
  contentClassName?: string;
  onSuccessDelay?: number;
}

interface FormDialogProps<
  TValues extends FieldValues,
  TApiParams = TValues,
  TFormProps extends InjectedFormProps<TValues> = InjectedFormProps<TValues>
> {
  disabled?: boolean;
  defaultValues?: DefaultValues<TValues>;
  values?: TValues;
  onRefresh: () => void;
  /** 提交前把表单值转换为 api 入参（编辑场景附加 id 等） */
  transformSubmit?: (values: TValues) => NoInfer<TApiParams>;
  /** 传给 FormComponent 的额外 props（form/onSubmit 由工厂注入） */
  formProps?: Omit<TFormProps, keyof InjectedFormProps<TValues>>;
}

function createFormDialog<
  TValues extends FieldValues,
  TApiParams,
  TFormProps extends InjectedFormProps<TValues>
>({
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
}: CreateFormDialogOptions<TValues, TApiParams, TFormProps>) {
  const FormDialog: React.FC<
    FormDialogProps<TValues, TApiParams, TFormProps>
  > = ({
    disabled,
    defaultValues,
    values,
    onRefresh,
    transformSubmit,
    formProps
  }) => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<TValues>({
      resolver: zodResolver(schema) as Resolver<TValues>,
      ...(values ? { values } : { defaultValues }),
      mode: 'onSubmit',
      reValidateMode: 'onChange'
    });

    const { mutate, isPending } = useMutation({
      // 注意：不能写成箭头包装（params) => api(params)——React Compiler 会把
      // “仅引用外层工厂参数”的纯闭包错误提升到模块顶层，运行时 api 不在作用域，
      // 抛 ReferenceError 被 React Query 静默吞掉（弹窗点确认无任何反应）。
      // 直接传引用既避开该问题，也与 createActionDialog 写法一致。
      mutationFn: api,
      onSuccess() {
        setOpen(false);
        if (defaultValues) {
          form.reset();
        }
        // 新增/编辑可能改变下拉选项数据源（如新增系列后番剧表单的系列下拉），
        // 统一失效 options 缓存，避免共享缓存（staleTime 5min）导致选项过期
        void queryClient.invalidateQueries({ queryKey: ['options'] });
        if (onSuccessDelay) {
          setTimeout(onRefresh, onSuccessDelay);
        } else {
          onRefresh();
        }
      }
    });

    const handleSubmit = (formValues: TValues) => {
      if (isPending) return;
      // 无 transformSubmit 时表单值即 api 入参；TApiParams 由 api 推断，
      // 新增场景下与表单值结构一致，此处仅需跨泛型桥接
      const payload = transformSubmit
        ? transformSubmit(formValues)
        : ({ ...formValues } as unknown as TApiParams);
      mutate(payload);
    };

    const formContent = (
      <FormComponent
        {...({ form, onSubmit: handleSubmit, ...formProps } as TFormProps)}
      />
    );

    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>
          <Button
            disabled={disabled || isPending}
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
              disabled={isPending}
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
