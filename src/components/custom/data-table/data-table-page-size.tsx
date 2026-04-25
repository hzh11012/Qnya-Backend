import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { Table } from '@tanstack/react-table';

interface DataTablePageSizeProps<TData> {
  table: Table<TData>;
  /** 当前 pageSize */
  pageSize: number;
  /** pageSize 列表 */
  sizes?: number[];
  /** 是否禁用 */
  disabled?: boolean;
}

function DataTablePageSize<TData>({
  table,
  pageSize,
  sizes = [10, 20, 50],
  disabled = false
}: DataTablePageSizeProps<TData>) {
  return (
    <div className='flex items-center gap-2'>
      <span className='text-sm font-medium hidden md:block select-none'>
        每页数
      </span>
      <Select
        value={`${pageSize}`}
        onValueChange={value => {
          table.setPageSize(Number(value));
        }}
        disabled={disabled}
      >
        <SelectTrigger className='w-auto'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {sizes.map(size => (
              <SelectItem
                key={size}
                value={`${size}`}
              >
                {size}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

DataTablePageSize.displayName = 'DataTablePageSize';

export default DataTablePageSize;
