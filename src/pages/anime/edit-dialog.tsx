import {
  updateAnime,
  type AnimeListItem,
  type SeriesOptionRes,
  type TagsOptionRes
} from '@/apis';
import AnimeForm from '@/pages/anime/anime-form';
import { animeSchema, type AnimeFormValues } from '@/pages/anime/form-schema';
import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';

const EditDialog = createFormDialog<AnimeFormValues>({
  schema: animeSchema,
  api: updateAnime,
  FormComponent: AnimeForm,
  title: '编辑',
  triggerText: '编辑',
  triggerVariant: 'link',
  triggerSize: 'link',
  scrollable: true,
  contentClassName: 'px-0'
});

interface EditDialogProps {
  row: AnimeListItem;
  onRefresh: () => void;
  seriesOption: SeriesOptionRes;
  tagsOption: TagsOptionRes;
}

const AnimeEditDialog: React.FC<EditDialogProps> = ({
  row,
  onRefresh,
  seriesOption,
  tagsOption
}) => (
  <EditDialog
    onRefresh={onRefresh}
    values={{
      seriesId: String(row.seriesId),
      name: row.name,
      season: row.season,
      seasonName: row.seasonName ?? '',
      remark: row.remark,
      description: row.description,
      cover: row.cover,
      banner: row.banner,
      status: row.status,
      type: row.type,
      year: row.year,
      month: row.month,
      tags: row.tags.map(tag => String(tag.id)),
      director: row.director,
      cv: row.cv
    }}
    transformSubmit={values => ({ ...values, id: row.id })}
    formProps={{ seriesOption, tagsOption }}
  />
);

export default AnimeEditDialog;
