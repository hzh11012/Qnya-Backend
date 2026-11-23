import type { WatchRoomListItem } from '@/apis/watch-rooms';
import { formatDate } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Lock, Play, Search, Users } from 'lucide-react';
import RowActions from '@/pages/watch-rooms/row-actions';
import { DataTableColumnFilter } from '@/components/custom/data-table/data-table-column-filter';
import { DataTableTextTooltip } from '@/components/custom/data-table/data-table-text-tooltip';
import { Badge } from '@/components/ui/badge';

export const visibilityOptions = [
  { label: '公开', value: 'public' },
  { label: '私人', value: 'private' }
];

/** 观看内容一行文案：番名 + 集数标题，缺哪段都能降级显示 */
const formatNowPlaying = (video: WatchRoomListItem['currentVideo']) => {
  if (!video) return null;
  const episode = `第${video.episode}话`;
  return video.title
    ? `${video.animeName} · ${episode} ${video.title}`
    : `${video.animeName} · ${episode}`;
};

const getColumns = (onRefresh: () => void) => {
  const columns: ColumnDef<WatchRoomListItem>[] = [
    {
      accessorKey: 'name',
      header: () => {
        return (
          <div
            className='flex items-center gap-1'
            title='搜索框同时匹配房间名与房主昵称'
          >
            <span>房间名称</span>
            <Search className='size-3.5' />
          </div>
        );
      },
      cell: ({ row }) => (
        <span className='font-medium'>
          <DataTableTextTooltip text={row.original.name} />
        </span>
      )
    },
    {
      accessorKey: 'announcement',
      header: '公告',
      cell: ({ row }) =>
        row.original.announcement ? (
          <DataTableTextTooltip text={row.original.announcement} />
        ) : (
          <span className='text-muted-foreground'>-</span>
        )
    },
    {
      id: 'owner',
      accessorFn: row => row.owner.nickname,
      header: () => {
        return (
          <div
            className='flex items-center gap-1'
            title='搜索框同时匹配房间名与房主昵称'
          >
            <span>房主</span>
            <Search className='size-3.5' />
          </div>
        );
      }
    },
    {
      accessorKey: 'visibility',
      header: ({ column }) => {
        const facets = column.getFacetedUniqueValues();
        const filterValue = (column.getFilterValue() as string[]) ?? [];
        return (
          <div className='flex items-center gap-1'>
            <span>类型</span>
            <DataTableColumnFilter
              facets={facets}
              filterValue={filterValue}
              options={visibilityOptions}
              onFilterChange={val =>
                // 后端只接受单个可见性，收敛为单选（保留最后点选项）
                column.setFilterValue(
                  val?.length ? [val[val.length - 1]!] : undefined
                )
              }
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const option = visibilityOptions.find(
          item => item.value === row.original.visibility
        );
        const isPrivate = row.original.visibility === 'private';
        return (
          <Badge variant={isPrivate ? 'subtle-warning' : 'subtle'}>
            {isPrivate && <Lock className='size-3' />}
            {option?.label ?? row.original.visibility}
          </Badge>
        );
      }
    },
    {
      id: 'members',
      // 人数上限固定（建房即 5 人），「当前/上限」比只报当前更直观
      accessorFn: row => row.memberCount,
      header: '成员',
      cell: ({ row }) => {
        const { memberCount, maxMembers } = row.original;
        const full = memberCount >= maxMembers;
        return (
          // 列本身很窄，不 nowrap 的话「/ 5」会被折到第二行
          <div className='flex items-center gap-1 whitespace-nowrap'>
            <Users className='size-3.5 text-muted-foreground' />
            <span className={full ? 'text-amber-600' : undefined}>
              {memberCount}
            </span>
            <span className='text-muted-foreground'>/ {maxMembers}</span>
          </div>
        );
      }
    },
    {
      id: 'playback',
      // 房间存在即开放，没有「已关闭」这种状态；能看的是「在放 / 停着 / 还没选片」
      accessorFn: row => row.isPlaying,
      header: '放映状态',
      cell: ({ row }) => {
        const { isPlaying, currentVideo } = row.original;
        if (!currentVideo) {
          return <span className='text-muted-foreground'>未选片</span>;
        }
        return isPlaying ? (
          <Badge variant='subtle-success'>
            <Play className='size-3' />
            播放中
          </Badge>
        ) : (
          <Badge variant='subtle'>已暂停</Badge>
        );
      }
    },
    {
      id: 'currentVideo',
      accessorFn: row => row.currentVideo?.animeName ?? '',
      header: '观看内容',
      cell: ({ row }) => {
        const text = formatNowPlaying(row.original.currentVideo);
        if (!text) return <span className='text-muted-foreground'>未选择</span>;
        return <DataTableTextTooltip text={text} />;
      }
    },
    {
      accessorKey: 'createdAt',
      // 列表接口固定按创建时间倒序（没有 sort 参数），不给排序入口免得点了没反应
      header: '创建时间',
      cell: ({ row }) => {
        return formatDate(row.original.createdAt);
      }
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => {
        return (
          <RowActions
            row={row.original}
            onRefresh={onRefresh}
          />
        );
      }
    }
  ];
  return columns;
};

export default getColumns;
