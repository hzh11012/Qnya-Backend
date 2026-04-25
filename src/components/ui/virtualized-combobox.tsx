import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import Exception from '@/components/custom/exception';

type Option = {
  value: string;
  label: string;
};

interface VirtualizedCommandProps {
  options: Option[];
  placeholder?: string;
  value: string;
  onChange?: (option: string) => void;
}

export const VirtualizedCommand = ({
  options,
  placeholder = '请输入',
  value,
  onChange
}: VirtualizedCommandProps) => {
  const [filteredOptions, setFilteredOptions] =
    React.useState<Option[]>(options);
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const [isKeyboardNavActive, setIsKeyboardNavActive] = React.useState(false);

  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32
  });

  const virtualOptions = virtualizer.getVirtualItems();
  const virtualHeight = virtualizer.getTotalSize();

  const scrollToIndex = (index: number) =>
    virtualizer.scrollToIndex(index, { align: 'center' });

  const handleSearch = (search: string) => {
    setIsKeyboardNavActive(false);
    setFilteredOptions(
      options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex(prev => {
          const next =
            prev === -1 ? 0 : Math.min(prev + 1, filteredOptions.length - 1);
          scrollToIndex(next);
          return next;
        });
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex(prev => {
          const next =
            prev === -1 ? filteredOptions.length - 1 : Math.max(prev - 1, 0);
          scrollToIndex(next);
          return next;
        });
        break;
      }
      case 'Enter': {
        event.preventDefault();
        if (filteredOptions[focusedIndex]) {
          onChange?.(filteredOptions[focusedIndex].value);
        }
        break;
      }
    }
  };

  React.useEffect(() => {
    if (!value) return;
    const index = filteredOptions.findIndex(o => o.value === value);
    if (index !== -1) {
      setFocusedIndex(index);
      requestAnimationFrame(() => scrollToIndex(index));
    }
  }, [value]);

  const onKeyboard = () => setIsKeyboardNavActive(false);

  const onMouse = (index: number) =>
    !isKeyboardNavActive && setFocusedIndex(index);

  return (
    <Command
      shouldFilter={false}
      onKeyDown={handleKeyDown}
      value={value}
    >
      <CommandInput
        onValueChange={handleSearch}
        placeholder={placeholder}
      />
      <CommandList
        ref={parentRef}
        className='w-full overflow-auto'
        onMouseDown={onKeyboard}
        onMouseMove={onKeyboard}
      >
        <CommandEmpty>
          <Exception
            type='empty'
            className='h-32 md:h-36'
          />
        </CommandEmpty>
        <CommandGroup>
          <div
            style={{ height: `${virtualHeight}px` }}
            className='w-full relative'
          >
            {virtualOptions.map(({ size, index, start }) => {
              const opt = filteredOptions[index];
              const isFocused = focusedIndex === index;
              return (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  data-checked={opt.value === value}
                  className={cn(
                    'absolute left-0 top-0 w-full',
                    isFocused && 'bg-border text-foreground',
                    isKeyboardNavActive &&
                      !isFocused &&
                      'data-[selected=true]:bg-transparent'
                  )}
                  style={{
                    height: `${size}px`,
                    transform: `translateY(${start}px)`
                  }}
                  onMouseEnter={() => onMouse(index)}
                  onMouseLeave={() => onMouse(-1)}
                  onSelect={onChange}
                >
                  {opt.label}
                </CommandItem>
              );
            })}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
