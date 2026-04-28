import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface DataTableTextTooltipProps {
  text: string;
  maxCount?: number;
}

const DataTableTextTooltip: React.FC<DataTableTextTooltipProps> = ({
  text,
  maxCount = 20
}) => {
  if (!text) return '-';

  if (text.length <= maxCount) return text;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{text.slice(0, maxCount)}...</span>
        </TooltipTrigger>
        <TooltipContent>
          <p className='max-w-64 max-h-64 overflow-y-auto scrollbar-hide break-all'>
            {text}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { DataTableTextTooltip };
