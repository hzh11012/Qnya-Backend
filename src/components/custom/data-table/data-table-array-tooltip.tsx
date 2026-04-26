import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface DataTableArrayTooltipProps {
  items: string[];
  maxCount?: number;
}

const DataTableArrayTooltip: React.FC<DataTableArrayTooltipProps> = ({
  items,
  maxCount = 3
}) => {
  if (!items || !items.length) return '-';

  const remaining = items.length - maxCount;

  if (remaining <= 0) return items.join(' / ');

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{items.slice(0, maxCount).join(' / ')} ...</span>
        </TooltipTrigger>
        <TooltipContent className='max-w-64 max-h-64 scroll-hidden'>
          {items.join(' / ')}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { DataTableArrayTooltip };
