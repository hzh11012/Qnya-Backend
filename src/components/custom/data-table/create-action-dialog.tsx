import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DataTableActionDialog,
  type ActionDialogProps
} from '@/components/custom/data-table/data-table-action-dialog';

interface UseActionDialogOptions {
  api: (params: { id: string }) => Promise<void>;
  text: string;
  title: string;
  description: string;
  className?: string;
  onSuccessExtra?: () => void;
}

type ActionDialogComponentProps = ActionDialogProps;

function createActionDialog({
  api,
  text,
  title,
  description,
  className,
  onSuccessExtra
}: UseActionDialogOptions) {
  const ActionDialog: React.FC<ActionDialogComponentProps> = ({
    id,
    onRefresh
  }) => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
      mutationFn: api,
      onSuccess() {
        setOpen(false);
        // 删除等操作可能影响下拉选项数据源，统一失效 options 缓存
        void queryClient.invalidateQueries({ queryKey: ['options'] });
        onRefresh();
        onSuccessExtra?.();
      }
    });

    const handleClick = () => {
      if (isPending) return;
      mutate({ id });
    };

    return (
      <DataTableActionDialog
        open={open}
        onOpenChange={setOpen}
        text={text}
        title={title}
        description={description}
        className={className}
        onClick={handleClick}
        disabled={isPending}
      />
    );
  };

  return ActionDialog;
}

export { createActionDialog };
export type { ActionDialogComponentProps };
