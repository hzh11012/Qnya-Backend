import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode
} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type SortingState
} from '@tanstack/react-table';
import { useThrottleFn } from 'ahooks';
import { cn } from '@/lib/utils';
import DataTablePagination from '@/components/custom/data-table/data-table-pagination';
import Exception from '@/components/custom/exception';
import DataTablePageSize from '@/components/custom/data-table/data-table-page-size';
import DataTableTotal from '@/components/custom/data-table/data-table-total';

/** 传统分页配置（已知总数） */
interface TotalPaginationConfig {
  mode: 'total';
  /** 总条数 */
  total: number;
  /** 总页数 */
  pageCount?: number;
}

/** 无限分页配置（只知道是否有下一页） */
interface HasMorePaginationConfig {
  mode: 'hasMore';
  /** 是否有下一页 */
  hasMore: boolean;
}

/** 分页配置联合类型 */
type PaginationConfig = TotalPaginationConfig | HasMorePaginationConfig;

/** 基础表格参数 */
interface DataTableBaseProps<TData, TValue> {
  /** 列定义 */
  columns: ColumnDef<TData, TValue>[];
  /** 表格数据 */
  data: TData[];
  /** 加载状态 */
  loading: boolean;
  /** 错误状态 */
  error: boolean;
  /** 分页状态 */
  pagination: PaginationState;
  /** 分页变更回调 */
  onPaginationChange: OnChangeFn<PaginationState>;
  /** 分页配置 */
  paginationConfig: PaginationConfig;
}

/** 可选表格功能参数 */
interface DataTableOptionalProps {
  /** pageSize 列表 */
  sizes?: number[];
  /** 排序状态 */
  sorting?: SortingState;
  /** 排序变更回调 */
  onSortingChange?: OnChangeFn<SortingState>;
  /** 列过滤状态 */
  columnFilters?: ColumnFiltersState;
  /** 列过滤变更回调 */
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
}

/** 可选表格样式参数 */
interface DataTableStyleProps {
  /** 表格类名 */
  className?: string;
  /** 内容区域类名 */
  contentClassName?: string;
  /** 头部区域类名 */
  headerClassName?: string;
}

/** 表格插槽参数 */
interface DataTableSlotProps {
  /** 自定义工具栏 */
  toolbar?: ReactNode;
}

type DataTableProps<TData, TValue> = DataTableBaseProps<TData, TValue> &
  DataTableOptionalProps &
  DataTableStyleProps &
  DataTableSlotProps;

/** 计算分页信息 */
const getPaginationInfo = (
  config: PaginationConfig,
  pagination: PaginationState
): {
  pageCount: number | undefined;
  canPreviousPage: boolean;
  canNextPage: boolean;
  currentPage: number;
} => {
  if (config.mode === 'total') {
    const pageCount =
      config.pageCount ?? Math.ceil(config.total / pagination.pageSize);
    return {
      pageCount,
      canPreviousPage: pagination.pageIndex > 0,
      canNextPage: pagination.pageIndex < pageCount - 1,
      currentPage: pagination.pageIndex + 1
    };
  }

  return {
    pageCount: undefined, // 未知总页数
    canPreviousPage: pagination.pageIndex > 0,
    canNextPage: config.hasMore,
    currentPage: pagination.pageIndex + 1
  };
};

const DataTable = <TData, TValue>({
  columns,
  data,
  loading,
  error,
  pagination,
  paginationConfig,
  sizes,
  sorting,
  columnFilters,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
  className,
  contentClassName,
  headerClassName,
  toolbar
}: DataTableProps<TData, TValue>) => {
  const tableContainerRef = useRef<HTMLTableElement>(null);
  const [isLeftStart, setIsLeftStart] = useState(false);
  const [isRightEnd, setIsRightEnd] = useState(false);

  /** 计算分页信息 */
  const paginationInfo = getPaginationInfo(paginationConfig, pagination);

  const table = useReactTable({
    data,
    columns,
    pageCount: paginationInfo.pageCount ?? -1,
    state: { pagination, sorting, columnFilters },
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    onColumnFiltersChange,
    onPaginationChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnPinning: {
        right: ['actions']
      }
    }
  });

  /** 获取固定列样式 */
  const getPinningStyles = (column: Column<TData, TValue>): CSSProperties => {
    const isPinned = column.getIsPinned();
    const styles: CSSProperties = {
      position: isPinned ? 'sticky' : 'relative',
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0
    };

    if (isPinned === 'left') {
      styles.left = `${column.getStart('left')}px`;
    } else if (isPinned === 'right') {
      styles.right = `${column.getAfter('right')}px`;
    }

    return styles;
  };

  const { run: handleScroll } = useThrottleFn(
    () => {
      const container = tableContainerRef.current;
      if (!container) return;

      const { scrollLeft, clientWidth, scrollWidth } = container;
      const isStart = scrollLeft <= 0;
      const isEnd = Math.abs(scrollLeft + clientWidth - scrollWidth) < 1;

      setIsLeftStart(isStart);
      setIsRightEnd(isEnd);
    },
    { wait: 100 }
  );

  useEffect(() => {
    handleScroll();
  }, [loading, handleScroll]);

  useEffect(() => {
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [handleScroll]);

  /** 渲染表头单元格 */
  const renderHeaderCell = (
    header: ReturnType<typeof table.getHeaderGroups>[0]['headers'][0]
  ) => {
    const { id, colSpan, column, isPlaceholder } = header;
    const isPinned = column.getIsPinned();
    const isLastLeftPinned =
      isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinned =
      isPinned === 'right' && column.getIsFirstColumn('right');

    return (
      <TableHead
        key={id}
        colSpan={colSpan}
        className={cn('relative border-y bg-card', {
          'shadow-l-fixed': isFirstRightPinned && !isRightEnd,
          'shadow-r-fixed': isLastLeftPinned && !isLeftStart
        })}
        style={getPinningStyles(column as Column<TData, TValue>)}
        data-pinned={isPinned || undefined}
      >
        {!isPlaceholder &&
          flexRender(column.columnDef.header, header.getContext())}
      </TableHead>
    );
  };

  /** 渲染数据单元格 */
  const renderDataCell = (
    cell: ReturnType<
      ReturnType<typeof table.getRowModel>['rows'][0]['getVisibleCells']
    >[0]
  ) => {
    const { id, column } = cell;
    const isPinned = column.getIsPinned();
    const isLastLeftPinned =
      isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinned =
      isPinned === 'right' && column.getIsFirstColumn('right');

    return (
      <TableCell
        key={id}
        className={cn('bg-background leading-8', {
          'shadow-l-fixed': isFirstRightPinned && !isRightEnd,
          'shadow-r-fixed': isLastLeftPinned && !isLeftStart
        })}
        style={getPinningStyles(column as Column<TData, TValue>)}
        data-pinned={isPinned || undefined}
      >
        {flexRender(column.columnDef.cell, cell.getContext())}
      </TableCell>
    );
  };

  /** 渲染表格状态 */
  const renderState = () => {
    const exceptionType = loading ? 'loading' : error ? 'error' : 'empty';

    return (
      <Exception
        type={exceptionType}
        className='h-36 md:h-48'
      />
    );
  };

  return (
    <div
      className={cn('text-foreground flex flex-col h-full gap-4', className)}
    >
      {/* 工具栏区域 */}
      {toolbar && (
        <div
          className={cn(
            'flex items-center justify-between gap-6',
            headerClassName
          )}
        >
          {toolbar}
        </div>
      )}

      {/* 表格区域 */}
      <Table
        ref={tableContainerRef}
        onScroll={handleScroll}
        className={cn(
          'border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b',
          contentClassName
        )}
      >
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(renderHeaderCell)}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody key={'table-body'}>
          {!loading && !error && table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map(renderDataCell)}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='h-142.25 text-center'
              >
                {renderState()}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* 分页区域 */}
      <div className='flex items-center justify-between flex-row-reverse'>
        <div className='flex items-center gap-6'>
          <DataTablePageSize
            table={table}
            pageSize={pagination.pageSize}
            sizes={sizes}
            disabled={loading}
          />
          <DataTablePagination
            table={table}
            paginationConfig={paginationConfig}
            paginationInfo={paginationInfo}
            disabled={loading}
          />
        </div>
        {/* 显示总条数 */}
        {paginationConfig.mode === 'total' && paginationConfig.total && (
          <DataTableTotal total={paginationConfig.total} />
        )}
      </div>
    </div>
  );
};

DataTable.displayName = 'DataTable';

export { DataTable, type PaginationConfig };
