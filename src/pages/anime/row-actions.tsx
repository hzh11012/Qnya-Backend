import {
  deleteAnime,
  type AnimeListItem,
  type SeriesOptionRes,
  type TagsOptionRes
} from '@/apis';
import { createActionDialog } from '@/components/custom/data-table/create-action-dialog';
import type { RowActionsProps } from '@/components/custom/data-table/create-form-dialog';
import EditDialog from '@/pages/anime/edit-dialog';

interface AnimeRowActionsProps extends RowActionsProps<AnimeListItem> {
  seriesOption: SeriesOptionRes;
  tagsOption: TagsOptionRes;
}

const DeleteDialog = createActionDialog({
  api: deleteAnime,
  text: '删除',
  title: '删除番剧',
  description: '此操作将删除该条番剧。 请确认是否继续?',
  className: 'text-destructive'
});

const RowActions: React.FC<AnimeRowActionsProps> = ({
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
