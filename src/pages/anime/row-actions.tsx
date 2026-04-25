import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import {
  deleteAnime,
  type AnimeListItem,
  type SeriesOptionRes,
  type TagsOptionRes
} from '@/apis';
import {
  DataTableActionDialog,
  type ActionDialogProps
} from '@/components/custom/data-table/data-table-action-dialog';
import EditDialog from '@/pages/anime/edit-dialog';

interface RowActionsProps {
  row: AnimeListItem;
  onRefresh: () => void;
  seriesOption: SeriesOptionRes;
  tagsOption: TagsOptionRes;
}

interface DeleteDialogProps extends ActionDialogProps {}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ id, onRefresh }) => {
  const [open, setOpen] = useState(false);

  const { run, loading } = useRequest(deleteAnime, {
    manual: true,
    loadingDelay: 150,
    debounceWait: 250,
    onSuccess() {
      setOpen(false);
      onRefresh();
    }
  });

  const handleClick = () => run({ id });

  return (
    <DataTableActionDialog
      open={open}
      onOpenChange={setOpen}
      text='删除'
      title='删除番剧'
      description='此操作将删除该条番剧。 请确认是否继续?'
      className='text-destructive'
      onClick={handleClick}
      disabled={loading}
    />
  );
};

const RowActions: React.FC<RowActionsProps> = ({
  row,
  onRefresh,
  seriesOption,
  tagsOption
}) => {
  const { id } = row;

  return (
    <div className='flex items-center gap-2'>
      <EditDialog
        row={row}
        onRefresh={onRefresh}
        seriesOption={seriesOption}
        tagsOption={tagsOption}
      />
      <DeleteDialog
        id={id}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default RowActions;
