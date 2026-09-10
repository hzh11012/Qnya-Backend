import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  DataTableActionDialog,
  type ActionDialogProps
} from '@/components/custom/data-table/data-table-action-dialog';

interface UseActionDialogOptions {
  api: (params: { id: number }) => Promise<void>;
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

    const { mutate, isPending } = useMutation({
      mutationFn: api,
      onSuccess() {
        setOpen(false);
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
