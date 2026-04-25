import React from 'react';
import { deleteSeries, type SeriesListItem } from '@/apis';
import { createActionDialog } from '@/components/custom/data-table/create-action-dialog';

interface RowActionsProps<T> {
  row: T;
  onRefresh: () => void;
}

const DeleteDialog = createActionDialog({
  api: deleteSeries,
  text: '删除',
  title: '删除系列',
  description: '此操作将删除该条系列。 请确认是否继续?',
  className: 'text-destructive'
});

const RowActions: React.FC<RowActionsProps<SeriesListItem>> = ({
  row,
  onRefresh
}) => {
  const { id } = row;

  return (
    <DeleteDialog
      id={id}
      onRefresh={onRefresh}
    />
  );
};

export default RowActions;
