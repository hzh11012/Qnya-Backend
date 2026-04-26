import { useState } from 'react';
import { useRequest } from 'ahooks';
import { createTorrent, type ResourcesListItem } from '@/apis';
import { DataTableActionDialog } from '@/components/custom/data-table/data-table-action-dialog';
import type { RowActionsProps } from '@/components/custom/data-table/create-form-dialog';

interface DownloadDialogProps {
  url: string;
}

const DownloadDialog: React.FC<DownloadDialogProps> = ({ url }) => {
  const [open, setOpen] = useState(false);

  const { run, loading } = useRequest(createTorrent, {
    manual: true,
    loadingDelay: 150,
    debounceWait: 250,
    onSuccess() {
      setOpen(false);
    }
  });

  const handleClick = () => run({ torrentUrl: url });

  return (
    <DataTableActionDialog
      open={open}
      onOpenChange={setOpen}
      text='下载'
      title='确认下载'
      description='此操作无法撤销。 若需要, 请使用qBittorrent'
      onClick={handleClick}
      disabled={loading}
    />
  );
};

const RowActions: React.FC<Pick<RowActionsProps<ResourcesListItem>, 'row'>> = ({
  row
}) => {
  const { magnet } = row;

  return <DownloadDialog url={magnet} />;
};

export default RowActions;
