import * as React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import Exception from '@/components/custom/exception';

type Option = {
  value: string;
  label: string;
};

interface MultipleCommandProps {
  options: Option[];
  placeholder?: string;
  value: string[];
  onChange?: (values: string[]) => void;
}

export const MultipleCommand = ({
  options,
  placeholder = '请输入',
  value,
  onChange
}: MultipleCommandProps) => {
  const selectedSet = React.useMemo(() => new Set(value), [value]);

  const toggleValue = (val: string) => {
    const next = selectedSet.has(val)
      ? value.filter(v => v !== val)
      : [...value, val];
    onChange?.(next);
  };

  return (
    <Command>
      <CommandInput placeholder={placeholder} />
      <CommandList className='w-full overflow-auto'>
        <CommandEmpty>
          <Exception
            type='empty'
            className='h-32 md:h-36'
          />
        </CommandEmpty>
        <CommandGroup>
          {options.map(opt => (
            <CommandItem
              key={opt.value}
              value={opt.label}
              data-checked={selectedSet.has(opt.value)}
              onSelect={() => toggleValue(opt.value)}
            >
              {opt.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
