import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DataTableSearchProps {
  /** 默认的搜索类型 */
  defaultType?: string;
  /** 搜索类型 */
  types?: {
    label: string;
    value: string;
  }[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 搜索回调 */
  onSearch: (value: string) => void;
  /** 搜索类型选择回调 */
  onSelect?: (type: string | null) => void;
}

const DataTableSearch: React.FC<DataTableSearchProps> = ({
  defaultType,
  types,
  disabled = false,
  onSearch,
  onSelect
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(e.currentTarget.value);
    }
  };

  return (
    <>
      {types?.length && (
        <Select
          disabled={disabled}
          onValueChange={onSelect}
          defaultValue={defaultType}
        >
          <SelectTrigger className='rounded-e-none mr-0 focus:z-10'>
            <SelectValue placeholder='请选择' />
            <SelectContent>
              {types.map(type => {
                const { label, value } = type;
                return (
                  <SelectItem
                    key={value}
                    value={value}
                  >
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </SelectTrigger>
        </Select>
      )}
      <Input
        type='text'
        placeholder='请输入'
        className={cn('-ms-px shadow-none max-w-72 focus:z-10', {
          'rounded-s-none': types?.length
        })}
        disabled={disabled}
        onKeyDown={handleKeyDown}
      />
    </>
  );
};

DataTableSearch.displayName = 'DataTableSearch';

export default DataTableSearch;
