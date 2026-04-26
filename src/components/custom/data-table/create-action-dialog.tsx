import { useState } from 'react';
import { useRequest } from 'ahooks';
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

    const { run, loading } = useRequest(api, {
      manual: true,
      loadingDelay: 150,
      debounceWait: 250,
      onSuccess() {
        setOpen(false);
        onRefresh();
        onSuccessExtra?.();
      }
    });

    const handleClick = () => run({ id });

    return (
      <DataTableActionDialog
        open={open}
        onOpenChange={setOpen}
        text={text}
        title={title}
        description={description}
        className={className}
        onClick={handleClick}
        disabled={loading}
      />
    );
  };

  return ActionDialog;
}

export { createActionDialog };
export type { ActionDialogComponentProps };
