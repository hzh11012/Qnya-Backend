import { createAnime } from '@/apis/anime';
import type { SeriesOptionRes } from '@/apis/series';
import type { TagsOptionRes } from '@/apis/tags';
import AnimeForm from '@/pages/anime/anime-form';
import { animeSchema } from '@/pages/anime/form-schema';
import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';
import { currentYear } from '@/pages/anime/columns';

const AddDialog = createFormDialog({
  schema: animeSchema,
  api: createAnime,
  FormComponent: AnimeForm,
  title: '新增',
  triggerText: '添加',
  scrollable: true,
  contentClassName: 'px-0'
});

interface AddDialogProps {
  disabled: boolean;
  onRefresh: () => void;
  seriesOption: SeriesOptionRes;
  tagsOption: TagsOptionRes;
}

const AnimeAddDialog: React.FC<AddDialogProps> = ({
  disabled,
  onRefresh,
  seriesOption,
  tagsOption
}) => (
  <AddDialog
    disabled={disabled}
    onRefresh={onRefresh}
    defaultValues={{
      seriesId: '',
      name: '',
      season: 1,
      seasonName: '',
      remark: '',
      description: '',
      cover: '',
      banner: '',
      status: 'draft',
      type: 'movie',
      year: currentYear,
      month: 'january',
      tags: [],
      director: '',
      cv: ''
    }}
    formProps={{ seriesOption, tagsOption }}
  />
);

export default AnimeAddDialog;
